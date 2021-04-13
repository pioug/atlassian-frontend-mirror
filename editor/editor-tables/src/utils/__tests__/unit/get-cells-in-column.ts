import { defaultSchema } from '@atlaskit/adf-schema';
import {
  doc,
  p,
  tr as row,
  table,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { cCursor, cEmpty } from '../../../__tests__/__helpers/doc-builder';
import { selectionFor } from '../../../__tests__/__helpers/selection-for';
import { getCellsInColumn } from '../../get-cells-in-column';

describe('getCellsInColumn', () => {
  it('should return `undefined` when cursor is outside of a table node', () => {
    const input = doc(p('{cursor}'))(defaultSchema);
    const selection = selectionFor(input)!;
    expect(getCellsInColumn(0)(selection)).toBeUndefined();
  });

  it('should return an array of cells in a column', () => {
    const input = doc(
      table()(
        row(td()(p('1')), cCursor, cEmpty),
        row(td()(p('2')), cEmpty, cEmpty),
      ),
    )(defaultSchema);
    const selection = selectionFor(input)!;
    const cells = getCellsInColumn(0)(selection)!;
    cells.forEach((cell, i) => {
      expect(cell.node.type.name).toEqual('tableCell');
      expect(cell.node.textContent).toEqual(`${i + 1}`);
      expect(typeof cell.pos).toEqual('number');
    });
    expect(cells[0].pos).toEqual(2);
    expect(cells[1].pos).toEqual(18);
  });

  it('should return an array of cells in a range of columns', () => {
    const input = doc(
      table()(
        row(td()(p('{cursor}1')), td()(p('3')), cEmpty),
        row(td()(p('2')), td()(p('4')), cEmpty),
      ),
    )(defaultSchema);
    const selection = selectionFor(input)!;
    const cells = getCellsInColumn([0, 1])(selection)!;
    cells.forEach((cell, i) => {
      expect(cell.node.type.name).toEqual('tableCell');
      expect(cell.node.textContent).toEqual(`${i + 1}`);
      expect(typeof cell.pos).toEqual('number');
    });
    expect(cells[0].pos).toEqual(2);
    expect(cells[1].pos).toEqual(18);
    expect(cells[2].pos).toEqual(7);
    expect(cells[3].pos).toEqual(23);
  });
});
