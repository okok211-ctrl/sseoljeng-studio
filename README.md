# 썰쟁 Studio v20.8

- 벤치마킹 AI 분석 결과에 이미 생성된 후보 1·2·3을 그대로 읽어 선택 카드로 표시합니다.
- 닫는 태그가 빠진 AI 출력 형식도 인식하도록 파서를 보강했습니다.
- `각색 주제 3개에서 고르기` 버튼이 화면의 기존 분석 결과를 다시 파싱하므로 불필요한 재분석을 줄였습니다.
- A/B/C 후보 중 하나를 선택해 제목·주제를 프로젝트에 바로 적용할 수 있습니다.


## v21.0 SRT final guard
- Final SRT export now re-validates every cue.
- No cue can exceed the selected maximum display duration (default 6.5 seconds), including 100% original-text reconstruction mode.
- Overlap correction no longer stretches a cue into a long block.

## v21.1 SRT fixed-timeline mode
- CapCut SRT start/end timestamps are preserved exactly in original-text reconstruction mode.
- Only caption text is replaced/reallocated from the original script.
- This structurally prevents one caption from becoming minutes long.
- The uploaded 0810 (1).srt was inspected: 1,666 cues, longest original CapCut cue about 2.87 s, and zero cues longer than 6.5 s.

## v21.2 SRT aligned grouped captions
- Fixes the v21.1 issue where locking every CapCut cue produced mostly one-line captions.
- CapCut auto-caption text is fuzzy-matched sequentially against the original script.
- Adjacent CapCut cues are grouped into readable 2–3 line captions while keeping the group's real audio start/end timing.
- Original script text is restored from matched positions, including words CapCut omitted.
- Long restored text is split inside the same audio time range instead of being truncated.
