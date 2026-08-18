# 썰쟁 Studio v23.32

## v23.31 인과 진행성 개선
- 실제 작성 본문을 설계도 세부 장면보다 우선하도록 변경
- 분할 생성 시 직전 실제 본문 최대 3문단을 현재 진행선으로 전달
- 5문단 묶음 내부를 독립 에피소드가 아닌 문단별 도미노 인과로 강제
- 감정 반복 대신 행동·정보·관계·목표·위험의 상태 변화 필수화
- 불필요한 다음 모임·다음 명절·며칠 뒤 시간점프 억제
- 같은 기능의 갈등 반복 시 압축 후 다음 사건으로 전진

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


## v23.31 CONTINUITY STATE LOCK
- 이전 확정 본문 전체를 다음 분할 프롬프트에 CANON으로 주입
- 완료 사건 재생성 금지(COMPLETED EVENT LOCK)
- 시간/장소/참석 인물/현재 행동 상태 잠금(SCENE STATE LOCK)
- 직전 문단 결과를 다음 구간 첫 행동에 직접 결속(NEXT ACTION BINDING)
- 5문단 단위 에피소드 리셋 금지(NO RESET)
- 우연한 서류/휴대폰/엿듣기 증거 제한(EVIDENCE CONVENIENCE GUARD)
- 각 문단 신규 정보/행동/결과 검사(NEW INFORMATION GATE)

## v23.31 BLUEPRINT EVIDENCE STAGE GUARD
- 설계도 단계 이름 오타/미등록 고유 이름 차단
- 우연한 서류·휴대폰·엿듣기·무단 수색형 핵심 증거 차단
- 악역의 허세/해명/자기증명 행동 → 다음 증거로 이어지는 인과 강제
- 1~25문단 진실 공개 단계를 분리해 11~15에서 결말 선점 방지
- 기존 발언 대조 우선, 후반 갑툭튀 녹취/문자/캡처 억제
- 가족이 후반에 처음 충격받는 설정과 충돌하는 '사전 인지/방관' 복선 차단
- 에피소드 지도 완성 후 증거 편의성/진실 선점/이름 오류 자체 검사

## v23.31 LAST STATE + FIRST PARAGRAPH BINDING
- 직전 확정 문단 원문을 LAST STATE SNAPSHOT으로 최우선 주입
- 최근 5문단을 COMPLETED EVENTS BLACKLIST로 전달
- 다음 구간 첫 1~2문장을 직전 마지막 행동/대사에 강제 결속
- 질문 주체만 바꾼 반복(SUBJECT-SWAP DUPLICATION) 금지
- 이전 본문에 없던 제사/밥자리/방 안 대화 등 UNSEEN BACKSTORY 금지
- 각 문단이 반드시 새로운 상태를 만드는 FORWARD-ONLY GATE 추가

## v23.31 AUTO BODY CONTINUITY LOCK
- 자동 본문 생성 경로 bodyChunkPrompt()에 연속성 가드 직접 적용
- AUTO BODY LAST STATE SNAPSHOT 추가
- AUTO BODY COMPLETED EVENTS BLACKLIST 추가
- 자동 생성 첫 1~2문장을 직전 미완료 행동에 강제 결속
- 질문 주체만 바꾼 반복 방지
- 이전 본문에 없던 제사/밥자리/방 안 대화/새 서류의 갑작스러운 호출 차단
- 각 문단 FORWARD-ONLY GATE 적용
- GPT 분할 프롬프트뿐 아니라 자동 생성 경로에도 동일 철학 적용

## v23.31 PROJECT MEMORY ISOLATION
- 현재 프로젝트와 다른 주인공 이름이 사건 기억장에 있으면 stale memory로 차단
- 세컨폰/시누이 사업/집 담보/이혼 소송 등 이전 프로젝트 강한 시그니처가 섞인 기억장 차단
- 반복된 사건 기억장 섹션 중복 제거
- 첫 1~5문단에서는 0문단 NEXT ACTION BINDING 비활성화
- 현재 제목/주제/등장인물/설계도와 충돌하는 과거 기억장을 사용하지 않도록 프롬프트 가드 추가

## v23.31 MEMORY INJECTION FIX
- 실제 원인 수정: wizardPromptFor()의 raw memoryText() 삽입을 v2325SafeMemoryText()로 교체
- 전체 롱폼 프롬프트 buildLongformPrompt()도 동일하게 교체
- 현재 제목/주제/등장인물/설계도와 다른 주인공·사건 기억장은 프롬프트 조립 단계에서 실제 제거
- 사건 기억장 원본 UI/내보내기는 보존하되 생성 모델에는 검증본만 전달
- 설정 충돌 검사에도 검증된 기억장 사용

## v23.31 WRITTEN BLOCKS PROJECT ISOLATION
- writtenBlocks를 프로젝트 fingerprint(제목+주제+설계도+등장인물) 기준으로 격리
- 프로젝트 fingerprint가 바뀌면 이전 writtenBlocks 자동 초기화
- wizardPromptFor()와 bodyChunkPrompt() 모두 scoped writtenBlocks 사용
- 현재 설계도(동서/아이/출산 등)와 직전 본문(제사/밥자리/세컨폰 등)이 심하게 불일치하면 stale writtenBlocks 자동 제거
- 새 프로젝트/리셋 함수에서 writtenBlocks와 프로젝트 fingerprint 초기화

