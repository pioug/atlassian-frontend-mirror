import { defaultSchema } from '@atlaskit/adf-schema';
import { p, table, td, tr } from '@atlaskit/editor-test-helpers/doc-builder';

const originWeakMap = window.WeakMap;
Object.defineProperty(window, 'WeakMap', {
  value: undefined,
});
import { TableMap } from '../../table-map';

const tableCell = td({})(p('1'));

describe('TableMap', () => {
  describe('WeakMap is not supported', () => {
    afterAll(() => {
      // restore Weakmap
      Object.defineProperty(window, 'WeakMap', {
        value: originWeakMap,
      });
    });
    it('able the cache TableMap correctly', () => {
      const tableNode = table()(
        tr(tableCell, tableCell, tableCell),
        tr(tableCell, tableCell, tableCell),
        tr(tableCell, tableCell, tableCell),
        tr(tableCell, tableCell, tableCell),
      )(defaultSchema);
      // Update the cache
      TableMap.get(tableNode);

      // Should get from the cache
      const tableMapA = TableMap.get(tableNode).map.join(', ');

      expect(tableMapA).toBe('1, 6, 11, 18, 23, 28, 35, 40, 45, 52, 57, 62');
    });
  });
});
