export const padArray = (arr: any[], size: number, value: any): any[] => {
  if (size === 0) {
    return arr;
  }
  const gap = new Array(size);
  gap.fill(value);
  return arr.length > 0 ? [...arr, ...gap] : gap;
};
