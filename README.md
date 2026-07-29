# 썰쟁 Studio v5 AI

Gemini API를 연결해 롱폼, 이미지 프롬프트, 쇼츠, 유튜브 정보, 썸네일, 일본어판, SRT를 자동 생성하는 Vercel 웹앱입니다.

## 중요
API 키는 `index.html`에 입력하지 않습니다. Vercel 환경변수에 저장하여 방문자에게 노출되지 않게 했습니다.

## GitHub 업로드
압축을 푼 뒤 저장소 루트에 다음 파일과 폴더를 업로드해 덮어씁니다.

- index.html
- package.json
- vercel.json
- README.md
- api 폴더 안의 generate.js

## Gemini API 키 만들기
1. Google AI Studio에서 API 키를 만듭니다.
2. 키를 다른 사람에게 보여주거나 GitHub에 올리지 않습니다.

## Vercel 환경변수 등록
1. Vercel에서 `sseoljeng-studio` 프로젝트를 엽니다.
2. Settings → Environment Variables로 이동합니다.
3. 아래 항목을 추가합니다.

이름:
GEMINI_API_KEY

값:
Google AI Studio에서 복사한 API 키

4. Production, Preview, Development를 모두 선택합니다.
5. Save를 누릅니다.
6. Deployments에서 최신 배포의 메뉴를 열고 Redeploy합니다.

## 모델 변경
기본 모델은 `gemini-2.5-flash`입니다. 계정의 무료 등급에서 이 모델을 사용할 수 없다는 오류가 뜨면 Vercel 환경변수에 아래 항목을 추가합니다.

이름:
GEMINI_MODEL

값:
현재 Google AI Studio에서 무료 사용 가능한 정확한 모델명

모델과 무료 한도는 Google 정책에 따라 바뀔 수 있습니다.

## 비용 주의
새 Google AI Studio 계정은 무료 등급으로 시작할 수 있지만, 무료 지원 모델과 한도는 계정·지역·시점에 따라 다를 수 있습니다. Google Cloud 결제를 직접 연결하거나 유료 등급으로 전환하지 않았다면 무료 한도 초과 시 일반적으로 요청 오류가 발생합니다. Google AI Studio의 Usage/Billing 화면에서 현재 등급을 확인하세요.
