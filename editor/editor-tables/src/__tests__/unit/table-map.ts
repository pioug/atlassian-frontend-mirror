import { defaultSchema } from '@atlaskit/adf-schema';
import {
  p,
  RefsNode,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { TableMap } from '../../table-map';

const tableCell = td({})(p('1'));

describe('TableMap', () => {
  describe('creates correct TableMap', () => {
    it('throws an error when param is not a table node', () => {
      const textNode = p('text')(defaultSchema);
      expect(() => TableMap.get(textNode)).toThrowError(
        'Not a table node: paragraph',
      );
    });

    it.each([
      [
        'overlong rowspan',
        table()(tr(tableCell, td({ colspan: 2, rowspan: 3 })(p('1'))))(
          defaultSchema,
        ),
        [{ type: 'overlong_rowspan', pos: 6, n: 2 }],
      ],
      [
        'missing',
        table()(
          tr(tableCell, td({ colspan: 3, rowspan: 1 })(p('1'))),
          tr(tableCell, tableCell),
        )(defaultSchema),
        [{ type: 'missing', row: 1, n: 2 }],
      ],
      [
        'colwidth mismatch',
        table()(
          tr(tableCell, td({ colwidth: [123] })(p('1'))),
          tr(tableCell, td({ colwidth: [456] })(p('1'))),
        )(defaultSchema),
        [{ type: 'colwidth mismatch', pos: 6, colwidth: [456] }],
      ],
    ])('%s', (_, tableNode: RefsNode, problems: any) => {
      expect(TableMap.get(tableNode).problems).toEqual(problems);
    });
  });

  describe('finds the right shape', () => {
    it.each([
      [
        'for a simple table',
        table()(
          tr(tableCell, tableCell, tableCell),
          tr(tableCell, tableCell, tableCell),
          tr(tableCell, tableCell, tableCell),
          tr(tableCell, tableCell, tableCell),
        )(defaultSchema),
        '1, 6, 11, 18, 23, 28, 35, 40, 45, 52, 57, 62',
      ],
      [
        'table with colspans',
        table()(
          tr(tableCell, td({ colspan: 2, rowspan: 1 })(p('1'))),
          tr(td({ colspan: 2, rowspan: 1 })(p('1')), tableCell),
          tr(tableCell, tableCell, tableCell),
        )(defaultSchema),
        '1, 6, 6, 13, 13, 18, 25, 30, 35',
      ],
      [
        'table with rowspans',
        table()(
          tr(
            td({ colspan: 1, rowspan: 2 })(p('1')),
            tableCell,
            td({ colspan: 1, rowspan: 2 })(p('1')),
          ),
          tr(tableCell),
        )(defaultSchema),
        '1, 6, 11, 1, 18, 11',
      ],
      [
        'for deep rowspans',
        table()(
          tr(
            td({ colspan: 1, rowspan: 3 })(p('1')),
            td({ colspan: 2, rowspan: 1 })(p('1')),
          ),
          tr(
            td({ colspan: 1, rowspan: 2 })(p('1')),
            td({ colspan: 1, rowspan: 2 })(p('1')),
          ),
          tr(td()(p(''))),
        )(defaultSchema),
        '1, 6, 6, 0, 1, 13, 18, 0, 1, 13, 18, 25',
      ],
      [
        'for larger rectangles',
        table()(
          tr(tableCell, td({ colspan: 4, rowspan: 4 })(p('1'))),
          tr(tableCell),
          tr(tableCell),
          tr(tableCell),
        )(defaultSchema),
        '1, 6, 6, 6, 6, 13, 6, 6, 6, 6, 20, 6, 6, 6, 6, 27, 6, 6, 6, 6',
      ],
    ])('%s', (_, tableNode: RefsNode, expected: string) => {
      const tableMap = TableMap.get(tableNode).map.join(', ');
      expect(tableMap).toBe(expected);
    });
  });

  describe('given table with different colspans and rowspans', () => {
    const tableNode = table()(
      tr(
        td({ colspan: 2, rowspan: 3 })(p('1')),
        tableCell,
        td({ colspan: 1, rowspan: 2 })(p('1')),
      ),
      tr(tableCell),
      tr(td({ colspan: 2, rowspan: 1 })(p('1'))),
    )(defaultSchema);

    const map = TableMap.get(tableNode);
    //  1  1  6 11
    //  1  1 18 11
    //  1  1 25 25
    it('can accurately find cell sizes', () => {
      expect(map.width).toBe(4);
      expect(map.height).toBe(3);
      expect(map.findCell(1)).toEqual({ left: 0, right: 2, top: 0, bottom: 3 });
      expect(map.findCell(6)).toEqual({ left: 2, right: 3, top: 0, bottom: 1 });
      expect(map.findCell(11)).toEqual({
        left: 3,
        right: 4,
        top: 0,
        bottom: 2,
      });
      expect(map.findCell(18)).toEqual({
        left: 2,
        right: 3,
        top: 1,
        bottom: 2,
      });
      expect(map.findCell(25)).toEqual({
        left: 2,
        right: 4,
        top: 2,
        bottom: 3,
      });
      expect(() => map.findCell(2)).toThrowError('No cell with offset 2 found');
    });

    it('can count column correctly', () => {
      expect(map.colCount(18)).toEqual(2);
      expect(() => map.colCount(2)).toThrowError('No cell with offset 2 found');
    });

    it('can find positions correctly', () => {
      expect(map.positionAt(0, 0, tableNode)).toEqual(1);
      expect(map.positionAt(1, 1, tableNode)).toEqual(18);
      expect(map.positionAt(2, 2, tableNode)).toEqual(25);
    });

    it('can find the rectangle between two cells', () => {
      expect(map.cellsInRect(map.rectBetween(1, 6)).join(', ')).toBe(
        '1, 6, 18, 25',
      );
      expect(map.cellsInRect(map.rectBetween(1, 25)).join(', ')).toBe(
        '1, 6, 11, 18, 25',
      );
      expect(map.cellsInRect(map.rectBetween(1, 1)).join(', ')).toBe('1');
      expect(map.cellsInRect(map.rectBetween(6, 25)).join(', ')).toBe(
        '6, 11, 18, 25',
      );
      expect(map.cellsInRect(map.rectBetween(6, 11)).join(', ')).toBe(
        '6, 11, 18',
      );
      expect(map.cellsInRect(map.rectBetween(11, 6)).join(', ')).toBe(
        '6, 11, 18',
      );
      expect(map.cellsInRect(map.rectBetween(18, 25)).join(', ')).toBe(
        '18, 25',
      );
      expect(map.cellsInRect(map.rectBetween(6, 18)).join(', ')).toBe('6, 18');
    });

    it('can find adjacent cells', () => {
      expect(map.nextCell(1, 'horiz', 1)).toBe(6);
      expect(map.nextCell(1, 'horiz', -1)).toBeNull();
      expect(map.nextCell(1, 'vert', 1)).toBeNull();
      expect(map.nextCell(1, 'vert', -1)).toBeNull();

      expect(map.nextCell(18, 'horiz', 1)).toBe(11);
      expect(map.nextCell(18, 'horiz', -1)).toBe(1);
      expect(map.nextCell(18, 'vert', 1)).toBe(25);
      expect(map.nextCell(18, 'vert', -1)).toBe(6);

      expect(map.nextCell(25, 'vert', 1)).toBeNull();
      expect(map.nextCell(25, 'vert', -1)).toBe(18);
      expect(map.nextCell(25, 'horiz', 1)).toBeNull();
      expect(map.nextCell(25, 'horiz', -1)).toBe(1);
    });
  });
});
