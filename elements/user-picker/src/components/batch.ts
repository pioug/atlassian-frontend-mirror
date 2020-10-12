type CallsType<T> = {
  [key: string]: T[][];
};

export function batchByKey<T>(
  callback: (key: string, args: T[][]) => void,
): (key: string, ...args: T[]) => void {
  const calls: CallsType<T> = {};
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
