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
  removeColumnAt,
  removeColumnClosestToPos,
  removeSelectedColumns,
} from '../../remove-column';

// createEditorState() doesn't set up Selection the same way the tests expect
const fixSelection = (tr: Transaction): Transaction => {
  const cellSelection = selectionFor(tr.doc as RefsNode)!;
  return tr.setSelection(cellSelection);
};

describe('removeColumnAt', () => {
  it("should return an original transaction if table doesn't have a column at `columnIndex`", () => {
    const { tr } = createEditorState(
      doc(table()(row(td()(p('1{cursor}')), td()(p('2'))))),
    );
    const newTr = removeColumnAt(3)(tr);
    expect(tr).toBe(newTr);
  });

  it('should return a new transaction that removes a column at index 0', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = removeColumnAt(0)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(table()(row(td()(p('2'))), row(td()(p('4'))))),
    );
  });

  it('should return a new transaction that removes a column in the middle', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2')), td()(p('3'))),
          row(td()(p('4')), td()(p('5')), td()(p('6'))),
        ),
      ),
    );
    const newTr = removeColumnAt(1)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(
        table()(
          row(td()(p('1')), td()(p('3'))),
          row(td()(p('4')), td()(p('6'))),
        ),
      ),
    );
  });

  it('should return a new transaction that removes a column at last index', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = removeColumnAt(1)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(
      doc(table()(row(td()(p('1'))), row(td()(p('3'))))),
    );
  });

  it('should remove the whole table if there is only one column', () => {
    const { tr } = createEditorState(
      doc(p('1'), table()(row(td()(p('text{cursor}'))), row(cEmpty)), p('2')),
    );
    fixSelection(tr);

    const newTr = removeColumnAt(0)(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(doc(p('1'), p('2')));
  });
});

describe('removeColumnClosestToPos', () => {
  it('should return an original transaction if a given `$pos` is not inside of a table node', () => {
    const state = createEditorState(doc(p('1')));
    const { tr } = state;
    const newTr = removeColumnClosestToPos(state.doc.resolve(1))(tr);
    expect(tr).toBe(newTr);
  });

  describe('first col', () => {
    it('should remove a column closest to a given `$pos`', () => {
      const state = createEditorState(
        doc(
          p('text'),
          table()(
            row(td()(p('1')), td()(p('2')), td()(p('3'))),
            row(td()(p('4')), td()(p('5')), td()(p('6'))),
          ),
        ),
      );
      const { tr } = state;
      const newTr = removeColumnClosestToPos(state.doc.resolve(10))(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(
          p('text'),
          table()(
            row(td()(p('2')), td()(p('3'))),
            row(td()(p('5')), td()(p('6'))),
          ),
        ),
      );
    });
  });

  describe('middle col', () => {
    it('should remove a column closest to a given `$pos`', () => {
      const state = createEditorState(
        doc(
          p('text'),
          table()(
            row(td()(p('1')), td()(p('2')), td()(p('3'))),
            row(td()(p('4')), td()(p('5')), td()(p('6'))),
          ),
        ),
      );
      const { tr } = state;
      const newTr = removeColumnClosestToPos(state.doc.resolve(15))(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(
          p('text'),
          table()(
            row(td()(p('1')), td()(p('3'))),
            row(td()(p('4')), td()(p('6'))),
          ),
        ),
      );
    });
  });

  describe('last col', () => {
    it('should remove a column closest to a given `$pos`', () => {
      const state = createEditorState(
        doc(
          p('text'),
          table()(
            row(td()(p('1')), td()(p('2')), td()(p('3'))),
            row(td()(p('4')), td()(p('5')), td()(p('6'))),
          ),
        ),
      );
      const { tr } = state;
      const newTr = removeColumnClosestToPos(state.doc.resolve(20))(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(
          p('text'),
          table()(
            row(td()(p('1')), td()(p('2'))),
            row(td()(p('4')), td()(p('5'))),
          ),
        ),
      );
    });
  });
});

describe('removeSelectedColumns', () => {
  it('should return an original transaction if selection is not a CellSelection', () => {
    const { tr } = createEditorState(
      doc(table()(row(td()(p('1{cursor}')), td()(p('2'))))),
    );
    const newTr = removeSelectedColumns(tr);
    expect(tr).toBe(newTr);
  });

  describe('when the whole column is selected from top to bottom row', () => {
    it('should remove selected columns', () => {
      const { tr } = createEditorState(
        doc(
          table()(
            row(td()(p('1{anchor}')), cEmpty, cEmpty),
            row(cEmpty, td()(p('2{head}')), cEmpty),
          ),
        ),
      );
      fixSelection(tr);

      const newTr = removeSelectedColumns(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(doc(table()(row(cEmpty), row(cEmpty))));
    });
  });

  describe('when not the whole column is selected', () => {
    it('should remove selected columns', () => {
      const { tr } = createEditorState(
        doc(
          table()(
            row(cEmpty, cEmpty, cEmpty),
            row(td()(p('1{anchor}')), cEmpty, cEmpty),
            row(cEmpty, td()(p('2{head}')), cEmpty),
          ),
        ),
      );
      fixSelection(tr);

      const newTr = removeSelectedColumns(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(table()(row(cEmpty), row(cEmpty), row(cEmpty))),
      );
    });
  });

  it('should remove entire table if all columns are selected', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{anchor}')), cEmpty, cEmpty),
          row(cEmpty, cEmpty, td()(p('2{head}'))),
        ),
      ),
    );
    fixSelection(tr);

    const newTr = removeSelectedColumns(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(doc(p('')));
  });
});
