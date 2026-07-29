# 썰쟁 Studio v2

설치 없이 브라우저에서 사용하는 Vercel 배포용 웹앱입니다.

## 포함 기능
- 롱폼 15/20문단 생성
- 본문 이미지 장면 설계 및 AI 이미지 생성
- 여주 참고사진 업로드
- 쇼츠 4컷 생성
- 유튜브 업로드 정보
- 일본어판 변환
- SRT 자막
- 캡컷용 ZIP
- 브라우저 로컬 프로젝트 저장
- Supabase 연결 시 이메일 로그인 및 기기 간 프로젝트 동기화

## 1. Vercel 배포
1. 모든 파일을 GitHub 저장소 루트에 올립니다.
2. Vercel → Add New → Project → GitHub 저장소 Import → Deploy.
3. `프로젝트명.vercel.app` 주소가 생성됩니다.

## 2. OpenAI 연결
Vercel Settings → Environment Variables:
- OPENAI_API_KEY
- OPENAI_TEXT_MODEL=gpt-5-mini
- OPENAI_IMAGE_MODEL=gpt-image-1

## 3. 로그인 및 클라우드 저장
Supabase에서 새 프로젝트 생성 후 SQL Editor에 `supabase.sql` 내용을 실행합니다.
Vercel 환경변수:
- SUPABASE_URL
- SUPABASE_ANON_KEY

Supabase Authentication → URL Configuration에서 Site URL을 Vercel 주소로 설정합니다.

## 주의
OpenAI API 키는 index.html에 직접 적지 마세요.
Vercel 무료 호스팅과 OpenAI API 사용료는 별개입니다.
