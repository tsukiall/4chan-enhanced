export default (callback, wait) => {
  let timeoutId = null;

  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, wait);
  };
}
