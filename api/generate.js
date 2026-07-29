const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

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

  const maxTokens =
    task === "story" ? 20000 :
    task === "japanese" ? 20000 :
    12000;

  try {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(DEFAULT_MODEL)}:generateContent`;

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

    const data = await response.json();

    if (!response.ok) {
      const raw = data?.error?.message || `Gemini API 오류 ${response.status}`;
      let friendly = raw;
      if (response.status === 429) {
        friendly = "Gemini 무료 사용 한도에 도달했거나 요청이 너무 많습니다. 잠시 후 다시 시도하거나 Vercel의 GEMINI_MODEL을 무료 사용 가능한 모델로 변경하세요.";
      } else if (response.status === 403) {
        friendly = "API 키 권한 또는 무료 등급 사용 가능 여부를 확인하세요. Google AI Studio에서 만든 키인지 확인해야 합니다.";
      } else if (response.status === 404) {
        friendly = `현재 모델 '${DEFAULT_MODEL}'을 사용할 수 없습니다. Vercel 환경변수 GEMINI_MODEL을 사용 가능한 모델명으로 변경하세요.`;
      }
      return res.status(response.status).json({ error: friendly, detail: raw });
    }

    const text = (data.candidates || [])
      .flatMap(c => c.content?.parts || [])
      .map(p => p.text || "")
      .join("")
      .trim();

    if (!text) {
      const reason = data.candidates?.[0]?.finishReason || "응답 없음";
      return res.status(502).json({
        error: `Gemini가 내용을 생성하지 못했습니다. 종료 이유: ${reason}`
      });
    }

    return res.status(200).json({ text, model: DEFAULT_MODEL });
  } catch (error) {
    return res.status(500).json({
      error: "Gemini 서버 연결 중 오류가 발생했습니다.",
      detail: error?.message || String(error)
    });
  }
}
