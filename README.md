# 썰쟁 Studio v5.1 AI — 자동 모델 선택판

Gemini API 모델명이 바뀌거나 특정 모델을 사용할 수 없을 때, 현재 API 키에서 `generateContent`를 지원하는 모델 목록을 조회해 Flash 계열을 우선 자동 선택합니다.

## 업그레이드 방법

1. ZIP 압축을 풉니다.
2. GitHub 저장소의 기존 파일을 이 폴더의 파일로 교체합니다.
3. `index.html`, `api/generate.js`, `package.json`, `vercel.json`이 저장소 최상단에 오도록 업로드합니다.
4. GitHub 커밋이 끝나면 Vercel이 자동 배포합니다.
5. 자동 배포가 시작되지 않으면 Vercel → Deployments → 최신 배포의 `Redeploy`를 누릅니다.

## Vercel 환경변수

필수:

- `GEMINI_API_KEY`: Google AI Studio에서 만든 API 키

선택:

- `GEMINI_MODEL`: 특정 모델을 우선 사용하고 싶을 때만 입력

`GEMINI_MODEL`을 입력하지 않아도 프로그램이 사용 가능한 모델을 자동 선택합니다.

## 주요 변경점

- 고정 모델명 제거
- API의 Models 목록을 자동 조회
- Flash Lite → Flash → 기타 생성 모델 순으로 자동 선택
- 모델 미지원(404), 일부 한도 초과(429), 일시 장애 시 다음 모델 자동 재시도
- 실제 사용된 모델명을 완료 메시지에 표시
- 기존 프로젝트 저장, SRT, 쇼츠, 일본어판, 제작 자료 기능 유지

## 보안

API 키는 브라우저 코드에 들어가지 않고 Vercel 서버리스 함수에서만 읽습니다. API 키를 GitHub 파일에 직접 적지 마세요.
