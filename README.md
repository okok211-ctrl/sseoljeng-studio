# 썰쟁 Studio v20.8

- 벤치마킹 AI 분석 결과에 이미 생성된 후보 1·2·3을 그대로 읽어 선택 카드로 표시합니다.
- 닫는 태그가 빠진 AI 출력 형식도 인식하도록 파서를 보강했습니다.
- `각색 주제 3개에서 고르기` 버튼이 화면의 기존 분석 결과를 다시 파싱하므로 불필요한 재분석을 줄였습니다.
- A/B/C 후보 중 하나를 선택해 제목·주제를 프로젝트에 바로 적용할 수 있습니다.


## v22.0 Auto Editor Phase 1
- Known-good v20.8 base.
- Existing SRT code untouched.
- Isolated Auto Editor: audio/SRT/images, audio master duration, SRT checks, simple timeline preview.
- MP4 rendering intentionally deferred.

## v22.1 Character Face Backup Fix
- `캐릭터만 저장` JSON에 기준 얼굴 사진(Base64)을 함께 포함합니다.
- 다른 PC에서 `캐릭터 보관함 불러오기` 시 얼굴 이미지를 IndexedDB/캐시에 자동 복원합니다.
- 기존 구형 JSON도 불러올 수 있으며, 사진이 없는 구형 파일은 현재 PC의 기존 얼굴 정보를 가능한 한 보존합니다.
- v20.8에 있던 importCharacters의 잘못된 변수 참조도 수정했습니다.
- 기존 SRT 로직은 수정하지 않았습니다.

## v22.2 Auto Editor - Automatic Layout
- Existing Studio SRT/reconstruction logic remains untouched.
- Audio remains the absolute project duration.
- SRT text density + real cue times are used to create automatic image scene boundaries.
- Automatic gentle motion cycles: zoom in, zoom out, pan left/right.
- Scene start boundaries can be manually adjusted in seconds.
- Auto-edit plan can be exported to JSON for the upcoming local renderer.
- MP4 rendering is still disabled intentionally; next phase will connect the local FFmpeg renderer after layout validation.


## v22.3 Auto Preview
- MP3 재생시간에 맞춰 이미지 자동 전환 미리보기
- 자동 줌/이동 효과 미리보기
- 현재 SRT 자막 오버레이
- 16:9 / 9:16 미리보기
- 렌더링 설계 JSON 저장
- 기존 SRT 및 캐릭터 로직 미수정
- 유료 API 없음

## v22.4 Caption Style
- 자동편집 기본 자막: 노란색 글씨
- 강한 검정색 외곽선/그림자 적용
- 기존 자동배치, 음성동기 미리보기, SRT, 캐릭터 기능 유지

## v22.5 Browser Video Output
- 실제 `🎬 영상 출력` 버튼 추가
- 16:9 = 1920x1080, 9:16 = 1080x1920
- MP3 음성 + 자동 이미지 전환/줌/이동 + SRT 자막을 실제 영상으로 녹화
- 자막은 노란색 + 검정 외곽선, 최대 2줄
- 브라우저가 MP4 MediaRecorder를 지원하면 MP4, 아니면 WebM으로 자동 대체
- 완전 로컬 처리 / 유료 API 없음
- 브라우저 방식이라 영상 길이만큼 실시간 출력 시간이 필요함


## v22.9.3 Fast FFmpeg Render
- `⚡ 고속 FFmpeg 팩` 추가
- 현재 자동편집 설계를 autoedit-plan.json으로 내보냄
- ZIP의 `고속렌더링/RUN_FAST_RENDER.bat`로 무료 로컬 FFmpeg 고속 렌더링
- 1920x1080 / 1080x1920 지원
- 이미지 줌/이동 + MP3 + 노란 자막/검정 테두리 MP4 합성
- 브라우저 실시간 1:1 녹화 제한 없음
- 유료 API 없음

## v23.0 Paragraph-aware Image Mapping
- 자동편집 이미지 배치를 기존 '대사량 균등 분배'보다 Studio의 이미지 프롬프트 '사용 문단'을 우선 사용.
- 연결 순서: 이미지 프롬프트 사용 문단 → 롱폼 원고 문단 → SRT 실제 타임코드.
- 이미지 파일은 파일명 자연정렬(숫자/타임스탬프 순)을 적용.
- 자동편집 타임라인에 이미지 파일명, 사용 문단, 장면 시작 문장을 표시.
- 사용 문단 정보를 못 찾는 경우에만 기존 SRT 대사량 방식으로 fallback.

