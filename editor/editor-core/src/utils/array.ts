export function findUniqueItemsIn<T>(
  findIn: Array<T>,
  checkWith: Array<T>,
  comparator?: (firstItem: T, secondItem: T) => boolean,
): Array<T> {
  return findIn.filter(
    (firstItem) =>
      checkWith.findIndex((secondItem) =>
        comparator
          ? comparator(firstItem, secondItem)
          : firstItem === secondItem,
      ) === -1,
  );
}

export function filterUniqueItems<T>(
  arr: Array<T>,
  comparator?: (firstItem: T, secondItem: T) => boolean,
): Array<T> {
  return arr.filter((firstItem, index, self) => {
    return (
      self.findIndex((secondItem) =>
        comparator
          ? comparator(firstItem, secondItem)
          : firstItem === secondItem,
      ) === index
    );
  });
}
