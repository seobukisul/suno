#!/usr/bin/env bash
# ==============================================================================
# JENT STUDIO Interactive Presentation Local Server
# ==============================================================================

PORT=8085
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🎙️ JENT STUDIO 프레젠테이션 로컬 서버 기동 중..."
echo "📂 프레젠테이션 경로: $DIR"
echo "🌐 프레젠테이션 허브: http://localhost:$PORT"
echo "   ├── [1] 프리 버전 발표 덱 (녹음 다운로드 & 수강생 선물): http://localhost:$PORT/free.html"
echo "   └── [2] 프로 버전 발표 덱 (기능 설명 & 실시간 데모):   http://localhost:$PORT/pro.html"
echo "--------------------------------------------------"
echo "💡 발표자 조작 단축키 안내:"
echo "   - [스페이스바] / [→] / [PageDown]: 다음 슬라이드"
echo "   - [←] / [PageUp]: 이전 슬라이드"
echo "   - [F]: 16:9 프로젝터 전체화면 토글"
echo "   - [N]: 발표자 큐시트 & 멘트 메모 서랍 열기/닫기"
echo "   - [ESC]: 10장 전체 슬라이드 오버뷰 덱 열기"
echo "--------------------------------------------------"

# 브라우저 자동 실행 시도 (백그라운드)
if which xdg-open > /dev/null; then
  (sleep 0.8 && xdg-open "http://localhost:$PORT") &
elif which open > /dev/null; then
  (sleep 0.8 && open "http://localhost:$PORT") &
fi

# 로컬 HTTP 서버 실행
cd "$DIR" && python3 -m http.server $PORT
