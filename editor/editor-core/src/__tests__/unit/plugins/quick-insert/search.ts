import { find } from '../../../../plugins/quick-insert/search';

describe('Quick Insert Search', () => {
  const getTitles = (item: { title: string }) => item.title;

  const items = [
    { priority: 1, title: 'Table' },
    { priority: 9, title: 'Panel' },
    { priority: 8, title: 'Code snippet' },
    { priority: 7, title: 'Date' },
    { priority: 6, title: 'Quote' },
    { priority: 2, title: 'Files and Images' },
    { priority: 3, title: 'Horizontal rule' },
    { priority: 4, title: 'Action' },
    { priority: 5, title: 'Decision' },
  ];

  it('should find exact match', () => {
    const results = find('Date', items);
    expect(results[0].title).toBe('Date');
  });

  it('should not match substring of a word which excludes first letter', () => {
    expect(find('zon', items).length).toEqual(0);
  });

  it('should match substring of a word which includes first letter', () => {
    const result = find('hor', items);
    expect(result[0].title).toEqual('Horizontal rule');
    expect(result.length).toEqual(1);
  });

  it('should match substring of a sentence which includes first letter of last word', () => {
    const result = find('rul', items);
    expect(result[0].title).toEqual('Horizontal rule');
  });

  it('should find an item approximately matching a query', () => {
    expect(find('dte', items)[0].title).toBe('Date');
  });

  it('should find items that approximately match a query', () => {
    expect(find('te', items).map(getTitles)).toEqual(['Table']);
  });

  it('should respect item priority', () => {
    expect(find('', items).map(getTitles)).toEqual([
      'Table',
      'Files and Images',
      'Horizontal rule',
      'Action',
      'Decision',
      'Quote',
      'Date',
      'Code snippet',
      'Panel',
    ]);
  });

  it('should respect item priority when 2 items match a query with the same score', () => {
    expect(
      find('code', [...items, { priority: 9, title: 'Code inline' }]).map(
        getTitles,
      ),
    ).toEqual(['Code snippet', 'Code inline']);
  });

  it('should not match string when character repeats more times than in original string', () => {
    expect(find('//', [{ title: '/' }])).toEqual([]);
  });

  it('should find items that match partial query containing trailing space', () => {
    expect(
      find('block ', [
        ...items,
        { priority: 9, title: 'Block extensions' },
      ]).map(getTitles),
    ).toEqual(['Block extensions']);

    expect(
      find('qu', [...items, { priority: 9, title: 'Block extensions' }]).map(
        getTitles,
      ),
    ).toEqual(['Quote']);
  });
});
