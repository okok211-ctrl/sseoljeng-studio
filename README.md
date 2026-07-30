# 썰쟁 Studio v9.2.2 Stable

v9.2 Character Engine과 v9.2.1 이미지 비율 수정 사항을 안정화한 배포 버전입니다.

## 포함 기능

- 롱폼 본문 이미지 프롬프트: **16:9 가로형**
- 쇼츠 이미지 프롬프트: **9:16 세로형**
- 유튜브 썸네일 프롬프트: **16:9 가로형**
- 잘못 출력된 이미지 비율 문구 자동 교정
- 역할·나이 기반 한국 이름 랜덤 생성
- 캐릭터별 이름 재생성 및 이름 잠금
- 작품 내 이름 중복 방지
- `CHAR-001` 형식 내부 캐릭터 ID
- 핵심 인물 / 보조 인물 / 단역 분류
- 등록되지 않은 인물의 임의 이름 생성 제한
- Story Lock, 장편 분할 생성, 설정 검사
- Thumbnail Pro A/B/C 및 CTR 평가
- 독립 쇼츠 생성
- SRT 및 음성 AI용 원고
- 일본어판
- Firebase 로그인 및 Firestore 프로젝트 동기화
- 캡컷용 ZIP 출력

## GitHub 업로드 시 주의

압축을 푼 뒤 파일을 저장소 최상위에 업로드하세요.

- `index.html`은 반드시 **index.html**로 업로드
- `README.md`는 반드시 **README.md**로 업로드
- `api`, `js` 폴더 구조 유지
- 기존 저장소에서는 전체 파일을 교체하되 Firebase 환경 설정은 기존 값을 유지

## 배포 구조

```text
index.html
README.md
package.json
vercel.json
firestore.rules
api/generate.js
js/firebase-cloud.js
```
