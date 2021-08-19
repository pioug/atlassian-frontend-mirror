import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  DocBuilder,
  doc,
  p,
  table,
  tr,
  td,
  tdEmpty,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { uuid } from '@atlaskit/adf-schema';
import { TablePluginState } from '../../../../../plugins/table/types';
import { mergeCells } from '../../../../../plugins/table/transforms';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('table plugin -> transforms -> merge cells', () => {
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

  describe('#mergeCells', () => {
    it('should merge columns and rows', () => {
      const { editorView } = editor(
        doc(
          p('text'),
          table()(
            tr(td({})(p('{<cell}')), tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
            tr(tdEmpty, td({})(p('{cell>}')), tdEmpty),
          ),
        ),
      );
      const { state, dispatch } = editorView;
      dispatch(mergeCells(state.tr));
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          table({ localId: TABLE_LOCAL_ID })(
            tr(td({ rowspan: 3 })(p('')), tdEmpty),
            tr(tdEmpty),
            tr(tdEmpty),
          ),
        ),
      );
    });

    describe('when two rows gets merged column by column', () => {
      describe('when last non-merged cell gets merged from the end of the row', () => {
        it('should delete an empty row that gets created as a result', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(
                  td({ rowspan: 2 })(p('b1')),
                  td({ rowspan: 2 })(p('b2')),
                  td({})(p('{<cell}b3')),
                ),
                tr(td({})(p('{cell>}c3'))),
              ),
            ),
          );
          const { state, dispatch } = editorView;
          dispatch(mergeCells(state.tr));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(td({})(p('b1')), td({})(p('b2')), td({})(p('b3'), p('c3'))),
              ),
            ),
          );
        });
      });
      describe('when last non-merged cell gets merged from the start of the row', () => {
        it('should delete an empty row that gets created as a result', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(
                  td({})(p('{<cell}b1')),
                  td({ rowspan: 2 })(p('b2')),
                  td({ rowspan: 2 })(p('b3')),
                ),
                tr(td({})(p('{cell>}c1'))),
              ),
            ),
          );
          const { state, dispatch } = editorView;
          dispatch(mergeCells(state.tr));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(td({})(p('b1'), p('c1')), td({})(p('b2')), td({})(p('b3'))),
              ),
            ),
          );
        });
      });
    });

    describe('when more than two rows gets merged', () => {
      describe('when last non-merged cell gets merged from the end of the row', () => {
        it('should delete an empty row that gets created as a result', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({ rowspan: 4 })(p('a1')), td({})(p('{<cell}a2'))),
                tr(tdEmpty),
                tr(td({})(p('{cell>}c2'))),
                tr(tdEmpty),
                tr(tdEmpty, tdEmpty),
              ),
            ),
          );
          const { state, dispatch } = editorView;
          dispatch(mergeCells(state.tr));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(td({ rowspan: 2 })(p('a1')), td({})(p('a2'), p('c2'))),
                tr(tdEmpty),
                tr(tdEmpty, tdEmpty),
              ),
            ),
          );
        });
      });
    });

    describe('when rows from the first columns get merged', () => {
      describe('and table has merged rows in the next column', () => {
        it('should delete an empty row and decrement rowspan of the next column', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({})(p('{<cell}a1')), td({ rowspan: 3 })(p('a2'))),
                tr(td({})(p('{cell>}'))),
                tr(tdEmpty),
              ),
            ),
          );
          const { state, dispatch } = editorView;
          dispatch(mergeCells(state.tr));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(td({})(p('a1')), td({ rowspan: 2 })(p('a2'))),
                tr(tdEmpty),
              ),
            ),
          );
        });
      });
    });

    describe('when rows from the last columns get merged', () => {
      describe('and table has merged rows in the previous column', () => {
        it('should delete an empty row and decrement rowspan of the previous column', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({ rowspan: 3 })(p('a1')), td({})(p('{<cell}a2'))),
                tr(td({})(p('{cell>}'))),
                tr(tdEmpty),
              ),
            ),
          );
          const { state, dispatch } = editorView;
          dispatch(mergeCells(state.tr));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(td({ rowspan: 2 })(p('a1')), td({})(p('a2'))),
                tr(tdEmpty),
              ),
            ),
          );
        });
      });
    });

    describe('when two empty cells are merged', () => {
      it('should fill the merged cell with a paragraph', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(td({})(p('{<cell}')), td({})(p('{cell>}'))),
              tr(tdEmpty, tdEmpty),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(mergeCells(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(td({ colspan: 2 })(p(''))),
              tr(tdEmpty, tdEmpty),
            ),
          ),
        );
      });
    });

    describe('when next column is invisible', () => {
      it('should decrement colspans of the preceeding column', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(tdEmpty, td({})(p('{<cell}')), tdEmpty, td({})(p('{cell>}'))),
              tr(tdEmpty, td({ colspan: 3 })(p(''))),
              tr(tdEmpty, td({ colspan: 2 })(p('')), tdEmpty),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(mergeCells(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(tdEmpty, td({ colspan: 2 })(p(''))),
              tr(tdEmpty, td({ colspan: 2 })(p(''))),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );
      });
    });

    describe('when next column is not invisible', () => {
      it('should not decrement colspans of the preceeding column', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(tdEmpty, td({})(p('{<cell}')), tdEmpty, td({})(p('{cell>}'))),
              tr(tdEmpty, td({ colspan: 3 })(p(''))),
              tr(tdEmpty, td({ colspan: 2 })(p('')), tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(mergeCells(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(tdEmpty, td({ colspan: 3 })(p(''))),
              tr(tdEmpty, td({ colspan: 3 })(p(''))),
              tr(tdEmpty, td({ colspan: 2 })(p('')), tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );
      });
    });

    describe('when empty cells and cells with content are merged together', () => {
      it('should copy content from merged cells dropping empty cells', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(td({})(p('1')), td({})(p('2'))),
              tr(td({ colspan: 2 })(p('{<cell}'))),
              tr(td({})(p('1')), td({})(p('2{cell>}'))),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(mergeCells(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(td({})(p('1')), td({})(p('2'))),
              tr(td({ colspan: 2 })(p('1'), p('2'))),
            ),
          ),
        );
      });
    });

    describe('when table has columns where all cells have colspan > 1', () => {
      it('should delete an empty column', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(
                td({})(p('1')),
                td({})(p('2')),
                td({ colspan: 2, rowspan: 2 })(p('3')),
                td({})(p('5')),
                td({})(p('6')),
              ),
              tr(tdEmpty, tdEmpty, tdEmpty, tdEmpty),
              tr(
                td({})(p('1')),
                td({})(p('{<cell}2')),
                td({})(p('3')),
                td({})(p('4')),
                td({})(p('5{cell>}')),
                td({})(p('6')),
              ),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        dispatch(mergeCells(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(
                td({})(p('1')),
                td({})(p('2')),
                td({ rowspan: 2 })(p('3')),
                td({})(p('5')),
                td({})(p('6')),
              ),
              tr(tdEmpty, tdEmpty, tdEmpty, tdEmpty),
              tr(
                td({})(p('1')),
                td({ colspan: 3 })(p('2'), p('3'), p('4'), p('5')),
                td({})(p('6')),
              ),
            ),
          ),
        );
      });
    });
  });
});
