# 썰쟁 Studio v7.2 Cloud Complete

실제로 Firebase Authentication과 Cloud Firestore에 연결되는 배포용 버전입니다.

## 포함 파일

- `index.html` — 썰쟁 Studio 본체
- `js/firebase-cloud.js` — Firebase 설정, Google 로그인, 클라우드 저장/불러오기
- `api/generate.js` — Gemini 생성용 Vercel Function
- `firestore.rules` — 사용자별 데이터 격리 규칙
- `package.json`, `vercel.json` — Vercel 배포 설정

## 이미 완료한 Firebase 설정

- Firebase 프로젝트: `sseoljeng-studio`
- 웹 앱 등록
- Google 로그인 사용 설정
- Firestore 생성
- Firestore 사용자별 보안 규칙 게시

## GitHub 업로드

압축을 푼 폴더 자체가 아니라 폴더 안의 모든 항목을 저장소 루트에 올립니다.

반드시 아래 구조가 되어야 합니다.

```text
api/generate.js
js/firebase-cloud.js
firestore.rules
index.html
package.json
vercel.json
README.md
```

## Vercel 환경변수

기존 Gemini 환경변수를 유지합니다. 일반적으로 다음 이름을 사용합니다.

```text
GEMINI_API_KEY
```

기존 배포에서 AI 생성이 작동했다면 환경변수는 그대로 두면 됩니다.

## Google 로그인 허용 도메인

배포 후 Google 로그인에서 `auth/unauthorized-domain` 오류가 나오면 Firebase Console에서 다음 작업을 합니다.

1. Authentication
2. Settings
3. Authorized domains
4. 실제 Vercel 주소의 도메인을 추가

예:

```text
sseoljeng-studio.vercel.app
```

`https://`와 뒤쪽 경로는 넣지 않고 도메인만 넣습니다.

## 클라우드 저장 방식

Firestore 경로:

```text
users/{로그인 사용자 UID}/projects/{프로젝트 ID}
```

로그인한 사람은 자신의 프로젝트만 읽고 쓸 수 있습니다.

- 프로젝트/본문/프롬프트/캐릭터 설정: Firestore 동기화
- 캐릭터 얼굴 이미지: 현재 무료 플랜 때문에 각 브라우저 로컬 저장
- 입력 후 약 2.5초 뒤 자동 클라우드 저장
- `지금 저장` 버튼으로 즉시 저장 가능

## 첫 사용 테스트

1. Vercel 배포 완료 확인
2. 사이트 새로고침
3. `Google 로그인` 클릭
4. `새 클라우드 프로젝트` 클릭
5. 이름과 내용을 조금 변경
6. 상태창에 `클라우드 저장 완료` 표시 확인
7. Firebase Firestore Data 화면에서 `users` 컬렉션 생성 확인

## 주의

Firebase 공개 설정값(apiKey 등)은 웹 앱에서 보이는 것이 정상입니다. 실제 데이터 보호는 Firestore 보안 규칙과 Google 로그인으로 처리합니다.


## v7.2 Stable 수정 사항
- 누락된 `cfg()` 함수 복구
- 로컬/파일/클라우드 저장 시 설정값 정상 수집
- 마지막 클라우드 프로젝트 선택 유지
- Firestore 저장/불러오기 오류 처리 강화
