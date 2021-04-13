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
import { findCellClosestToPos } from '../../find';
import { setCellAttrs } from '../../set-cell-attrs';

describe('setCellAttrs', () => {
  it('should return an original transaction if a given cell is undefined', () => {
    const input = doc(p('one one'));
    const { tr } = createEditorState(input);
    const cellAttr = { background: 'red' };
    const $pos = tr.doc.resolve(2);
    const newTr = setCellAttrs(findCellClosestToPos($pos)!, cellAttr)(tr);
    expect(tr).toBe(newTr);
  });

  it('should return a new transaction that sets given `attrs` to a given cell', () => {
    const input = doc(table()(row(td()(p('one')), cEmpty)));
    const { tr } = createEditorState(input);
    const $pos = tr.doc.resolve(5);
    const cellAttr = { background: 'red' };
    const newTr = setCellAttrs(findCellClosestToPos($pos)!, cellAttr)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(table()(row(td(cellAttr)(p('one')), cEmpty))),
    );
  });
});
