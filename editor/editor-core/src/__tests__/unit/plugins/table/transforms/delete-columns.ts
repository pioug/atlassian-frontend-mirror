import { Rect } from '@atlaskit/editor-tables/table-map';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  td,
  tdCursor,
  tdEmpty,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { uuid } from '@atlaskit/adf-schema';
import { TablePluginState } from '../../../../../plugins/table/types';
import { deleteColumns } from '../../../../../plugins/table/transforms';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';

const colsToRect = (cols: Array<number>, noOfRows: number): Rect => ({
  left: Math.min(...cols),
  right: Math.max(...cols) + 1,
  top: 0,
  bottom: noOfRows,
});

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('table plugin -> transforms -> delete columns', () => {
  beforeAll(() => {
    uuid.setStatic(TABLE_LOCAL_ID);
  });

  afterAll(() => {
    uuid.setStatic(false);
  });

  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
      pluginKey,
    });

  describe('when selection rect is given', () => {
    describe('when the first column is deleted', () => {
      it('should delete the column and move cursor to the first column', () => {
        const {
          editorView,
          refs: { nextCursorPos },
        } = editor(
          doc(
            p('text'),
            table()(
              tr(
                td({})(p('{nextCursorPos}')),
                td({})(p('c2')),
                td({})(p('c3')),
              ),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(deleteColumns(colsToRect([0], 1))(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(td({})(p('c2')), td()(p('c3'))),
            ),
          ),
        );
        expect(editorView.state.selection.from).toEqual(nextCursorPos);
      });
    });

    describe('when middle column is deleted', () => {
      it('should delete the column and move cursor to the previous column', () => {
        const {
          editorView,
          refs: { nextCursorPos },
        } = editor(
          doc(
            p('text'),
            table()(
              tr(
                td({})(p('{nextCursorPos}')),
                td({})(p('c2')),
                td({})(p('c3')),
              ),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(deleteColumns(colsToRect([1], 1))(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(tr(tdEmpty, td()(p('c3')))),
          ),
        );
        expect(editorView.state.selection.from).toEqual(nextCursorPos);
      });
    });

    describe('when multiple rows are selected', () => {
      it('should delete these columns', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(tr(tdCursor, td({})(p('c1')), td({})(p('c2')))),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(deleteColumns(colsToRect([0, 1], 1))(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text'), table({ localId: TABLE_LOCAL_ID })(tr(td()(p('c2'))))),
        );
      });
    });
  });

  describe('when one column is selected', () => {
    it('should delete the column', () => {
      const { editorView } = editor(
        doc(
          p('text'),
          table()(
            tr(td({})(p('a1')), td({})(p('{<cell}a2')), td({})(p('a3'))),
            tr(td({})(p('b1')), td({})(p('{cell>}b2')), td({})(p('b3'))),
          ),
        ),
      );
      const { state, dispatch } = editorView;
      dispatch(deleteColumns(getSelectionRect(state.selection)!)(state.tr));
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          table({ localId: TABLE_LOCAL_ID })(
            tr(td({})(p('a1')), td({})(p('a3'))),
            tr(td({})(p('b1')), td({})(p('b3'))),
          ),
        ),
      );
    });
  });

  describe('when multiple columns are selected', () => {
    it('should delete these column', () => {
      const { editorView } = editor(
        doc(
          p('text'),
          table()(
            tr(td({})(p('{<cell}a1')), td({})(p('a2')), td({})(p('a3'))),
            tr(td({})(p('b1')), td({})(p('{cell>}b2')), td({})(p('b3'))),
          ),
        ),
      );
      const { state, dispatch } = editorView;
      dispatch(deleteColumns(getSelectionRect(state.selection)!)(state.tr));
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          table({ localId: TABLE_LOCAL_ID })(
            tr(td({})(p('a3'))),
            tr(td({})(p('b3'))),
          ),
        ),
      );
    });
  });

  describe('when some of the columns are merged', () => {
    it('should delete columns and update colspans of cells DOM nodes', () => {
      const { editorView } = editor(
        doc(
          p('text'),
          table()(
            tr(td({ colspan: 2 })(p('{<cell}c1')), td({})(p('c2'))),
            tr(td({})(p('{cell>}c3')), td({})(p('c4')), td({})(p('c5'))),
          ),
        ),
      );
      const { state, dispatch } = editorView;
      dispatch(deleteColumns(getSelectionRect(state.selection)!)(state.tr));
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          table({ localId: TABLE_LOCAL_ID })(
            tr(td({ colspan: 1 })(p('c2'))),
            tr(td({ colspan: 1 })(p('c5'))),
          ),
        ),
      );
      const cells = editorView.dom.querySelectorAll('td');
      for (let i = 0, count = cells.length; i < count; i++) {
        const cell = cells[i] as HTMLElement;
        expect(cell.getAttribute('colspan')).not.toEqual('2');
      }
    });

    describe('when after deleting the last column table has rows where cells have rowspans > 1 in each column', () => {
      it('should decrement rowspans of these cells', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(tdEmpty, tdEmpty, td({})(p('{<cell}a3'))),
              tr(
                td({ rowspan: 2 })(p('b1')),
                td({ rowspan: 2 })(p('b2')),
                tdEmpty,
              ),
              tr(td({})(p('{cell>}c3'))),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(deleteColumns(getSelectionRect(state.selection)!)(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(tdEmpty, tdEmpty),
              tr(td({})(p('b1')), td({})(p('b2'))),
            ),
          ),
        );
      });
    });

    describe('when after deleting the first column table has rows where cells have rowspans > 1 in each column', () => {
      it('should decrement rowspans of these cells', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
              tr(
                tdEmpty,
                td({ rowspan: 2 })(p('b2')),
                td({ rowspan: 2 })(p('b3')),
              ),
              tr(td({})(p('{cell>}c1'))),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(deleteColumns(getSelectionRect(state.selection)!)(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(tdEmpty, tdEmpty),
              tr(td({})(p('b2')), td({})(p('b3'))),
            ),
          ),
        );
      });
    });

    describe('when a column-spanning cell is deleted', () => {
      describe('when this cell has rowspan = 1', () => {
        it('should append missing cells to the column(s) to the right from the deleted column', () => {
          const { editorView } = editor(
            doc(
              table()(
                tr(
                  td({ colwidth: [110] })(p('a1')),
                  td({ colwidth: [120] })(p('a2')),
                  td({ colwidth: [130] })(p('a3')),
                ),
                tr(td({ colwidth: [110, 120, 130], colspan: 3 })(p('b1'))),
                tr(
                  td({ colwidth: [110] })(p('c1')),
                  td({ colwidth: [120] })(p('c2')),
                  td({ colwidth: [130] })(p('c3')),
                ),
              ),
            ),
          );
          const { state, dispatch } = editorView;
          dispatch(deleteColumns(colsToRect([0], 3))(state.tr));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  td({ colwidth: [120] })(p('a2')),
                  td({ colwidth: [130] })(p('a3')),
                ),
                tr(
                  td({ colwidth: [120] })(p('')),
                  td({ colwidth: [130] })(p('')),
                ),
                tr(
                  td({ colwidth: [120] })(p('c2')),
                  td({ colwidth: [130] })(p('c3')),
                ),
              ),
            ),
          );
        });
      });

      describe('when this cell has rowspan > 1', () => {
        it('should append missing cells to the column(s) to the right from the deleted column', () => {
          const { editorView } = editor(
            doc(
              table()(
                tr(
                  td({ colwidth: [110] })(p('a1')),
                  td({ colwidth: [120] })(p('a2')),
                  td({ colwidth: [130] })(p('a3')),
                  td({ colwidth: [140] })(p('a4')),
                ),
                tr(
                  td({ colwidth: [110, 120, 130], colspan: 3, rowspan: 2 })(
                    p('b1'),
                  ),
                  td({ colwidth: [140] })(p('b4')),
                ),
                tr(td({ colwidth: [140] })(p('c4'))),
                tr(
                  td({ colwidth: [110] })(p('d1')),
                  td({ colwidth: [120] })(p('d2')),
                  td({ colwidth: [130] })(p('d3')),
                  td({ colwidth: [140] })(p('d4')),
                ),
              ),
            ),
          );
          const { state, dispatch } = editorView;
          dispatch(deleteColumns(colsToRect([0], 4))(state.tr));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  td({ colwidth: [120] })(p('a2')),
                  td({ colwidth: [130] })(p('a3')),
                  td({ colwidth: [140] })(p('a4')),
                ),
                tr(
                  td({ colwidth: [120] })(p('')),
                  td({ colwidth: [130] })(p('')),
                  td({ colwidth: [140] })(p('b4')),
                ),
                tr(
                  td({ colwidth: [120] })(p('')),
                  td({ colwidth: [130] })(p('')),
                  td({ colwidth: [140] })(p('c4')),
                ),
                tr(
                  td({ colwidth: [120] })(p('d2')),
                  td({ colwidth: [130] })(p('d3')),
                  td({ colwidth: [140] })(p('d4')),
                ),
              ),
            ),
          );
        });
      });
    });

    describe('when a column-spanning cell overlaps deleted column from the left', () => {
      describe('when this cell has rowspan = 1', () => {
        it('should decrement the colspan of that cell', () => {
          const { editorView } = editor(
            doc(
              table()(
                tr(
                  td({ colwidth: [110] })(p('a1')),
                  td({ colwidth: [120] })(p('a2')),
                  td({ colwidth: [130] })(p('a3')),
                ),
                tr(td({ colwidth: [110, 120, 130], colspan: 3 })(p('b1'))),
                tr(
                  td({ colwidth: [110] })(p('c1')),
                  td({ colwidth: [120] })(p('c2')),
                  td({ colwidth: [130] })(p('c3')),
                ),
              ),
            ),
          );
          const { state, dispatch } = editorView;
          dispatch(deleteColumns(colsToRect([1], 3))(state.tr));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  td({ colwidth: [110] })(p('a1')),
                  td({ colwidth: [130] })(p('a3')),
                ),
                tr(td({ colwidth: [110, 130], colspan: 2 })(p('b1'))),
                tr(
                  td({ colwidth: [110] })(p('c1')),
                  td({ colwidth: [130] })(p('c3')),
                ),
              ),
            ),
          );
        });
      });

      describe('when this cell has rowspan > 1', () => {
        it('should decrement the colspan of that cell', () => {
          const { editorView } = editor(
            doc(
              table()(
                tr(
                  td({ colwidth: [110] })(p('a1')),
                  td({ colwidth: [120] })(p('a2')),
                  td({ colwidth: [130] })(p('a3')),
                  td({ colwidth: [140] })(p('a4')),
                ),
                tr(
                  td({ colwidth: [110, 120, 130], colspan: 3, rowspan: 2 })(
                    p('b1'),
                  ),
                  td({ colwidth: [140] })(p('b4')),
                ),
                tr(td({ colwidth: [140] })(p('c4'))),
                tr(
                  td({ colwidth: [110] })(p('d1')),
                  td({ colwidth: [120] })(p('d2')),
                  td({ colwidth: [130] })(p('d3')),
                  td({ colwidth: [140] })(p('d4')),
                ),
              ),
            ),
          );
          const { state, dispatch } = editorView;
          dispatch(deleteColumns(colsToRect([1], 4))(state.tr));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  td({ colwidth: [110] })(p('a1')),
                  td({ colwidth: [130] })(p('a3')),
                  td({ colwidth: [140] })(p('a4')),
                ),
                tr(
                  td({ colwidth: [110, 130], colspan: 2, rowspan: 2 })(p('b1')),
                  td({ colwidth: [140] })(p('b4')),
                ),
                tr(td({ colwidth: [140] })(p('c4'))),
                tr(
                  td({ colwidth: [110] })(p('d1')),
                  td({ colwidth: [130] })(p('d3')),
                  td({ colwidth: [140] })(p('d4')),
                ),
              ),
            ),
          );
        });
      });
    });

    describe('when a column-spanning cell overlaps two deleted columns from the left', () => {
      it('should decrement the colspan of that cell twice', () => {
        const { editorView } = editor(
          doc(
            table()(
              tr(
                td({ colwidth: [110] })(p('a1')),
                td({ colwidth: [120] })(p('a2')),
                td({ colwidth: [130] })(p('a3')),
              ),
              tr(td({ colwidth: [110, 120, 130], colspan: 3 })(p('b1'))),
              tr(
                td({ colwidth: [110] })(p('c1')),
                td({ colwidth: [120] })(p('c2')),
                td({ colwidth: [130] })(p('c3')),
              ),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(deleteColumns(colsToRect([1, 2], 3))(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td({ colwidth: [110] })(p('a1'))),
              tr(td({ colwidth: [110] })(p('b1'))),
              tr(td({ colwidth: [110] })(p('c1'))),
            ),
          ),
        );
      });
    });
  });
});
