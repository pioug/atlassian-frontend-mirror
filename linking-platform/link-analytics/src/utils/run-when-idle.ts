/* eslint-disable compat/compat */

export const runWhenIdle = (callback: () => void) =>
  window.requestIdleCallback
    ? window.requestIdleCallback(callback, { timeout: 5000 })
    : window.requestAnimationFrame(callback);
