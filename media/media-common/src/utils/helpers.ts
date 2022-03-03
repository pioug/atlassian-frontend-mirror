export const isUndefined = (value: any) => value === undefined;

export const pick = (obj?: Object, keys: Array<String> = []) => {
  if (obj === undefined) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => keys.includes(k)),
  );
};

export const omitBy = (obj: Object, predicate: Function) =>
  Object.fromEntries(Object.entries(obj).filter(([k, v]) => !predicate(v)));

export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const matches = (srcObj: Object) => {
  return (obj: Object) => {
    let key: keyof typeof srcObj;
    for (key in srcObj) {
      if (obj[key] === undefined || obj[key] !== srcObj[key]) {
        return false;
      }
    }
    return true;
  };
};
