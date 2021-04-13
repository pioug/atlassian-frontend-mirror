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
import { addColumnAt } from '../../add-column-at';

describe('addColumnAt', () => {
  it("should return an original transaction if table doesn't have a column at `columnIndex`", () => {
    const input = doc(table()(row(td()(p('1{<>}')), td()(p('2')))));
    const { tr } = createEditorState(input);
    const newTr = addColumnAt(3)(tr);
    expect(tr).toBe(newTr);
  });

  it('should return a new transaction that adds a new column at index 0', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{<>}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = addColumnAt(0)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(
        table()(
          row(cEmpty, td()(p('1')), td()(p('2'))),
          row(cEmpty, td()(p('3')), td()(p('4'))),
        ),
      ),
    );
  });

  it('should return a new transaction that adds a new column in the middle', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{<>}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = addColumnAt(1)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(
        table()(
          row(td()(p('1')), cEmpty, td()(p('2'))),
          row(td()(p('3')), cEmpty, td()(p('4'))),
        ),
      ),
    );
  });

  it('should return a new transaction that adds a new column at last index', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{<>}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = addColumnAt(2)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(
        table()(
          row(td()(p('1')), td()(p('2')), cEmpty),
          row(td()(p('3')), td()(p('4')), cEmpty),
        ),
      ),
    );
  });
});
