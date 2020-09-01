let delayId: number | null = null;

export function clearScheduled() {
  if (delayId != null) {
    window.clearTimeout(delayId);
    delayId = null;
  }
}

export function scheduleTimeout(fn: () => void, delay: number) {
  clearScheduled();

  delayId = window.setTimeout(() => {
    delayId = null;
    fn();
  }, delay);
}