## v23.1 Image Order Lock + SRT Transition Timing
- 이미지 1→2→3→4→5→6 순서는 파일명 자연정렬 결과 그대로 고정.
- 이미지 문단 정보를 찾지 못해도 더 이상 'SRT 글자수 1/N' 방식으로 전환하지 않음.
- 각 목표 구간 주변에서 실제 SRT 문장 끝과 침묵(gap)을 찾아 자연스러운 이미지 전환 시점을 선택.
- 타임라인에 '이미지 순서 고정 · SRT 문장/쉼 기준 전환' 표시.
- 기존 문단→이미지→SRT 매핑이 성공하면 그 방식이 여전히 1순위.

## v23.2 Render Image Order Lock
- 원클릭 렌더에서 사용자가 파일 선택한 순서를 더 이상 사용하지 않음.
- Studio의 `autoedit-plan.json`에 저장된 `images[]` 순서를 최우선으로 사용.
- 렌더 시작 전 콘솔에 실제 렌더 이미지 1~N 순서를 출력.
- Studio 설계 이미지명과 선택 이미지명이 불일치할 때만 파일명 순으로 fallback.
- 장면의 이미지 인덱스 범위 검증 추가.

## v23.3 One-click + Project Workspace
- `썰쟁_원클릭_MP4만들기.bat` 추가: 원클릭 전체 렌더 진입점을 하나로 단순화.
- 저장 위치를 고르면 프로젝트별 작업폴더를 자동 생성.
- 프로젝트 폴더 안에 `01_INPUT` / `02_OUTPUT`으로 정리.
- `01_INPUT`: 실제 사용한 MP3, SRT, 이미지, 최종 autoedit-plan.json 보관.
- `02_OUTPUT`: 완성 MP4 보관.
- 상위 저장폴더에 `썰쟁_최근작업폴더.txt` 생성.
- FAST_RENDER는 렌더 엔진용 임시 작업장으로만 사용.
- 기존 30초 테스트/전체 렌더 BAT는 호환을 위해 유지.

## v23.4 Desktop Shortcut Fix
- 한글 경로/배치 인코딩 때문에 바로가기가 생성되지 않던 문제 수정.
- `바탕화면_바로가기_설치.bat` 추가.
- 실제 바로가기 생성은 PowerShell `create_desktop_shortcut.ps1`이 담당.
- 기존 `썰쟁 Studio 원클릭 MP4.lnk`가 있으면 중복 생성하지 않고 업데이트.
- `썰쟁_원클릭_MP4만들기.bat`를 직접 실행해도 바탕화면 바로가기를 자동 생성/복구.
- 브라우저 Studio 자체는 Windows 보안상 바탕화면 바로가기를 직접 만들 수 없으므로, 로컬 원클릭 실행기에서 자동 처리.

## v23.5 Render Speed Test
- v23.4의 이미지 순서/장면 시간/SRT/작업폴더 로직은 유지.
- QSV 하드웨어 인코딩을 계속 최우선 사용.
- CPU fallback 인코딩은 더 빠른 preset을 사용하도록 조정.
- `썰쟁_30초_속도테스트.bat` 추가.
- 먼저 같은 프로젝트로 30초 렌더 시간을 v23.4와 비교한 뒤 전체 롱폼에 적용 권장.
- 속도 최적화 단계에서는 화질/자막/장면 전환이 달라지지 않는지 반드시 30초 결과 확인.

## v23.6 TURBO
- 기존 FAST 모드는 그대로 보존.
- TURBO는 QSV/NVENC/AMF를 속도 우선 설정으로 조정.
- 이미지 기반 롱폼은 TURBO에서 24fps로 렌더해 생성 프레임을 약 20% 절감.
- 해상도 1920x1080, 음성, SRT, 노란 자막/검정 테두리, 이미지 순서/전환시간은 유지.
- `썰쟁_30초_터보테스트.bat`로 먼저 확인 후 `썰쟁_터보_전체렌더.bat` 사용.

## v23.7 Render Mode Chooser
- 바탕화면 `썰쟁 Studio 원클릭 MP4` 실행 시 TURBO / FAST 선택창 표시.
- TURBO 고속: 24fps + 속도 우선 하드웨어 인코더.
- FAST 안정: 기존 안정 렌더 설정.
- 선택 후 기존 원클릭 파일 선택/작업폴더/렌더 흐름으로 자동 진행.
- 기존 TURBO/FAST 직접 실행 BAT도 비상용으로 유지.

