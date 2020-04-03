export async function waitUntil(
  predicate: () => boolean,
  timeout: number = 100,
  maxRetries: number = 10,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const check = (retry: number) => {
      if (retry > 0) {
        if (predicate()) {
          resolve();
        } else {
          window.setTimeout(check, timeout, retry - 1);
        }
      } else {
        reject('timed out');
      }
    };

    check(maxRetries);
  });
}

export default waitUntil;
