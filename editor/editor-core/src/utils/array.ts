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
