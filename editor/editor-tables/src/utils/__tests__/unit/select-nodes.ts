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
import { CellSelection } from '../../../cell-selection';
import { selectColumn, selectRow, selectTable } from '../../select-nodes';

describe('selectColumn', () => {
  it("should return an original transaction if table doesn't have a column at `columnIndex`", () => {
    const { tr } = createEditorState(
      doc(table()(row(td()(p('1{cursor}')), td()(p('2'))))),
    );
    const newTr = selectColumn(2)(tr);
    expect(tr).toBe(newTr);
  });

  it('should return a new transaction that selects a column at `columnIndex`', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = selectColumn(0)(tr);
    const selection = tr.selection as CellSelection;
    expect(newTr).not.toBe(tr);
    expect(selection.$anchorCell.pos).toEqual(14);
    expect(selection.$headCell.pos).toEqual(2);
  });

  /**
   * Select the second column
   *   ____________
   *  |     |     |
   *  |  1  |     |
   *  |_____|     |
   *  |     |     |
   *  |  3  |  2  |
   *  |_____|     |
   *  |     |     |
   *  |  4  |     |
   *  |_____|_____|
   */

  it('should return a new transaction that selects a merged column at `rowIndex`', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td({ rowspan: 3 })(p('2'))),
          row(td()(p('3'))),
          row(td()(p('4'))),
        ),
      ),
    );
    const newTr = selectColumn(1)(tr);
    const selection = tr.selection as CellSelection;
    expect(newTr).not.toBe(tr);
    expect(selection.$anchorCell.pos).toEqual(7);
    expect(selection.$headCell.pos).toEqual(7);
  });

  describe('Expand', () => {
    it('should return a new transaction that expands the existing selection', () => {
      const { tr } = createEditorState(
        doc(
          table()(
            row(td()(p('1{head}')), cEmpty, cEmpty),
            row(cEmpty, cEmpty, cEmpty),
            row(cEmpty, td()(p('2{anchor}')), cEmpty),
          ),
        ),
      );

      const newTr = selectColumn(2, true)(tr);
      const selection = tr.selection as CellSelection;
      expect(newTr).not.toBe(tr);
      expect(selection.$anchorCell.pos).toEqual(40);
      expect(selection.$headCell.pos).toEqual(2);
    });

    it('should return a new transaction that expands the existing text selection', () => {
      const { tr } = createEditorState(
        doc(
          table()(
            row(td()(p('1')), cEmpty, cEmpty),
            row(td()(p('2{cursor}')), cEmpty, td()(p('3'))),
            row(cEmpty, cEmpty, cEmpty),
          ),
        ),
      );

      const newTr = selectColumn(2, true)(tr);
      const selection = tr.selection as CellSelection;
      expect(newTr).not.toBe(tr);
      expect(selection.$anchorCell.pos).toEqual(41);
      expect(selection.$headCell.pos).toEqual(2);
    });
  });
});

describe('selectRow', () => {
  it("should return an original transaction if table doesn't have a row at `rowIndex`", () => {
    const { tr } = createEditorState(
      doc(table()(row(td()(p('1{cursor}'))), row(td()(p('2'))))),
    );
    const newTr = selectRow(2)(tr);
    expect(tr).toBe(newTr);
  });

  it('should return a new transaction that selects a row at `rowIndex`', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = selectRow(0)(tr);
    const selection = tr.selection as CellSelection;
    expect(newTr).not.toBe(tr);
    expect(selection.$anchorCell.pos).toEqual(7);
    expect(selection.$headCell.pos).toEqual(2);
  });

  describe('Expand', () => {
    it('should return a new transaction that expands the existing selection', () => {
      const { tr } = createEditorState(
        doc(
          table()(
            row(td()(p('1{head}')), cEmpty, cEmpty),
            row(cEmpty, cEmpty, td()(p('2{anchor}'))),
            row(cEmpty, cEmpty, cEmpty),
          ),
        ),
      );

      const newTr = selectRow(2, true)(tr);
      const selection = tr.selection as CellSelection;
      expect(newTr).not.toBe(tr);
      expect(selection.$anchorCell.pos).toEqual(40);
      expect(selection.$headCell.pos).toEqual(2);
    });

    it('should return a new transaction that expands the existing text selection', () => {
      const { tr } = createEditorState(
        doc(
          table()(
            row(td()(p('1')), td()(p('2{cursor}')), cEmpty),
            row(cEmpty, cEmpty, td()(p('3'))),
            row(cEmpty, cEmpty, cEmpty),
          ),
        ),
      );

      const newTr = selectRow(2, true)(tr);
      const selection = tr.selection as CellSelection;
      expect(newTr).not.toBe(tr);
      expect(selection.$anchorCell.pos).toEqual(41);
      expect(selection.$headCell.pos).toEqual(2);
    });
  });
});

describe('selectTable', () => {
  it('should return a new transaction that selects the entire table', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td()(p('2'))),
          row(td()(p('3')), td()(p('4'))),
        ),
      ),
    );
    const newTr = selectTable(tr);
    const selection = tr.selection as CellSelection;
    expect(newTr).not.toBe(tr);
    expect(selection.$anchorCell.pos).toEqual(19);
    expect(selection.$headCell.pos).toEqual(2);
  });

  it('should return a new transaction that selects the entire table when last cell is merged', () => {
    const { tr } = createEditorState(
      doc(
        table()(
          row(td()(p('1{cursor}')), td({ rowspan: 3 })(p('2'))),
          row(td()(p('3'))),
          row(td()(p('4'))),
        ),
      ),
    );
    const newTr = selectTable(tr);
    const selection = tr.selection as CellSelection;
    expect(newTr).not.toBe(tr);
    expect(selection.$anchorCell.pos).toEqual(7);
    expect(selection.$headCell.pos).toEqual(2);
  });
});
