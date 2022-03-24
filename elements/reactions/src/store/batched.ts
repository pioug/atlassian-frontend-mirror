export function batch<T>(callback: (args: T[][]) => void) {
  let calls: T[][] = [];
  return (...args: T[]) => {
    if (calls.length === 0) {
      window.setTimeout(() => {
        callback(calls);
        calls = [];
      });
      calls = [];
    }
    calls.push(args);
  };
}

export function batchByKey<T>(
  callback: (key: string, args: T[][]) => void,
): (key: string, ...args: T[]) => void {
  const calls: { [key: string]: T[][] } = {};
  return (key: string, ...args: T[]) => {
    if (!calls[key]) {
      window.setTimeout(() => {
        callback(key, calls[key]);
        delete calls[key];
      });
      calls[key] = [];
    }
    calls[key].push(args);
  };
}
