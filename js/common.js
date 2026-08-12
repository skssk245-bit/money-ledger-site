// 공통 유틸리티

function formatNumber(n) {
  n = Math.round(n);
  return n.toLocaleString('ko-KR');
}

function parseNumber(str) {
  if (!str) return 0;
  const n = parseFloat(String(str).replace(/[^0-9.-]/g, ''));
  return isNaN(n) ? 0 : n;
}

// 입력창에 천단위 콤마 자동 적용
function attachCommaInput(input) {
  input.addEventListener('input', () => {
    const cursorFromEnd = input.value.length - input.selectionStart;
    const raw = parseNumber(input.value);
    input.value = raw ? formatNumber(raw) : '';
    const pos = Math.max(input.value.length - cursorFromEnd, 0);
    input.setSelectionRange(pos, pos);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[data-comma]').forEach(attachCommaInput);
});

// html2canvas 라이브러리 지연 로드 (필요할 때만 1회 로드)
function loadHtml2Canvas(callback) {
  if (window.html2canvas) { callback(); return; }
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  script.onload = callback;
  script.onerror = () => shareResultAsText(window.__shareTitle, window.__shareElId);
  document.head.appendChild(script);
}

// 결과 공유하기: 결과 카드를 이미지로 캡처해서 공유 (지원 안 되면 다운로드, 그것도 안 되면 텍스트)
function shareResult(title, resultElId) {
  const el = document.getElementById(resultElId);
  if (!el) return;
  window.__shareTitle = title;
  window.__shareElId = resultElId;

  loadHtml2Canvas(() => {
    html2canvas(el, {
      backgroundColor: '#123D2E',
      scale: 2,
      ignoreElements: (node) => node.classList && node.classList.contains('btn-share')
    }).then((canvas) => {
      canvas.toBlob(async (blob) => {
        if (!blob) { shareResultAsText(title, resultElId); return; }
        const file = new File([blob], 'calcbox-result.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: '계산박스 - ' + title,
              text: '[계산박스] ' + title + '\n' + location.href,
            });
            return;
          } catch (e) {
            return; // 사용자가 공유를 취소한 경우 등
          }
        }

        // 파일 공유 미지원 브라우저(대부분 PC): 이미지 다운로드로 대체
        const link = document.createElement('a');
        link.download = 'calcbox-' + title + '.png';
        link.href = URL.createObjectURL(blob);
        link.click();
        alert('결과 이미지가 다운로드되었습니다.\n카카오톡이나 문자에 이미지를 첨부해서 보내주세요.');
      }, 'image/png');
    }).catch(() => shareResultAsText(title, resultElId));
  });
}

// 폴백: 텍스트 공유/복사 (이미지 캡처가 실패했을 때만 사용)
function shareResultAsText(title, resultElId) {
  const el = document.getElementById(resultElId);
  if (!el) return;
  const text = '[계산박스] ' + title + '\n' + el.innerText.trim() + '\n\n' + location.href;

  if (navigator.share) {
    navigator.share({ title: '계산박스 - ' + title, text: text, url: location.href }).catch(() => {});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      alert('결과가 클립보드에 복사되었습니다.\n카카오톡, 문자 등에 붙여넣기(Ctrl+V) 해주세요.');
    }).catch(() => {
      alert(text);
    });
  } else {
    alert(text);
  }
}
