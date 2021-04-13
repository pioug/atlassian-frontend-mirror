import {
  doc,
  p,
  tr as row,
  table,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  cEmpty,
  createEditorState,
} from '../../../__tests__/__helpers/doc-builder';
import { emptyCell } from '../../empty-cells';
import { findCellClosestToPos } from '../../find';
import { forEachCellInColumn } from '../../for-each-cell';

describe('emptyCell', () => {
  it('should return an original transaction if a given cell is undefined', () => {
    const input = doc(p('one one'));
    const { schema, tr } = createEditorState(input);
    const $pos = tr.doc.resolve(2);
    const newTr = emptyCell(findCellClosestToPos($pos)!, schema)(tr);
    expect(tr).toBe(newTr);
  });

  it('should return a new transaction that empties the content of a given cell', () => {
    const input = doc(
      table()(row(td()(p('one one')), cEmpty), row(td()(p('two two')), cEmpty)),
    );
    const { schema, tr } = createEditorState(input);
    const newTr = forEachCellInColumn(0, (cell, tr) =>
      emptyCell(cell, schema)(tr),
    )(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(table()(row(cEmpty, cEmpty), row(cEmpty, cEmpty))),
    );
    expect(newTr.selection.$from.pos).toEqual(8);
  });
});
