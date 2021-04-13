import { Transaction } from 'prosemirror-state';

import {
  doc,
  p,
  RefsNode,
  tr as row,
  table,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  cEmpty,
  createEditorState,
} from '../../../__tests__/__helpers/doc-builder';
import { selectionFor } from '../../../__tests__/__helpers/selection-for';
import {
  removeRowAt,
  removeRowClosestToPos,
  removeSelectedRows,
} from '../../remove-row';

// createEditorState() doesn't set up Selection the same way the tests expect
const fixSelection = (tr: Transaction): Transaction => {
  const cellSelection = selectionFor(tr.doc as RefsNode)!;
  return tr.setSelection(cellSelection);
};

describe('removeRowClosestToPos', () => {
  it('should return an original transaction if a given `$pos` is not inside of a table node', () => {
    const state = createEditorState(doc(p('1')));
    const { tr } = state;
    const newTr = removeRowClosestToPos(state.doc.resolve(1))(tr);
    expect(tr).toBe(newTr);
  });

  describe('first row', () => {
    it('should remove a row closest to a given `$pos`', () => {
      const state = createEditorState(
        doc(
          p('text'),
          table()(
            row(td()(p('1')), td()(p('2'))),
            row(td()(p('3')), td()(p('4'))),
            row(td()(p('5')), td()(p('6'))),
          ),
        ),
      );
      const { tr } = state;
      const newTr = removeRowClosestToPos(state.doc.resolve(10))(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(
          p('text'),
          table()(
            row(td()(p('3')), td()(p('4'))),
            row(td()(p('5')), td()(p('6'))),
          ),
        ),
      );
    });
  });

  describe('middle row', () => {
    it('should remove a row closest to a given `$pos`', () => {
      const state = createEditorState(
        doc(
          p('text'),
          table()(
            row(td()(p('1')), td()(p('2'))),
            row(td()(p('3')), td()(p('4{cursor}'))),
            row(td()(p('5')), td()(p('6'))),
          ),
        ),
      );
      const { tr } = state;
      const newTr = removeRowClosestToPos(state.doc.resolve(22))(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(
          p('text'),
          table()(
            row(td()(p('1')), td()(p('2'))),
            row(td()(p('5')), td()(p('6'))),
          ),
        ),
      );
    });
  });

  describe('last row', () => {
    it('should remove a row closest to a given `$pos`', () => {
      const state = createEditorState(
        doc(
          p('text'),
          table()(
            row(td()(p('1')), td()(p('2'))),
            row(td()(p('3')), td()(p('4'))),
            row(td()(p('5{cursor}')), td()(p('6'))),
          ),
        ),
      );
      const { tr } = state;
      const newTr = removeRowClosestToPos(state.doc.resolve(34))(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(
          p('text'),
          table()(
            row(td()(p('1')), td()(p('2'))),
            row(td()(p('3')), td()(p('4'))),
          ),
        ),
      );
    });
  });
});

describe('removeRowAt', () => {
  it("should return an original transaction if table doesn't have a row at `rowIndex`", () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = removeRowAt(3)(tr);
    expect(tr).toBe(newTr);
  });

  it('should return a new transaction that removes a row at index 0', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = removeRowAt(0)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(table()(row(td()(p('3')), td()(p('4'))))),
    );
  });

  it('should return a new transaction that removes a row in the middle', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
          row(td()(p('5')), td()(p('6'))),
        ),
      ),
    );
    const newTr = removeRowAt(1)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(
        table()(
          row(td()(p('1')), td()(p('2'))),
          row(td()(p('5')), td()(p('6'))),
        ),
      ),
    );
  });

  it('should return a new transaction that removes a row at last index', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = removeRowAt(1)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(table()(row(td()(p('1')), td()(p('2'))))),
    );
  });

  it('should remove the whole table if there is only one row', () => {
    const { tr } = createEditorState(
      doc(p('1'), table()(row(td()(p('text{cursor}')), cEmpty)), p('2')),
    );
    fixSelection(tr);

    const newTr = removeRowAt(0)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(doc(p('1'), p('2')));
  });
});

describe('removeSelectedRows', () => {
  it('should return an original transaction if selection is not a CellSelection', () => {
    const { tr } = createEditorState(
      doc(table()(row(td()(p('1{cursor}')), td()(p('2'))))),
    );
    const newTr = removeSelectedRows(tr);
    expect(tr).toBe(newTr);
  });

  describe('when the whole row is selected from left to right', () => {
    it('should remove selected rows', () => {
      const { tr } = createEditorState(
        doc(
          table()(
            row(td()(p('1{anchor}')), cEmpty, cEmpty),
            row(cEmpty, cEmpty, td()(p('2{head}'))),
            row(cEmpty, cEmpty, cEmpty),
          ),
        ),
      );
      fixSelection(tr);

      const newTr = removeSelectedRows(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(table()(row(cEmpty, cEmpty, cEmpty))),
      );
    });
  });

  describe('when not the whole row is selected', () => {
    it('should remove selected rows', () => {
      const { tr } = createEditorState(
        doc(
          table()(
            row(td()(p('1{anchor}')), cEmpty, cEmpty),
            row(cEmpty, td()(p('2{head}')), cEmpty),
            row(cEmpty, cEmpty, cEmpty),
          ),
        ),
      );
      fixSelection(tr);

      const newTr = removeSelectedRows(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(table()(row(cEmpty, cEmpty, cEmpty))),
      );
    });
  });

  it('should remove entire table if all rows are selected', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{anchor}')), cEmpty, cEmpty),
          row(cEmpty, cEmpty, td()(p('2{head}'))),
        ),
      ),
    );
    fixSelection(tr);

    const newTr = removeSelectedRows(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(doc(p('')));
  });
});