## v23.31 COMPLETE→NEXT CACHE RESET
- '완료하고 다음' 클릭 시 현재 프로젝트의 확정 본문만 먼저 캡처
- 이전 프로젝트/이전 생성 단계의 written_blocks, prompt cache, chunk cache, temp cache 정리
- in-memory writtenBlocks를 현재 프로젝트 확정 문단만으로 재구성
- 다음 5문단 생성 전에 현재 project fingerprint로 재결속
- 1~5→6~10뿐 아니라 6~10→11~15, 11~15→16~20 등 모든 단계 전환에 동일 적용
- current committed prose는 유지하고 stale/transient generation cache만 제거
- patched button id: fallback handler

## v23.31 STORY FIELD PROJECT ISOLATION
- 실제 원인 수정: wizardPromptFor()가 항상 #story 원고 칸을 읽으므로 story 자체를 프로젝트 fingerprint로 격리
- 프로젝트 변경 시 이전 프로젝트 원고 칸 자동 비우기
- 프로젝트 fingerprint가 없는 기존 세션에서도 현재 설계도와 의미가 다른 원고는 stale story로 감지해 삭제
- '완료하고 다음' 전에 현재 단계 문단(예: 1~5)이 원고 칸에 실제 존재하는지 검사
- 현재 단계 문단이 없으면 다음으로 넘어가지 않고 원고 탭으로 안내
- v2327CurrentProjectCommittedBlocks()가 잘못 참조하던 longformOutput/output 대신 실제 #story를 사용
- 현재 작품 1~5는 유지하고, 이전 작품 1~5만 제거하는 구조

## v23.31 SNAPSHOT HANDOFF + AUTO NEXT
- '완료하고 다음' 클릭 시 현재 5문단 원문 전체를 다음 프롬프트에 싣지 않고 LAST STATE SNAPSHOT으로 압축 저장
- snapshot에는 직전 구간/직전 문단/등장 인물/마지막 상태/미해결 질문/다음 시작점만 유지
- 6~10, 11~15 등 다음 프롬프트에서 이전 5문단 전체 CANON/BLACKLIST/중복 원문 제거
- 현재 프로젝트 snapshot만 사용하고 다른 프로젝트 snapshot은 자동 정리
- '완료하고 다음' 클릭 시 다음 5문단 구간으로 promptWizard.step 자동 증가
- 드롭다운도 가능한 경우 다음 구간으로 자동 동기화
- 수동 구간 선택 시에도 해당 구간 바로 앞 snapshot을 불러와 연속성 유지

## v23.31 WIZARD DEDICATED STATE
- 분할 생성 마법사의 연속성 데이터를 롱폼/원고 #story와 완전히 분리
- '완료하고 다음'은 마법사 전용 입력에서 현재 5문단을 읽어 전용 wizard_state에 저장
- 다음 구간에는 이전 5문단 원문 전체 대신 LAST STATE SNAPSHOT만 전달
- 완료 시 promptWizard.step과 실제 구간 드롭다운을 함께 자동 이동
- 드롭다운을 수동 변경해도 promptWizard.step과 프롬프트가 동기화
- '완료하고 다음'에서 롱폼/원고 탭으로 이동하는 기존 동작 제거
- 이전 프로젝트 wizard_state 자동 정리
- 6~10/11~15/... 모든 구간은 오직 현재 프로젝트 wizard_state만 참고

## v23.31 WIZARD RESULT INPUT
- GPT 분할 생성 마법사에 '방금 생성한 문단 붙여넣기' 전용 textarea 추가
- 완료하고 다음은 오직 wizardResultText만 읽음 (#story/롱폼 원고 참조 없음)
- 현재 5문단 저장 성공 후 붙여넣기 칸 자동 비움
- 다음 구간으로 promptWizard.step 자동 이동
- 실제 구간 드롭다운 동기화 + 다음 프롬프트 자동 갱신
- 수동으로 드롭다운 구간을 바꾸면 붙여넣기 칸도 비워서 구간 혼입 방지
- 빈 입력/문단 누락 시 다음 단계로 넘어가지 않고 입력칸에 포커스


## v23.32 SNAPSHOT HANDOFF CLEAN
- 분할 생성 프롬프트에서 `LAST STATE SNAPSHOT`만 연속성 전달에 사용합니다.
- `[현재 진행선 - 직전 실제 본문 3문단]` 자동 삽입을 제거했습니다.
- `[직전 N문단 끝부분 - 연결 참고용]` 자동 삽입을 제거했습니다.
- 따라서 직전 5문단 내용이 SNAPSHOT + 3문단 원문 + 마지막 문단 원문으로 중복 전달되지 않습니다.
- 완료된 구간 원문은 내부 wizard state에 보관되지만 다음 생성 프롬프트에는 그대로 싣지 않습니다.
