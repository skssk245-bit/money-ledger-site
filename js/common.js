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
