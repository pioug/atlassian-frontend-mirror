import {
  doc,
  p,
  tr as row,
  table,
  td,
  th,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  cEmpty,
  createEditorState,
} from '../../../__tests__/__helpers/doc-builder';
import { addRowAt, cloneRowAt } from '../../add-row-at';

describe('addRowAt', () => {
  it("should return an original transaction if table doesn't have a row at `rowIndex`", () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = addRowAt(3)(tr);
    expect(tr).toBe(newTr);
  });

  it('should return a new transaction that adds a new row at index 0', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = addRowAt(0)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(
        table()(
          row(cEmpty, cEmpty),
          row(td()(p('1')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
  });

  it('should return a new transaction that adds a new row in the middle', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = addRowAt(1)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(
        table()(
          row(td()(p('1')), td()(p('2'))),
          row(cEmpty, cEmpty),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
  });

  it('should return a new transaction that adds a new row at last index', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = addRowAt(2)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(
        table()(
          row(td()(p('1')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
          row(cEmpty, cEmpty),
        ),
      ),
    );
  });

  it('should return a new transaction that clones the previous row at the last index', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td({ colspan: 2 })(p('3'))),
        ),
      ),
    );
    const newTr = addRowAt(2, true)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(
        table()(
          row(td()(p('1')), td()(p('2'))),
          row(td({ colspan: 2 })(p('3'))),
          row(td({ colspan: 2 })(p())),
        ),
      ),
    );
  });

  it('should return a new transaction that adds a new row at index 0 but shouldnt clone any rows', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = addRowAt(0, true)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(
        table()(
          row(cEmpty, cEmpty),
          row(td()(p('1')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
  });
});

describe('cloneRowAt', () => {
  it('should return a new transaction that clones the previous row at the given index', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(th({ colspan: 2 })(p('3'))),
        ),
      ),
    );
    const newTr = cloneRowAt(1)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(
        table()(
          row(td()(p('1')), td()(p('2'))),
          row(th({ colspan: 2 })(p('3'))),
          row(th({ colspan: 2 })(p())),
        ),
      ),
    );
  });

  it('should increment a rowspan if cloning a row in that span', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td({ colspan: 2 })(p('1{cursor}')), td({ rowspan: 3 })(p('2'))),
          row(td()(p('3')), td()(p(''))),
          row(td()(p('4')), td()(p(''))),
        ),
      ),
    );

    const newTr = cloneRowAt(0)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(
        table()(
          row(td({ colspan: 2 })(p('1')), td({ rowspan: 4 })(p('2'))),
          row(td({ colspan: 2 })(p())),
          row(td()(p('3')), td()(p(''))),
          row(td()(p('4')), td()(p(''))),
        ),
      ),
    );
  });

  it('should increment all rowspans that cover the row', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('0')), td()(p()), td()(p())),
          row(td()(p('1{cursor}')), td()(p()), td({ rowspan: 3 })(p('2'))),
          row(td()(p('3')), td()(p())),
          row(td()(p('4')), td({ rowspan: 2 })(p())),
          row(td()(p('5')), td()(p())),
          row(td()(p('6')), td()(p()), td()(p())),
        ),
      ),
    );

    const newTr = cloneRowAt(3)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(
        table()(
          row(td()(p('0')), td()(p()), td()(p())),
          row(td()(p('1')), td()(p()), td({ rowspan: 4 })(p('2'))),
          row(td()(p('3')), td()(p())),
          row(td()(p('4')), td({ rowspan: 3 })(p())),
          row(td()(p())),
          row(td()(p('5')), td()(p())),
          row(td()(p('6')), td()(p()), td()(p())),
        ),
      ),
    );
  });
});
