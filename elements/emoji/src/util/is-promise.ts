export const isPromise = <T>(p: any): p is Promise<T> => !!(p && (p as Promise<T>).then);
