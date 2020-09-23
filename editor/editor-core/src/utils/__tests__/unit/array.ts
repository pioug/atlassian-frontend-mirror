import { filterUniqueItems } from '../../array';

describe('#filterUniqueItems', () => {
  it('should return unique items without a comparator', () => {
    const array = [1, 1, 2, 2, 3, 5, 5];
    const result = filterUniqueItems<number>(array);
    expect(result).toEqual([1, 2, 3, 5]);
  });

  it('should return unique items with a comparator', () => {
    const array = [
      { id: 1 },
      { id: 1 },
      { id: 2 },
      { id: 2 },
      { id: 3 },
      { id: 5 },
      { id: 5 },
    ];
    const result = filterUniqueItems<any>(array, (a, b) => a.id === b.id);
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 5 }]);
  });
});
