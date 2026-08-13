Sseoljeng Studio v22.9.3.1 FAST_RENDER

1. Studio에서 autoedit-plan.json 생성
2. 이 FAST_RENDER 폴더에 아래 파일을 넣기
   - autoedit-plan.json
   - MP3
   - SRT
   - 사용 이미지 원본
3. 자막 위치 확인: RUN_30SEC_TEST.bat
4. 전체 출력: RUN_FAST_RENDER.bat

Python과 FFmpeg는 PC에 설치되어 있어야 합니다.

v22.9.3 원클릭 사용법
- 압축을 푼 최상위 폴더의 '썰쟁_원클릭_30초테스트.bat' : 먼저 자막/화면 확인
- '썰쟁_원클릭_렌더링.bat' : 전체 영상 만들기
- 실행하면 창이 차례로 뜨며 JSON → MP3 → SRT → 이미지 → 저장폴더만 고르면 됩니다.
- 선택한 원본은 자동으로 FAST_RENDER에 복사됩니다.
- 완성되면 지정한 저장폴더로 MP4를 복사하고 탐색기에서 자동으로 보여줍니다.

v22.9.3 수정
- 원클릭에서 선택한 MP3/SRT/이미지의 실제 파일명을 autoedit-plan.json에 자동 반영
- 긴 한글 SRT 파일명도 그대로 연결
- BAT 내부 문구를 ASCII 중심으로 바꿔 ?echo off / udio 같은 한글 인코딩 깨짐 방지
- Python 명령은 python → py 순으로 자동 탐색

v22.9.3 수정
- autoedit-plan.json의 UTF-8 BOM 때문에 Python JSON 파서가 실패하던 문제 수정
- Python은 utf-8-sig로 BOM 포함/미포함 JSON 모두 읽도록 변경
- PowerShell 원클릭 실행기는 JSON을 BOM 없는 UTF-8로 저장

v22.9.3 수정
- 원클릭에서 FAST_RENDER 안에 있는 기존 SRT/MP3/이미지를 다시 선택해도 안전하도록 TEMP 스테이징 추가
- 선택 파일을 먼저 Windows TEMP에 보존한 뒤 기존 입력 파일 정리
- 정리 후 선택한 파일을 FAST_RENDER로 복원하고 JSON 파일명을 연결
- 렌더 완료/실패 후 TEMP 자동 삭제

v23.2 수정
- Studio 렌더 설계의 이미지 순서를 최종 영상까지 그대로 유지
- 원클릭 파일 선택 순서 때문에 사진이 역순이 되던 문제 수정
- 렌더 시작 전에 실제 이미지 순서 1~N을 콘솔에 표시

v23.3
- 원클릭 MP4 만들기 추가
- 프로젝트별 작업폴더 자동 생성
- 01_INPUT / 02_OUTPUT 자동 분리
- 이전 작업과 새 작업 파일이 섞이지 않도록 개선

v23.4
- 바탕화면 바로가기 설치/복구 수정
- 한글 경로 대응 PowerShell 방식
- 원클릭 MP4 실행 시 바로가기 자동 생성/업데이트
