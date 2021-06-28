export const shallowEquals = <T>(
  [aRaw]: ReadonlyArray<unknown>,
  [bRaw]: ReadonlyArray<unknown>,
): boolean => {
  const a = aRaw as T;
  const b = bRaw as T;

  return !Object.keys(a).some((key) => {
    const k = (key as unknown) as keyof T;
    return a[k] !== b[k];
  });
};
