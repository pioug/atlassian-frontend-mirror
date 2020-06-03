import { appendRows, prependRows } from '../generateRowValues';

describe('prependRows', () => {
  it('returns an empty array when itemsPerPage is undefined', () => {
    expect(prependRows(undefined, 2)).toEqual([]);
  });

  it('returns an empty array when pageNumber is undefined', () => {
    expect(prependRows(3, undefined)).toEqual([]);
  });

  it('returns an empty array when pageNumber is 1', () => {
    expect(prependRows(3, 1)).toEqual([]);
  });

  it('returns the correct number of items', () => {
    expect(prependRows(6, 2).length).toBe(6);
  });
});

describe('appendRows', () => {
  it('returns an empty array when totalItems is undefined', () => {
    expect(appendRows(3, 3, 2, undefined)).toEqual([]);
  });

  it('returns an empty array when pageNumber is undefined', () => {
    expect(appendRows(3, 3, undefined, 6)).toEqual([]);
  });

  it('returns an empty array when itemsPerPage is undefined', () => {
    expect(appendRows(3, undefined, 2, 6)).toEqual([]);
  });

  it('returns the correct number of items', () => {
    expect(appendRows(6, 6, 2, 100).length).toBe(90);
  });

  it('returns the correct number of items when rowsLength is greater than itemsPerPage', () => {
    expect(appendRows(8, 6, 2, 100).length).toBe(88);
  });

  it('returns an empty array for the last page', () => {
    expect(appendRows(6, 17, 100)).toEqual([]);
  });
});
