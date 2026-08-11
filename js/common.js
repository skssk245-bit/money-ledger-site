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

// 결과 공유하기 (Web Share API, 미지원 브라우저는 클립보드 복사로 대체)
function shareResult(title, resultElId) {
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
