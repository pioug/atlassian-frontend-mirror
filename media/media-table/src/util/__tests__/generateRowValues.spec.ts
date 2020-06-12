import {
  appendRows,
  prependRows,
  generateEmptyRow,
} from '../generateRowValues';
import { HeadCellType, RowCellType } from '@atlaskit/dynamic-table/types';

const headerCells: HeadCellType[] = [
  {
    key: 'file',
    width: 50,
    content: 'File name',
    isSortable: true,
  },
  {
    key: 'size',
    width: 20,
    content: 'Size',
    isSortable: true,
  },
  {
    key: 'date',
    width: 50,
    content: 'Upload time',
    isSortable: false,
  },
  {
    key: 'download',
    content: '',
    width: 10,
  },
];

const mockEmptyCells: RowCellType[] = [
  {
    key: 'file',
    content: '',
  },
  {
    key: 'size',
    content: '',
  },
  {
    key: 'date',
    content: '',
  },
  {
    key: 'download',
    content: '',
  },
];

describe('generateEmptyRow', () => {
  it('generates empty row cells from the provided header cells', () => {
    expect(generateEmptyRow(headerCells)).toEqual(mockEmptyCells);
  });
});

describe('prependRows', () => {
  it('returns an empty array when itemsPerPage is undefined', () => {
    expect(prependRows(mockEmptyCells, undefined, 2)).toEqual([]);
  });

  it('returns an empty array when pageNumber is undefined', () => {
    expect(prependRows(mockEmptyCells, 3, undefined)).toEqual([]);
  });

  it('returns an empty array when pageNumber is 1', () => {
    expect(prependRows(mockEmptyCells, 3, 1)).toEqual([]);
  });

  it('returns the correct number of items', () => {
    expect(prependRows(mockEmptyCells, 6, 2).length).toBe(6);
  });
});

describe('appendRows', () => {
  it('returns an empty array when totalItems is undefined', () => {
    expect(appendRows(mockEmptyCells, 3, 3, 2, undefined)).toEqual([]);
  });

  it('returns an empty array when pageNumber is undefined', () => {
    expect(appendRows(mockEmptyCells, 3, 3, undefined, 6)).toEqual([]);
  });

  it('returns an empty array when itemsPerPage is undefined', () => {
    expect(appendRows(mockEmptyCells, 3, undefined, 2, 6)).toEqual([]);
  });

  it('returns the correct number of items', () => {
    expect(appendRows(mockEmptyCells, 6, 6, 2, 100).length).toBe(90);
  });

  it('returns the correct number of items when rowsLength is greater than itemsPerPage', () => {
    expect(appendRows(mockEmptyCells, 8, 6, 2, 100).length).toBe(88);
  });

  it('returns an empty array for the last page', () => {
    expect(appendRows(mockEmptyCells, 6, 6, 17, 100)).toEqual([]);
  });
});
