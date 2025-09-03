export function debounce(fn, wait = 600) {
  // 타이머와 마지막 호출 정보 저장
  let timer = null,
    lastArgs = null,
    lastThis = null;

  // 지연된 함수 실행
  const run = () => {
    timer = null;
    fn.apply(lastThis, lastArgs);
  };

  // 디바운스된 함수
  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    clearTimeout(timer);
    timer = setTimeout(run, wait);
  }

  // 타이머 취소
  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };

  // 즉시 실행
  debounced.flush = () => {
    if (timer) {
      clearTimeout(timer);
      run();
    }
  };

  return debounced;
}
