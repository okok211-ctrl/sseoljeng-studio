Sseoljeng Studio v22.9.1 FAST_RENDER

1. Studio에서 autoedit-plan.json 생성
2. 이 FAST_RENDER 폴더에 아래 파일을 넣기
   - autoedit-plan.json
   - MP3
   - SRT
   - 사용 이미지 원본
3. 자막 위치 확인: RUN_30SEC_TEST.bat
4. 전체 출력: RUN_FAST_RENDER.bat

Python과 FFmpeg는 PC에 설치되어 있어야 합니다.

v22.9 원클릭 사용법
- 압축을 푼 최상위 폴더의 '썰쟁_원클릭_30초테스트.bat' : 먼저 자막/화면 확인
- '썰쟁_원클릭_렌더링.bat' : 전체 영상 만들기
- 실행하면 창이 차례로 뜨며 JSON → MP3 → SRT → 이미지 → 저장폴더만 고르면 됩니다.
- 선택한 원본은 자동으로 FAST_RENDER에 복사됩니다.
- 완성되면 지정한 저장폴더로 MP4를 복사하고 탐색기에서 자동으로 보여줍니다.
