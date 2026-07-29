let modelCache = { models: [], expiresAt: 0 };

function cleanModelName(name = "") {
  return String(name).replace(/^models\//, "").trim();
}

function rankModel(name) {
  const n = name.toLowerCase();
  let score = 0;
  if (n.includes("flash-lite")) score += 1000;
  else if (n.includes("flash")) score += 800;
  else if (n.includes("pro")) score += 300;
  if (n.includes("latest")) score += 120;
  if (/gemini-3|gemini-2\.5|gemini-2\.0/.test(n)) score += 80;
  if (n.includes("preview")) score -= 20;
  if (n.includes("exp")) score -= 80;
  if (/image|tts|audio|live|embedding|aqa|robotics/.test(n)) score -= 5000;
  return score;
}

async function listAvailableModels(apiKey) {
  const now = Date.now();
  if (modelCache.models.length && modelCache.expiresAt > now) return modelCache.models;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000",
    { headers: { "x-goog-api-key": apiKey } }
  );
  if (!response.ok) return [];

  const data = await response.json();
  const models = (data.models || [])
    .filter(m => (m.supportedGenerationMethods || []).includes("generateContent"))
    .map(m => cleanModelName(m.name))
    .filter(Boolean)
    .filter(n => !/image|tts|audio|live|embedding|aqa|robotics/i.test(n))
    .sort((a, b) => rankModel(b) - rankModel(a));

  modelCache = { models, expiresAt: now + 10 * 60 * 1000 };
  return models;
}

async function candidateModels(apiKey) {
  const configured = cleanModelName(process.env.GEMINI_MODEL || "");
  const available = await listAvailableModels(apiKey);

  // 환경변수 모델을 최우선으로 사용하고, 계정에서 실제 조회된 Flash 계열로 자동 대체합니다.
  const preferred = [
    configured,
    ...available.filter(n => /flash-lite/i.test(n)),
    ...available.filter(n => /flash/i.test(n)),
    ...available.filter(n => !/flash/i.test(n))
  ].filter(Boolean);

  return [...new Set(preferred)].slice(0, 8);
}

function extractText(data) {
  return (data.candidates || [])
    .flatMap(c => c.content?.parts || [])
    .map(p => p.text || "")
    .join("")
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 지원합니다." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Vercel 환경변수 GEMINI_API_KEY가 설정되지 않았습니다."
    });
  }

  const { prompt, task } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "생성할 요청문이 없습니다." });
  }
  if (prompt.length > 180000) {
    return res.status(413).json({ error: "요청문이 너무 깁니다." });
  }

  const maxTokens = task === "story" || task === "japanese" ? 20000 : 12000;
  const models = await candidateModels(apiKey);

  if (!models.length) {
    return res.status(503).json({
      error: "이 API 키에서 generateContent를 지원하는 Gemini 모델을 찾지 못했습니다. Google AI Studio에서 키와 프로젝트 상태를 확인하세요."
    });
  }

  const attempts = [];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: task === "story" ? 0.9 : 0.65,
            maxOutputTokens: maxTokens,
            topP: 0.95
          }
        })
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        const text = extractText(data);
        if (!text) {
          attempts.push(`${model}: 빈 응답`);
          continue;
        }
        return res.status(200).json({ text, model, autoSelected: model !== cleanModelName(process.env.GEMINI_MODEL || "") });
      }

      const raw = data?.error?.message || `HTTP ${response.status}`;
      attempts.push(`${model}: ${response.status} ${raw}`);

      // 모델 미지원·한도 초과·일시 장애는 다음 사용 가능한 모델로 자동 재시도합니다.
      if (![400, 404, 429, 500, 502, 503, 504].includes(response.status)) {
        if (response.status === 403) {
          return res.status(403).json({
            error: "API 키 권한을 확인하세요. Google AI Studio에서 만든 Gemini API 키인지 확인해야 합니다.",
            detail: raw
          });
        }
        break;
      }
    } catch (error) {
      attempts.push(`${model}: ${error?.message || String(error)}`);
    }
  }

  const quotaHit = attempts.some(x => x.includes(": 429"));
  return res.status(quotaHit ? 429 : 502).json({
    error: quotaHit
      ? "현재 계정에서 사용할 수 있는 Gemini 모델의 무료 한도에 도달했거나 무료 할당량이 제공되지 않았습니다. 잠시 후 다시 시도하세요."
      : "사용 가능한 Gemini 모델을 자동으로 찾아 재시도했지만 생성에 실패했습니다.",
    detail: attempts.slice(0, 8).join(" | ")
  });
}
