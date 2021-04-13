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
import { forEachCellInColumn, forEachCellInRow } from '../../for-each-cell';
import { setCellAttrs } from '../../set-cell-attrs';

describe('forEachCellInColumn', () => {
  describe('cells with colspan = 1, rowspan = 1', () => {
    it('should map `emptyCell` to each cell in a column at a given `columnIndex`', () => {
      const { schema, tr } = createEditorState(
        doc(
          table()(
            row(td()(p('one one')), cEmpty),
            row(td()(p('two two')), cEmpty),
          ),
        ),
      );
      const newTr = forEachCellInColumn(
        0,
        (cell, tr) => emptyCell(cell, schema)(tr),
        true,
      )(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(table()(row(cEmpty, cEmpty), row(cEmpty, cEmpty))),
      );
      expect(newTr.selection.$from.pos).toEqual(14);
    });

    it('should map `setCellAttrs` to each cell in a column at a given `columnIndex`', () => {
      const { tr } = createEditorState(
        doc(
          table()(
            row(td()(p('one one')), cEmpty),
            row(td()(p('two two')), cEmpty),
          ),
        ),
      );
      const newTr = forEachCellInColumn(
        0,
        (cell, tr) => setCellAttrs(cell, { background: 'red' })(tr),
        true,
      )(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(
          table()(
            row(td({ background: 'red' })(p('one one')), cEmpty),
            row(td({ background: 'red' })(p('two two')), cEmpty),
          ),
        ),
      );
    });
  });

  describe('merged cells with colspan = 2, rowspan = 1', () => {
    it('should map `emptyCell` to each cell in a column at a given `columnIndex`', () => {
      const { schema, tr } = createEditorState(
        doc(
          table()(
            row(td({ colspan: 2 })(p('one one'))),
            row(td()(p('two two')), cEmpty),
          ),
        ),
      );
      const newTr = forEachCellInColumn(
        0,
        (cell, tr) => emptyCell(cell, schema)(tr),
        true,
      )(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(table()(row(td({ colspan: 2 })(p(''))), row(cEmpty, cEmpty))),
      );
      expect(newTr.selection.$from.pos).toEqual(10);
    });
  });

  describe('merged cells with colspan = 1, rowspan = 2', () => {
    it('should map `emptyCell` to each cell in a column at a given `columnIndex`', () => {
      const { schema, tr } = createEditorState(
        doc(
          table()(
            row(td({ rowspan: 2 })(p('one one')), td()(p('two two'))),
            row(cEmpty),
          ),
        ),
      );
      const newTr = forEachCellInColumn(
        0,
        (cell, tr) => emptyCell(cell, schema)(tr),
        true,
      )(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(
          table()(
            row(td({ rowspan: 2 })(p('')), td()(p('two two'))),
            row(cEmpty),
          ),
        ),
      );
      expect(newTr.selection.$from.pos).toEqual(4);
    });
  });
});

describe('forEachCellInRow', () => {
  describe('cells with colspan = 1, rowspan = 1', () => {
    it('should map `emptyCell` to each cell in a row at a given `rowIndex`', () => {
      const { schema, tr } = createEditorState(
        doc(
          table()(
            row(td()(p('one one')), td()(p('two two'))),
            row(cEmpty, cEmpty),
          ),
        ),
      );
      const newTr = forEachCellInRow(
        0,
        (cell, tr) => emptyCell(cell, schema)(tr),
        true,
      )(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(table()(row(cEmpty, cEmpty), row(cEmpty, cEmpty))),
      );
      expect(newTr.selection.$from.pos).toEqual(8);
    });

    it('should map `setCellAttrs` to each cell in a row at a given `rowIndex`', () => {
      const { tr } = createEditorState(
        doc(table()(row(cEmpty, cEmpty), row(cEmpty, cEmpty))),
      );
      const newTr = forEachCellInRow(
        0,
        (cell, tr) => setCellAttrs(cell, { background: 'red' })(tr),
        true,
      )(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(
          table()(
            row(
              td({ background: 'red' })(p('')),
              td({ background: 'red' })(p('')),
            ),
            row(cEmpty, cEmpty),
          ),
        ),
      );
    });
  });

  describe('merged cells with colspan = 2, rowspan = 1', () => {
    it('should map `emptyCell` to each cell in a row at a given `rowIndex`', () => {
      const { schema, tr } = createEditorState(
        doc(
          table()(
            row(td({ colspan: 2 })(p('one one')), td()(p('two two'))),
            row(cEmpty, cEmpty, cEmpty),
          ),
        ),
      );
      const newTr = forEachCellInRow(
        0,
        (cell, tr) => emptyCell(cell, schema)(tr),
        true,
      )(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(
          table()(
            row(td({ colspan: 2 })(p('')), cEmpty),
            row(cEmpty, cEmpty, cEmpty),
          ),
        ),
      );
      expect(newTr.selection.$from.pos).toEqual(8);
    });
  });

  describe('merged cells with colspan = 1, rowspan = 2', () => {
    it('should map `emptyCell` to each cell in a row at a given `rowIndex`', () => {
      const { schema, tr } = createEditorState(
        doc(
          table()(
            row(td({ rowspan: 2 })(p('one one')), td()(p('two two'))),
            row(cEmpty),
          ),
        ),
      );
      const newTr = forEachCellInRow(
        0,
        (cell, tr) => emptyCell(cell, schema)(tr),
        true,
      )(tr);
      expect(newTr).not.toBe(tr);
      expect(newTr.doc).toEqualDocument(
        doc(table()(row(td({ rowspan: 2 })(p('')), cEmpty), row(cEmpty))),
      );
      expect(newTr.selection.$from.pos).toEqual(8);
    });
  });
});
