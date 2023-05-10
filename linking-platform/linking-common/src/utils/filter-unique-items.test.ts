import { filterUniqueItems } from '.';

describe('filter unique items', () => {
  it('can filter out duplicates based on predicate', () => {
    const listA = [{ name: 'Foo' }, { name: 'Bar' }];
    const listB = [{ name: 'Bar' }, { name: 'Susan' }, { name: 'Foo' }];

    const results = filterUniqueItems(
      [...listA, ...listB],
      (a, b) => a.name === b.name,
    );

    expect(results).toStrictEqual([
      { name: 'Foo' },
      { name: 'Bar' },
      { name: 'Susan' },
    ]);
  });
});
