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


## v22.6 Fast FFmpeg Render
- `⚡ 고속 FFmpeg 팩` 추가
- 현재 자동편집 설계를 autoedit-plan.json으로 내보냄
- ZIP의 `고속렌더링/RUN_FAST_RENDER.bat`로 무료 로컬 FFmpeg 고속 렌더링
- 1920x1080 / 1080x1920 지원
- 이미지 줌/이동 + MP3 + 노란 자막/검정 테두리 MP4 합성
- 브라우저 실시간 1:1 녹화 제한 없음
- 유료 API 없음
