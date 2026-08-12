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