## v23.8 CapCut TTS Cleaner
- 원본/SRT 보존
- 따옴표, 말줄임표, !?, 불필요 기호 정리
- 마침표는 줄바꿈으로 변환해 문장 경계 유지
- 복사/TXT 저장 지원

## v23.9 CapCut TTS Paragraph Fix
- 문단 번호/표시 제거, 본문 유지
- 0문단도 표시만 제거하고 내용 유지
- 일반 숫자/연도/금액은 유지

## v23.10 Story Progress Guard
- 한 작품 안의 초반 사건 재설명/제자리 반복 방지 강화
- 각 문단 새 사건/정보/행동/결정 최소 1개 필수
- 분할 생성 시 이전 전체 문단 요약을 재사용 금지 검사표로 포함
- 삭제해도 줄거리 영향 없는 문단 생성 금지

## v23.11 Blueprint Diversity Guard
- 설계도 생성 단계에서 사건 중복 차단 강화.
- 45문단 기준 큰 에피소드 블록 최소 8개, 주요 장소 최소 6곳 목표.
- 같은 장소 3문단 이상 연속 금지(연속 클라이맥스 예외).
- 장소 변경 시 해당 장소에서만 가능한 새 사건/정보/행동 필수.
- 설계 출력 전 사건 반복/정보 중복/장소 편중/삭제 가능한 에피소드 자체검사 추가.
- 본문 생성에도 설계도의 장소 이동을 실제로 반영하도록 규칙 강화.
- 수정된 설계 프롬프트 블록 수: 4

## v23.12 Causal 15+15 Story Flow
- v23.11의 장소 다양성 강제 규칙을 제거/약화.
- 장소 변경은 다양성 점수로 취급하지 않음.
- 핵심을 원인→결과(A→B→C→D) 진행으로 변경.
- 기본 권장 30문단, 1~15 + 16~30 연속 창작 구조.
- 후반 16~30은 실제 작성된 1~15의 결과/미해결 문제/선택을 읽고 이어서 창작.
- 이미 해결된 사건 재탕 및 인과 없는 분량 채우기 에피소드 금지.
- 제거된 v23.11 장소 강제 프롬프트 블록: 4

## v23.13 Visible Causal Blueprint
- 30문단 설계도를 5문단 x 6블록으로 구조화.
- 각 블록에 핵심 사건 / 이전 사건의 원인 / 상태 변화 / 다음 사건의 원인을 의무 출력.
- 앞 블록의 다음 원인과 다음 블록의 이전 원인이 맞물리도록 강제.
- 장소 이동은 인과관계로 인정하지 않음.
- 추상적 감정 변화만으로 다음 사건을 발생시키는 설계 금지.
- 출력 전 6→1 역방향 인과 검사 추가.
- 수정된 설계 프롬프트 블록: 4

## v23.14 Counterfactual Causality + Name Guard
- 각 인접 블록에 'A가 없어도 B가 발생하는가?' 반사실 인과검사 추가.
- YES면 약한 인과로 판정하고 B를 재설계하도록 강제.
- A 삭제 → B 소멸 → C 약화의 도미노 의존성 권장.
- 장소/시간 순서만 이어지는 가짜 인과 차단.
- 등장인물 성경에 없는 고유 이름 생성 금지.
- 아이/조연은 이름이 없으면 관계·역할 호칭만 사용.
- 적용된 설계 프롬프트 블록 수: 4


## v23.15 Causal Actor Flow
- 인과 문구만 붙인 가짜 인과를 차단하고, A가 실제로 B의 동기·정보·선택을 만들어야 통과하도록 강화.
- 초반 1~5문단 안에 핵심 이상징후/말실수/행동을 배치해 단순 모욕 반복을 차단.
- 우연한 단서 이후에는 질문→거짓말→선택→관계 변화의 도미노 인과를 우선.
- 주인공이 조사·계획·증거수집·폭로를 독점하지 않도록 '인과 주체' 항목 추가.
- 의료기록·금융내역·DNA 등 비현실적 개인정보 획득 장치 금지 강화.
- 후반에 초반 갈등을 다시 반복해 폭로 명분을 만드는 구조 차단.
- 결말 5문단 고정 기능을 완화하고 핵심 사건을 27문단 전후까지 진행, 결과/일상은 마지막 2~3문단 압축 권장.
- 역방향 반사실 검사 문구의 YES/NO 논리도 명확하게 수정.
