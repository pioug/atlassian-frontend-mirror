import { defaultSchema } from '@atlaskit/adf-schema';
import {
  doc,
  p,
  tr as row,
  table,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { selectionFor } from '../../../__tests__/__helpers/selection-for';
import { getCellsInTable } from '../../get-cells-in-table';

describe('getCellsInTable', () => {
  it('should return `undefined` when cursor is outside of a table node', () => {
    const input = doc(p('{cursor}'))(defaultSchema);
    const selection = selectionFor(input)!;
    expect(getCellsInTable(selection)).toBeUndefined();
  });
  it('should return an array of all cells', () => {
    const input = doc(
      table()(
        row(td()(p('1{cursor}')), td()(p('2')), td()(p('3'))),
        row(td()(p('4')), td()(p('5')), td()(p('6'))),
      ),
    )(defaultSchema);
    const selection = selectionFor(input)!;
    const cells = getCellsInTable(selection)!;
    cells.forEach((cell, i) => {
      expect(cell.node.type.name).toEqual('tableCell');
      expect(cell.node.textContent).toEqual(`${i + 1}`);
      expect(typeof cell.pos).toEqual('number');
    });
    expect(cells[0].pos).toEqual(2);
    expect(cells[1].pos).toEqual(7);
    expect(cells[2].pos).toEqual(12);
    expect(cells[3].pos).toEqual(19);
    expect(cells[4].pos).toEqual(24);
    expect(cells[5].pos).toEqual(29);
  });
});
