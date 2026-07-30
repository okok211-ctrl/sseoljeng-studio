# 썰쟁 Studio v10.0 Engine Rewrite

## 핵심 변경
- Story Engine과 Image Engine의 캐릭터 입력을 구조적으로 분리
- Story Engine에는 이름·나이·역할·성격만 전달
- 외모·헤어·안경·의상 정보는 Image/Thumbnail/Shorts Engine에서만 사용
- 롱폼 구간 생성 직후 외모 표현 자동 검출
- 검출 시 Gemini storyrepair 작업으로 사건과 분량을 유지한 채 자동 재작성
- 0문단 후킹 뒤 고정 구독 문구 자동 정규화
- 기존 v9 프로젝트 불러오기 호환 유지, schemaVersion 4

## 배포
압축을 풀어 저장소 최상위에 전체 파일을 덮어쓴 뒤 Vercel에서 재배포하세요.
환경변수 `GEMINI_API_KEY`가 필요합니다.

## v10.0.1 Alpha · POV Engine
- 1인칭 회고체와 3인칭 관찰자 규칙을 별도 엔진으로 분리했습니다.
- 1인칭 선택 시 주인공 이름의 반복 자기 지칭을 검사하고 자동 수정합니다.
- 3인칭 선택 시 서술문의 1인칭 혼입을 검사하고 자동 수정합니다.
- Story Engine에는 외모 정보가 전달되지 않고 Image Engine에만 전달됩니다.
- 안정 생성 과정에서 외모 표현 검사와 POV 검사 후 필요한 구간만 재작성합니다.
