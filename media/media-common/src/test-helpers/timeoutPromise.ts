export function timeoutPromise(timeout: number, errorMessage: string) {
  return new Promise<string>((resolve, reject) => {
    setTimeout(reject, timeout, errorMessage);
  });
}
