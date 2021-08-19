import { Rect } from '@atlaskit/editor-tables/table-map';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  td,
  th,
  thEmpty,
  tdEmpty,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { uuid } from '@atlaskit/adf-schema';
import { TablePluginState } from '../../../../../plugins/table/types';
import { deleteRows } from '../../../../../plugins/table/transforms';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';

const rowsToRect = (rows: Array<number>, noOfColumns: number): Rect => ({
  left: 0,
  right: noOfColumns,
  top: Math.min(...rows),
  bottom: Math.max(...rows) + 1,
});

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('table plugin -> transforms -> delete rows', () => {
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
    describe('when the first row is deleted', () => {
      it('should delete the row and move cursor to the first row', () => {
        const {
          editorView,
          refs: { nextCursorPos },
        } = editor(
          doc(
            p('text'),
            table()(
              tr(td({})(p('{nextCursorPos}a1')), tdEmpty),
              tr(td({})(p('b1')), tdEmpty),
              tr(td({})(p('c1')), tdEmpty),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(deleteRows(rowsToRect([0], 3))(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(td({})(p('b1')), tdEmpty),
              tr(td({})(p('c1')), tdEmpty),
            ),
          ),
        );
        expect(editorView.state.selection.from).toEqual(nextCursorPos);
      });
    });

    describe('when the middle row is deleted', () => {
      it('should delete the row and move cursor to the first row', () => {
        const {
          editorView,
          refs: { nextCursorPos },
        } = editor(
          doc(
            p('text'),
            table()(
              tr(td({})(p('{nextCursorPos}a1')), tdEmpty),
              tr(td({})(p('b1')), tdEmpty),
              tr(td({})(p('c1')), tdEmpty),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(deleteRows(rowsToRect([1], 3))(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(td({})(p('a1')), tdEmpty),
              tr(td({})(p('c1')), tdEmpty),
            ),
          ),
        );
        expect(editorView.state.selection.from).toEqual(nextCursorPos);
      });
    });

    describe('when multiple rows are selected', () => {
      it('should delete those rows', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(td()(p('a1')), td()(p('a2'))),
              tr(td()(p('b1')), td()(p('b2'))),
              tr(td()(p('c1')), td()(p('c2'))),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(deleteRows(rowsToRect([0, 1], 3))(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(td()(p('c1')), td()(p('c2'))),
            ),
          ),
        );
      });
    });
  });

  describe('when one row is selected', () => {
    it('should delete the row', () => {
      const { editorView } = editor(
        doc(
          p('text'),
          table()(
            tr(td({})(p('a1{<cell}')), tdEmpty, td({})(p('{cell>}a3'))),
            tr(td({})(p('b1')), td({})(p('b2')), td({})(p('b3'))),
          ),
        ),
      );
      const { state, dispatch } = editorView;
      dispatch(deleteRows(getSelectionRect(state.selection)!)(state.tr));
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          table({ localId: TABLE_LOCAL_ID })(
            tr(td({})(p('b1')), td({})(p('b2')), td({})(p('b3'))),
          ),
        ),
      );
    });
  });

  describe('when multiple rows are selected', () => {
    it('should delete these rows', () => {
      const { editorView } = editor(
        doc(
          p('text'),
          table()(
            tr(td({})(p('{<cell}a1')), td({})(p('a2'))),
            tr(td({})(p('b1')), td({})(p('{cell>}b2'))),
            tr(td({})(p('c1')), td({})(p('c2'))),
          ),
        ),
      );
      const { state, dispatch } = editorView;
      dispatch(deleteRows(getSelectionRect(state.selection)!)(state.tr));
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          table({ localId: TABLE_LOCAL_ID })(
            tr(td({})(p('c1')), td({})(p('c2'))),
          ),
        ),
      );
    });
  });

  describe('when some of the rows are merged', () => {
    it('should delete rows and update rowspans of cells DOM nodes', () => {
      const { editorView } = editor(
        doc(
          p('text'),
          table()(
            tr(td({ rowspan: 2 })(p('{<cell}c1')), td({})(p('c2'))),
            tr(td({})(p('{cell>}c3'))),
            tr(td({})(p('c4')), td({})(p('c5'))),
          ),
        ),
      );
      const { state, dispatch } = editorView;
      dispatch(deleteRows(getSelectionRect(state.selection)!)(state.tr));
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          table({ localId: TABLE_LOCAL_ID })(
            tr(td({})(p('c4')), td({})(p('c5'))),
          ),
        ),
      );
      const cells = editorView.dom.querySelectorAll('td');
      for (let i = 0, count = cells.length; i < count; i++) {
        const cell = cells[i] as HTMLElement;
        expect(cell.getAttribute('rowspan')).not.toEqual('2');
      }
    });

    describe('when after deleting the last row table has columns where all cells have colspan > 1', () => {
      it('should decrement colspan of these cells', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(td({ colspan: 2 })(p('a1')), td({})(p('a3'))),
              tr(td({ colspan: 2 })(p('b1')), tdEmpty),
              tr(td({})(p('c1{cell>}')), tdEmpty, td({})(p('{<cell}c3'))),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(deleteRows(getSelectionRect(state.selection)!)(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(td({})(p('a1')), td({})(p('a3'))),
              tr(td({})(p('b1')), tdEmpty),
            ),
          ),
        );
      });
    });

    describe('when after deleting the first row table has columns where all cells have colspan > 1', () => {
      it('should decrement colspan of these cells', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(td({})(p('a1{<cell}')), tdEmpty, td({})(p('{cell>}a2'))),
              tr(td({ colspan: 2 })(p('b1')), td({})(p('b3'))),
              tr(td({ colspan: 2 })(p('c1')), td({})(p('c3'))),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(deleteRows(getSelectionRect(state.selection)!)(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(td({})(p('b1')), td({})(p('b3'))),
              tr(td({})(p('c1')), td({})(p('c3'))),
            ),
          ),
        );
      });
    });

    describe('when isHeaderRowRequired = true (Bitbucket)', () => {
      const isHeaderRowRequired = true;

      describe('when only header row is selected', () => {
        it('should do nothing', () => {
          const { editorView } = editor(
            doc(table()(tr(thEmpty), tr(tdEmpty), tr(tdEmpty))),
          );
          const { state, dispatch } = editorView;
          dispatch(
            deleteRows(rowsToRect([0], 3), isHeaderRowRequired)(state.tr),
          );
          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(thEmpty),
                tr(tdEmpty),
                tr(tdEmpty),
              ),
            ),
          );
        });
      });

      describe('when header row and other rows are selected', () => {
        it('should remove selected rows except the header row', () => {
          const { editorView } = editor(
            doc(
              table()(
                tr(th({})(p('header{<cell}')), thEmpty),
                tr(td({})(p('b1{cell>}')), tdEmpty),
                tr(td({})(p('c1')), tdEmpty),
              ),
            ),
          );
          const { state, dispatch } = editorView;
          dispatch(
            deleteRows(
              getSelectionRect(state.selection)!,
              isHeaderRowRequired,
            )(state.tr),
          );
          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(th({})(p('header')), thEmpty),
                tr(td({})(p('c1')), tdEmpty),
              ),
            ),
          );
        });
      });
    });

    describe('when a row-spanning cell is deleted', () => {
      describe('when this cell has colspan = 1', () => {
        it('should append missing cells to the rows below deleted row', () => {
          const { editorView } = editor(
            doc(
              table()(
                tr(
                  td({ colwidth: [110] })(p('a1')),
                  td({ colwidth: [120], rowspan: 3 })(p('a2')),
                  td({ colwidth: [130] })(p('a3')),
                ),
                tr(
                  td({ colwidth: [110] })(p('b1')),
                  td({ colwidth: [130] })(p('b3')),
                ),
                tr(
                  td({ colwidth: [110] })(p('c1')),
                  td({ colwidth: [130] })(p('c3')),
                ),
              ),
            ),
          );
          const { state, dispatch } = editorView;
          dispatch(deleteRows(rowsToRect([0], 3))(state.tr));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  td({ colwidth: [110] })(p('b1')),
                  td({ colwidth: [120] })(p('')),
                  td({ colwidth: [130] })(p('b3')),
                ),
                tr(
                  td({ colwidth: [110] })(p('c1')),
                  td({ colwidth: [120] })(p('')),
                  td({ colwidth: [130] })(p('c3')),
                ),
              ),
            ),
          );
        });
      });

      describe('when this cell has colspan > 1', () => {
        it('should append missing cells to the rows below deleted row', () => {
          const { editorView } = editor(
            doc(
              table()(
                tr(
                  td({ colwidth: [110] })(p('a1')),
                  td({ colwidth: [120, 130], rowspan: 3, colspan: 2 })(p('a2')),
                  td({ colwidth: [140] })(p('a4')),
                ),
                tr(
                  td({ colwidth: [110] })(p('b1')),
                  td({ colwidth: [140] })(p('b4')),
                ),
                tr(
                  td({ colwidth: [110] })(p('c1')),
                  td({ colwidth: [140] })(p('c4')),
                ),
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
          dispatch(deleteRows(rowsToRect([0], 3))(state.tr));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  td({ colwidth: [110] })(p('b1')),
                  td({ colwidth: [120] })(p('')),
                  td({ colwidth: [130] })(p('')),
                  td({ colwidth: [140] })(p('b4')),
                ),
                tr(
                  td({ colwidth: [110] })(p('c1')),
                  td({ colwidth: [120] })(p('')),
                  td({ colwidth: [130] })(p('')),
                  td({ colwidth: [140] })(p('c4')),
                ),
                tr(
                  td({ colwidth: [110] })(p('d1')),
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

    describe('when a row-spanning cell overlaps deleted row from the row above', () => {
      describe('when this cell has colspan = 1', () => {
        it('should decrement the rowspan of that cell', () => {
          const { editorView } = editor(
            doc(
              table()(
                tr(
                  td({ colwidth: [110] })(p('a1')),
                  td({ colwidth: [120, 130], rowspan: 3, colspan: 2 })(p('a2')),
                  td({ colwidth: [140] })(p('a4')),
                ),
                tr(
                  td({ colwidth: [110] })(p('b1')),
                  td({ colwidth: [140] })(p('b4')),
                ),
                tr(
                  td({ colwidth: [110] })(p('c1')),
                  td({ colwidth: [140] })(p('c4')),
                ),
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
          dispatch(deleteRows(rowsToRect([1], 3))(state.tr));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  td({ colwidth: [110] })(p('a1')),
                  td({ colwidth: [120, 130], rowspan: 2, colspan: 2 })(p('a2')),
                  td({ colwidth: [140] })(p('a4')),
                ),
                tr(
                  td({ colwidth: [110] })(p('c1')),
                  td({ colwidth: [140] })(p('c4')),
                ),
                tr(
                  td({ colwidth: [110] })(p('d1')),
                  td({ colwidth: [120] })(p('d2')),
                  td({ colwidth: [130] })(p('d3')),
                  td({ colwidth: [140] })(p('d4')),
                ),
              ),
            ),
          );
        });
      });

      describe('when this cell has colspan > 1', () => {
        it('should decrement the rowspan of that cell', () => {
          const { editorView } = editor(
            doc(
              table()(
                tr(
                  td({ colwidth: [110] })(p('a1')),
                  td({ colwidth: [120], rowspan: 3 })(p('a2')),
                  td({ colwidth: [130] })(p('a3')),
                ),
                tr(
                  td({ colwidth: [110] })(p('b1')),
                  td({ colwidth: [130] })(p('b3')),
                ),
                tr(
                  td({ colwidth: [110] })(p('c1')),
                  td({ colwidth: [130] })(p('c3')),
                ),
              ),
            ),
          );
          const { state, dispatch } = editorView;
          dispatch(deleteRows(rowsToRect([1], 3))(state.tr));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  td({ colwidth: [110] })(p('a1')),
                  td({ colwidth: [120], rowspan: 2 })(p('a2')),
                  td({ colwidth: [130] })(p('a3')),
                ),
                tr(
                  td({ colwidth: [110] })(p('c1')),
                  td({ colwidth: [130] })(p('c3')),
                ),
              ),
            ),
          );
        });
      });
    });

    describe('when a row-spanning cell overlaps two deleted rows from the row above', () => {
      it('should decrement the rowspan of that cell twice', () => {
        const { editorView } = editor(
          doc(
            table()(
              tr(
                td({ colwidth: [110] })(p('a1')),
                td({ colwidth: [120], rowspan: 3 })(p('a2')),
                td({ colwidth: [130] })(p('a3')),
              ),
              tr(
                td({ colwidth: [110] })(p('b1')),
                td({ colwidth: [130] })(p('b3')),
              ),
              tr(
                td({ colwidth: [110] })(p('c1')),
                td({ colwidth: [130] })(p('c3')),
              ),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(deleteRows(rowsToRect([1, 2], 3))(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(
                td({ colwidth: [110] })(p('a1')),
                td({ colwidth: [120] })(p('a2')),
                td({ colwidth: [130] })(p('a3')),
              ),
            ),
          ),
        );
      });
    });
  });
});
