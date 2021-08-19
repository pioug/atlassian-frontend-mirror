import { TextSelection } from 'prosemirror-state';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import {
  selectRow,
  selectColumn,
  selectTable,
} from '@atlaskit/editor-tables/utils';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import randomId from '@atlaskit/editor-test-helpers/random-id';

import {
  doc,
  p,
  thEmpty,
  table,
  tr,
  td,
  th,
  ul,
  li,
  tdEmpty,
  tdCursor,
  thCursor,
  strong,
  mediaGroup,
  mediaSingle,
  media,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import {
  TablePluginState,
  PluginConfig,
} from '../../../../plugins/table/types';
import {
  createTable,
  setEditorFocus,
  toggleHeaderRow,
  toggleHeaderColumn,
  insertColumn,
  insertRow,
} from '../../../../plugins/table/commands';
import { setNodeSelection } from '../../../../utils';
import { uuid } from '@atlaskit/adf-schema';
import { uuid as tablesUuid } from '@atlaskit/editor-tables';
import {
  checkIfNumberColumnEnabled,
  checkIfHeaderColumnEnabled,
  checkIfHeaderRowEnabled,
} from '../../../../plugins/table/utils';
import { insertMediaAsMediaSingle } from '../../../../plugins/media/utils/media-single';
import { INPUT_METHOD } from '../../../../plugins/analytics';
import {
  getPluginState,
  pluginKey,
} from '../../../../plugins/table/pm-plugins/plugin-factory';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('table plugin', () => {
  beforeAll(() => {
    uuid.setStatic(TABLE_LOCAL_ID);
    tablesUuid.setStatic(TABLE_LOCAL_ID);
  });

  afterAll(() => {
    uuid.setStatic(false);
    tablesUuid.setStatic(false);
  });
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder) => {
    const tableOptions = {
      allowNumberColumn: true,
      allowHeaderRow: true,
      allowHeaderColumn: true,
      permittedLayouts: 'all',
    } as PluginConfig;

    return createEditor({
      doc,
      editorProps: {
        allowTables: tableOptions,
        allowAnalyticsGASV3: true,
        media: {
          allowMediaSingle: true,
        },
      },
      pluginKey,
    });
  };

  describe('createTable()', () => {
    describe('when the cursor is outside the table', () => {
      it('it should create a new table and return true', () => {
        const { editorView } = editor(doc(p('{<>}')));
        expect(createTable()(editorView.state, editorView.dispatch)).toEqual(
          true,
        );
        const tableNode = table({ localId: TABLE_LOCAL_ID })(
          tr(thEmpty, thEmpty, thEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        );
        expect(editorView.state.doc).toEqualDocument(doc(tableNode));
      });
    });

    describe('when selection has a mark', () => {
      it('it should create a new table and return true', () => {
        const { editorView } = editor(doc(p(strong('text{<>}'))));
        expect(createTable()(editorView.state, editorView.dispatch)).toEqual(
          true,
        );
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(strong('text')),
            table({ localId: TABLE_LOCAL_ID })(
              tr(thEmpty, thEmpty, thEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );
      });
    });
  });

  describe('insertColumn(number)', () => {
    it('should not insert a column if selection is not in table', () => {
      const { editorView } = editor(doc(p('{<>}')));

      expect(insertColumn(2)(editorView.state, editorView.dispatch)).toBe(
        false,
      );
    });

    describe('when table has 2 columns', () => {
      describe('when it called with 0', () => {
        it("it should prepend a new column and move cursor inside it's first cell", () => {
          const { editorView } = editor(
            doc(p('text'), table()(tr(td({})(p('c1')), td({})(p('c2{<>}'))))),
          );

          insertColumn(0)(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(tdCursor, td({})(p('c1')), td({})(p('c2'))),
              ),
            ),
          );
          expect(editorView.state.selection.$from.pos).toEqual(10);
        });
      });

      describe('when it called with 1', () => {
        it("it should insert a new column in the middle and move cursor inside it's first cell", () => {
          const { editorView } = editor(
            doc(p('text'), table()(tr(td({})(p('c1{<>}')), td({})(p('c2'))))),
          );

          insertColumn(1)(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(td({})(p('c1')), tdCursor, td({})(p('c2'))),
              ),
            ),
          );
          expect(editorView.state.selection.$from.pos).toEqual(16);
        });
      });

      describe('when it called with 2', () => {
        it("it should append a new column and move cursor inside it's first cell", () => {
          const { editorView } = editor(
            doc(p('text'), table()(tr(td({})(p('c1{<>}')), td({})(p('c2'))))),
          );

          insertColumn(2)(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(td({})(p('c1')), td({})(p('c2')), tdCursor),
              ),
            ),
          );
          expect(editorView.state.selection.$from.pos).toEqual(22);
        });
      });
    });
  });

  describe('insertRow(number)', () => {
    const MOVE_SELECTION_TO_THE_NEW_LINE = true;
    const KEEP_THE_CURRENT_SELECTION = false;

    describe('when the cursor should not move', () => {
      it('should keep the selection', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(tr(td({})(p('row1'))), tr(td({})(p('row2{<>}')))),
          ),
        );

        insertRow(0, KEEP_THE_CURRENT_SELECTION)(
          editorView.state,
          editorView.dispatch,
        );

        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(tdEmpty),
              tr(td({})(p('row1'))),
              tr(td({})(p('row2{<>}'))),
            ),
          ),
        );
      });
    });

    describe('when table has 2 rows', () => {
      describe('when it called with 0', () => {
        it("it should prepend a new row and move cursor inside it's first cell", () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(tr(td({})(p('row1'))), tr(td({})(p('row2{<>}')))),
            ),
          );

          insertRow(0, MOVE_SELECTION_TO_THE_NEW_LINE)(
            editorView.state,
            editorView.dispatch,
          );
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(tdCursor),
                tr(td({})(p('row1'))),
                tr(td({})(p('row2'))),
              ),
            ),
          );
          expect(editorView.state.selection.$from.pos).toEqual(10);
        });
      });

      describe('when it called with 1', () => {
        it("it should insert a new row in the middle and move cursor inside it's first cell", () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(tr(td({})(p('row1{<>}'))), tr(td({})(p('row2')))),
            ),
          );

          insertRow(1, MOVE_SELECTION_TO_THE_NEW_LINE)(
            editorView.state,
            editorView.dispatch,
          );
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(td({})(p('row1'))),
                tr(tdCursor),
                tr(td({})(p('row2'))),
              ),
            ),
          );
          expect(editorView.state.selection.$from.pos).toEqual(20);
        });
      });
    });

    describe('when table has 2 row', () => {
      describe('when it called with 2', () => {
        it("it should append a new row and move cursor inside it's first cell", () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(tr(td({})(p('row1{<>}'))), tr(td({})(p('row2')))),
            ),
          );

          insertRow(2, MOVE_SELECTION_TO_THE_NEW_LINE)(
            editorView.state,
            editorView.dispatch,
          );
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(td({})(p('row1'))),
                tr(td({})(p('row2'))),
                tr(tdCursor),
              ),
            ),
          );
          expect(editorView.state.selection.$from.pos).toEqual(30);
        });
      });
    });

    describe('when adding a new row', () => {
      describe('when table has merged columns in rows', () => {
        it('copies the structure', () => {
          const { editorView } = editor(
            doc(
              table()(
                tr(td({})(p('row1')), td()(p())),
                tr(td({ colspan: 2, background: '#e6fcff' })(p('row2{<>}'))),
              ),
            ),
          );

          insertRow(2, MOVE_SELECTION_TO_THE_NEW_LINE)(
            editorView.state,
            editorView.dispatch,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td({})(p('row1')), td()(p())),
                tr(td({ colspan: 2, background: '#e6fcff' })(p('row2'))),
                tr(td({ colspan: 2, background: '#e6fcff' })(p('{<>}'))),
              ),
            ),
          );
        });
      });

      it('copies the structure from a tableCell', () => {
        const { editorView } = editor(
          doc(
            table()(
              tr(th({})(p()), th({})(p())),
              tr(td({ background: '#e6fcff' })(p('row1')), td()(p('{<>}'))),
              tr(td({ colspan: 2, background: '#e6fcff' })(p('row2'))),
            ),
          ),
        );

        insertRow(2, MOVE_SELECTION_TO_THE_NEW_LINE)(
          editorView.state,
          editorView.dispatch,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(th({})(p()), th({})(p())),
              tr(td({ background: '#e6fcff' })(p('row1')), td()(p())),
              tr(td({ background: '#e6fcff' })(p('{<>}')), td()(p())),
              tr(td({ colspan: 2, background: '#e6fcff' })(p('row2'))),
            ),
          ),
        );
      });

      it('should not insert a row if selection is not in table', () => {
        const { editorView } = editor(doc(p('{<>}')));

        expect(
          insertRow(2, MOVE_SELECTION_TO_THE_NEW_LINE)(
            editorView.state,
            editorView.dispatch,
          ),
        ).toBe(false);
      });

      it('copies the structure from a tableHeader', () => {
        const { editorView } = editor(
          doc(
            table()(
              tr(th({})(p('row1')), th()(p()), th()(p('{<>}'))),
              tr(
                th({ colspan: 2, background: '#e6fcff' })(p('row2')),
                td()(p()),
              ),
            ),
          ),
        );

        insertRow(2, MOVE_SELECTION_TO_THE_NEW_LINE)(
          editorView.state,
          editorView.dispatch,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(th({})(p('row1')), th()(p()), th()(p())),
              tr(
                th({ colspan: 2, background: '#e6fcff' })(p('row2')),
                td()(p()),
              ),
              tr(th({ colspan: 2, background: '#e6fcff' })(p()), td()(p())),
            ),
          ),
        );
      });
    });
  });

  describe('selectColumn(number)', () => {
    describe('when table has 3 columns', () => {
      [0, 1, 2].forEach((column) => {
        describe(`when called with ${column}`, () => {
          it(`it should select ${column} column`, () => {
            const { editorView } = editor(
              doc(p('text'), table()(tr(tdCursor, tdEmpty, tdEmpty))),
            );

            editorView.dispatch(selectColumn(column)(editorView.state.tr));
            const selection = (editorView.state
              .selection as any) as CellSelection;
            const tableNode = selection.$anchorCell.node(-1);
            const map = TableMap.get(tableNode);
            const start = selection.$anchorCell.start(-1);
            const anchor = map.colCount(selection.$anchorCell.pos - start);
            const head = map.colCount(selection.$headCell.pos - start);
            expect(anchor).toEqual(column);
            expect(head).toEqual(column);
            expect(selection.isColSelection()).toEqual(true);
          });
        });
      });
    });
  });

  describe('selectRow(number)', () => {
    describe('when table has 3 rows', () => {
      [0, 1, 2].forEach((row) => {
        describe(`when called with ${row}`, () => {
          it(`it should select ${row} row`, () => {
            const { editorView } = editor(
              doc(p('text'), table()(tr(tdCursor), tr(tdEmpty), tr(tdEmpty))),
            );

            editorView.dispatch(selectRow(row)(editorView.state.tr));
            const selection = (editorView.state
              .selection as any) as CellSelection;
            const anchor = selection.$anchorCell.index(-1);
            const head = selection.$headCell.index(-1);
            expect(anchor).toEqual(row);
            expect(head).toEqual(row);
            expect(selection.isRowSelection()).toEqual(true);
          });
        });
      });
    });
  });

  describe('selectTable()', () => {
    it('it should select the whole table', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdCursor), tr(tdEmpty), tr(tdEmpty))),
      );

      editorView.dispatch(selectTable(editorView.state.tr));
      const selection = (editorView.state.selection as any) as CellSelection;
      expect(selection.isRowSelection()).toEqual(true);
      expect(selection.isColSelection()).toEqual(true);
    });
  });

  describe('toggleHeaderRow()', () => {
    describe('when the table has rowspan and colspan', () => {
      const buildTableDoc = (hasHeaderRow: boolean) => {
        const cell = hasHeaderRow ? th : td;
        return doc(
          p('text'),
          table({ localId: TABLE_LOCAL_ID })(
            tr(cell({ colspan: 2 })(p('')), cell({ rowspan: 2 })(p(''))),
            tr(tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        );
      };

      it('should add header cells on the first line', () => {
        const { editorView } = editor(buildTableDoc(false));

        toggleHeaderRow(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(buildTableDoc(true));
      });

      it('should remove header cells on first line', () => {
        const { editorView } = editor(buildTableDoc(true));

        toggleHeaderRow(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(buildTableDoc(false));
      });
    });

    describe("when there's no header row yet", () => {
      it('it should convert first row to a header row', () => {
        // p('text') goes before table to ensure that conversion uses absolute position of cells relative to the document
        const { editorView } = editor(
          doc(p('text'), table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
        );
        toggleHeaderRow(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(thEmpty, thEmpty),
              tr(tdEmpty, tdEmpty),
            ),
          ),
        );
      });

      describe('when header column is enabled', () => {
        it('it should convert the rest of the cells from the first row to header cells', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(tr(thCursor, tdEmpty), tr(thEmpty, tdEmpty)),
            ),
          );
          toggleHeaderRow(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(thEmpty, thEmpty),
                tr(thEmpty, tdEmpty),
              ),
            ),
          );
        });
      });
    });

    describe('when header row is enabled', () => {
      it('it should convert first row to a normal row', () => {
        const { editorView } = editor(
          doc(p('text'), table()(tr(thEmpty, thEmpty), tr(tdEmpty, tdEmpty))),
        );
        toggleHeaderRow(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty),
            ),
          ),
        );
      });

      describe('when header column is enabled', () => {
        it('it should convert the rest of the cells from the first row to normal cells', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(tr(thCursor, thEmpty), tr(thEmpty, tdEmpty)),
            ),
          );
          toggleHeaderRow(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(thEmpty, tdEmpty),
                tr(thEmpty, tdEmpty),
              ),
            ),
          );
        });
      });
    });
  });

  describe('toggleHeaderColumn()', () => {
    describe("when there's no header column yet", () => {
      it('it should convert first column to a header column', () => {
        // p('text') goes before table to ensure that conversion uses absolute position of cells relative to the document
        const { editorView } = editor(
          doc(p('text'), table()(tr(tdEmpty, tdEmpty), tr(tdEmpty, tdEmpty))),
        );
        toggleHeaderColumn(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(thEmpty, tdEmpty),
              tr(thEmpty, tdEmpty),
            ),
          ),
        );
      });

      describe('when header row is enabled', () => {
        it('it should convert the rest of the cells from the first column to header cells', () => {
          const { editorView } = editor(
            doc(p('text'), table()(tr(thEmpty, thEmpty), tr(tdEmpty, tdEmpty))),
          );
          toggleHeaderColumn(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(thEmpty, thEmpty),
                tr(thEmpty, tdEmpty),
              ),
            ),
          );
        });
      });
    });

    describe('when header column is enabled', () => {
      it('it should convert first column to a normal column', () => {
        const { editorView } = editor(
          doc(p('text'), table()(tr(thEmpty, tdEmpty), tr(thEmpty, tdEmpty))),
        );
        toggleHeaderColumn(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            table({ localId: TABLE_LOCAL_ID })(
              tr(tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty),
            ),
          ),
        );
      });

      describe('when header row is enabled', () => {
        it('it should convert the rest of the cells from the first column to normal cells', () => {
          const { editorView } = editor(
            doc(p('text'), table()(tr(thEmpty, thEmpty), tr(thEmpty, tdEmpty))),
          );
          toggleHeaderColumn(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(thEmpty, thEmpty),
                tr(tdEmpty, tdEmpty),
              ),
            ),
          );
        });
      });
    });
  });

  describe('when the cells contains only an image', () => {
    it('should add a paragraph below when arrow down is pressed', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(
              td()(
                mediaGroup(
                  media({
                    id: 'af9310df-fee5-459a-a968-99062ecbb756',
                    type: 'file',
                    collection: 'MediaServicesSample',
                    __fileMimeType: 'image/jpeg',
                  })(),
                ),
              ),
              tdEmpty,
              tdEmpty,
            ),
            tr(td()(p('2')), tdEmpty, tdEmpty),
          ),
        ),
      );

      setNodeSelection(editorView, 4);
      sendKeyToPm(editorView, 'ArrowDown');

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(
              td()(
                mediaGroup(
                  media({
                    id: 'af9310df-fee5-459a-a968-99062ecbb756',
                    type: 'file',
                    collection: 'MediaServicesSample',
                    __fileMimeType: 'image/jpeg',
                  })(),
                ),
                p(''),
              ),
              tdEmpty,
              tdEmpty,
            ),
            tr(td()(p('2')), tdEmpty, tdEmpty),
          ),
        ),
      );
    });

    it('should add a paragraph above when arrow up is pressed', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(
              td()(
                mediaGroup(
                  media({
                    id: 'af9310df-fee5-459a-a968-99062ecbb756',
                    type: 'file',
                    collection: 'MediaServicesSample',
                    __fileMimeType: 'image/jpeg',
                  })(),
                ),
              ),
              tdEmpty,
              tdEmpty,
            ),
            tr(td()(p('2')), tdEmpty, tdEmpty),
          ),
        ),
      );

      setNodeSelection(editorView, 4);
      sendKeyToPm(editorView, 'ArrowUp');

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(
              td()(
                p(''),
                mediaGroup(
                  media({
                    id: 'af9310df-fee5-459a-a968-99062ecbb756',
                    type: 'file',
                    collection: 'MediaServicesSample',
                    __fileMimeType: 'image/jpeg',
                  })(),
                ),
              ),
              tdEmpty,
              tdEmpty,
            ),
            tr(td()(p('2')), tdEmpty, tdEmpty),
          ),
        ),
      );
    });

    it('should not add a paragraph, if there already is a paragraph below when arrow down is pressed', () => {
      const docWithTable = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(
            td()(
              mediaGroup(
                media({
                  id: 'af9310df-fee5-459a-a968-99062ecbb756',
                  type: 'file',
                  collection: 'MediaServicesSample',
                  __fileMimeType: 'image/jpeg',
                })(),
              ),
              p('1'),
              p('2'),
            ),
            tdEmpty,
            tdEmpty,
          ),
          tr(td()(p('3')), tdEmpty, tdEmpty),
        ),
      );

      const { editorView } = editor(docWithTable);

      setNodeSelection(editorView, 4);
      sendKeyToPm(editorView, 'ArrowDown');

      expect(editorView.state.doc).toEqualDocument(docWithTable);
    });

    it('should not add a paragraph, if there already is a paragraph above when arrow up is pressed', () => {
      const docWithTable = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(
            td()(
              p('1'),
              p('2'),
              mediaGroup(
                media({
                  id: 'af9310df-fee5-459a-a968-99062ecbb756',
                  type: 'file',
                  collection: 'MediaServicesSample',
                  __fileMimeType: 'image/jpeg',
                })(),
              ),
            ),
            tdEmpty,
            tdEmpty,
          ),
          tr(td()(p('3')), tdEmpty, tdEmpty),
        ),
      );

      const { editorView } = editor(docWithTable);

      setNodeSelection(editorView, 6);
      sendKeyToPm(editorView, 'ArrowUp');

      expect(editorView.state.doc).toEqualDocument(docWithTable);
    });
  });

  describe('when images is inside lists in table', () => {
    const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
    const temporaryFileId = `temporary:${randomId()}`;

    it('inserts image as single', () => {
      const { editorView } = editor(
        doc(
          p('1'),
          table()(
            tr(td()(p('2'), ul(li(p('3{<>}'))))),
            tr(tdEmpty),
            tr(tdEmpty),
          ),
        ),
      );

      insertMediaAsMediaSingle(
        editorView,
        media({
          id: temporaryFileId,
          type: 'file',
          collection: testCollectionName,
          __fileMimeType: 'image/png',
        })()(editorView.state.schema),
        INPUT_METHOD.PICKER_CLOUD,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('1'),
          table({ localId: TABLE_LOCAL_ID })(
            tr(
              td()(
                p('2'),
                ul(
                  li(
                    p('3'),
                    mediaSingle()(
                      media({
                        id: temporaryFileId,
                        type: 'file',
                        collection: testCollectionName,
                        __fileMimeType: 'image/png',
                      })(),
                    ),
                  ),
                ),
              ),
            ),
            tr(tdEmpty),
            tr(tdEmpty),
          ),
        ),
      );
    });
  });

  describe('checkIfNumberColumnEnabled', () => {
    it('should return false if table is not in focus', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      expect(checkIfNumberColumnEnabled(editorView.state)).toBe(false);
    });
  });

  describe('checkIfHeaderColumnEnabled', () => {
    it('should return false if table is not in focus', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      expect(checkIfHeaderColumnEnabled(editorView.state)).toBe(false);
    });
  });

  describe('checkIfHeaderRowEnabled', () => {
    it('should return false if table is not in focus', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      expect(checkIfHeaderRowEnabled(editorView.state)).toBe(false);
    });
  });

  describe('checkIfHeaderRowEnabled', () => {
    it('should return false if table is not in focus', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      expect(checkIfHeaderRowEnabled(editorView.state)).toBe(false);
    });
  });

  describe('table plugin state', () => {
    it('should update tableNode when cursor enters the table', () => {
      const {
        editorView: view,
        refs: { nextPos },
      } = editor(doc(table()(tr(td()(p('{nextPos}')))), p('te{<>}xt')));

      setEditorFocus(true)(view.state, view.dispatch);

      view.dispatch(
        view.state.tr.setSelection(
          new TextSelection(view.state.doc.resolve(nextPos)),
        ),
      );
      const { tableNode } = getPluginState(view.state);
      expect(tableNode).toBeDefined();
      expect(tableNode!.type.name).toEqual('table');
    });
    it('should update targetCellPosition when document changes', () => {
      const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))));
      const { state, dispatch } = editorView;
      setEditorFocus(true)(state, dispatch);
      let pluginState = getPluginState(editorView.state);
      expect(pluginState.targetCellPosition).toEqual(2);

      let documentChangeTr = editorView.state.tr.insertText('hello world', 1);
      // Don't use dispatch to mimic collab provider
      editorView.updateState(editorView.state.apply(documentChangeTr));

      pluginState = getPluginState(editorView.state);
      expect(pluginState.targetCellPosition).toEqual(23);
    });
  });
});
