const pickBy = (test: (key: string, value: any) => boolean, object: any): any =>
  Object.keys(object as Array<keyof typeof object>).reduce(
    (obj, key) =>
      test(String(key), object[key]) ? { ...obj, [key]: object[key] } : obj,
    {},
  );

export default pickBy;
