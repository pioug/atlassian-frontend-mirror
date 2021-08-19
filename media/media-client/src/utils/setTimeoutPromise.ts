export const resolveTimeout = <T>(
  timeout: number,
  resolveWith: T,
): Promise<T> =>
  new Promise((resolve, _reject) => {
    setTimeout(resolve, timeout, resolveWith);
  });

export const rejectTimeout = (
  timeout: number,
  rejectWith: Error,
): Promise<undefined> =>
  new Promise((_resolve, reject) => {
    setTimeout(reject, timeout, rejectWith);
  });
