import { uuid } from '@atlaskit/adf-schema';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import selectionPlugin from '@atlaskit/editor-core/src/plugins/selection';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { isRowSelected } from '@atlaskit/editor-tables/utils';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  panelNote,
  table,
  td,
  tdCursor,
  tdEmpty,
  th,
  thCursor,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../plugins/table';
import {
  addBoldInEmptyHeaderCells,
  selectColumn,
  selectRow,
  setEditorFocus,
  setMultipleCellAttrs,
  setTableRef,
  toggleContextualMenu,
  toggleHeaderColumn,
  toggleHeaderRow,
  transformSliceToAddTableHeaders,
} from '../../plugins/table/commands';
import { splitCell } from '../../plugins/table/commands/split-cell';
import { handleCut } from '../../plugins/table/event-handlers';
import { getPluginState } from '../../plugins/table/pm-plugins/plugin-factory';
import { pluginKey } from '../../plugins/table/pm-plugins/plugin-key';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('table plugin: actions', () => {
  beforeAll(() => {
    uuid.setStatic(TABLE_LOCAL_ID);
  });

  afterAll(() => {
    uuid.setStatic(false);
  });

  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      attachTo: document.body,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(decorationsPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add(gridPlugin)
        .add(selectionPlugin)
        .add(tablePlugin),
      pluginKey,
    });

  describe('transformSliceToAddTableHeaders', () => {
    const textNode = defaultSchema.text('hello', undefined);
    const paragraphNode = defaultSchema.nodes.paragraph.createChecked(
      undefined,
      defaultSchema.text('within paragraph', [
        defaultSchema.marks.strong.create(),
      ]),
      undefined,
    );
    const ruleNode = defaultSchema.nodes.rule.createChecked();

    const tableBody = tr(
      td({ colwidth: [300] })(p('r4')),
      td()(p('r5')),
      td()(panelNote(p('r6'))),
    );

    it('handles an empty fragment', () => {
      const slice = new Slice(Fragment.from(undefined), 0, 0);
      expect(
        transformSliceToAddTableHeaders(slice, defaultSchema).eq(slice),
      ).toBe(true);
    });

    it('does nothing to a text fragment', () => {
      const slice = new Slice(Fragment.from(textNode), 0, 0);
      expect(
        transformSliceToAddTableHeaders(slice, defaultSchema).eq(slice),
      ).toBe(true);
    });

    it('does nothing to fragment with multiple non-table nodes', () => {
      const slice = new Slice(
        Fragment.from([textNode, ruleNode, paragraphNode]),
        1,
        0,
      );

      expect(
        transformSliceToAddTableHeaders(slice, defaultSchema).eq(slice),
      ).toBe(true);
    });

    it('transforms only the table within the slice', () => {
      const preTable = table({
        isNumberColumnEnabled: true,
        localId: TABLE_LOCAL_ID,
      })(
        tr(
          td()(p('r1')),
          th({ colspan: 2 })(p('r2')),
          td()(panelNote(p('r3'))),
        ),

        tableBody,
      );

      const postTable = table({
        isNumberColumnEnabled: true,
        localId: TABLE_LOCAL_ID,
      })(
        tr(
          th()(p('r1')),
          th({ colspan: 2 })(p('r2')),
          th()(panelNote(p('r3'))),
        ),

        tableBody,
      );

      const preSlice = new Slice(
        Fragment.from([textNode, preTable(defaultSchema), paragraphNode]),
        1,
        0,
      );

      const postSlice = new Slice(
        Fragment.from([textNode, postTable(defaultSchema), paragraphNode]),
        1,
        0,
      );

      expect(
        transformSliceToAddTableHeaders(preSlice, defaultSchema).eq(postSlice),
      ).toBe(true);
    });

    it('transforms any table within the slice', () => {
      const preTableA = table({
        isNumberColumnEnabled: true,
        localId: TABLE_LOCAL_ID,
      })(
        tr(
          td()(p('r1')),
          th({ colspan: 2 })(p('r2')),
          td()(panelNote(p('r3'))),
        ),

        tableBody,
      );

      const postTableA = table({
        isNumberColumnEnabled: true,
        localId: TABLE_LOCAL_ID,
      })(
        tr(
          th()(p('r1')),
          th({ colspan: 2 })(p('r2')),
          th()(panelNote(p('r3'))),
        ),

        tableBody,
      );

      const preTableB = table({
        isNumberColumnEnabled: true,
        localId: TABLE_LOCAL_ID,
      })(
        tr(td()(p('b1')), th()(p('b2')), th()(p('b3'))),

        tableBody,
      );

      const postTableB = table({
        isNumberColumnEnabled: true,
        localId: TABLE_LOCAL_ID,
      })(
        tr(th()(p('b1')), th()(p('b2')), th()(p('b3'))),

        tableBody,
      );

      const preSlice = new Slice(
        Fragment.from([
          textNode,
          preTableA(defaultSchema),
          paragraphNode,
          preTableB(defaultSchema),
        ]),
        1,
        0,
      );

      const postSlice = new Slice(
        Fragment.from([
          textNode,
          postTableA(defaultSchema),
          paragraphNode,
          postTableB(defaultSchema),
        ]),
        1,
        0,
      );

      expect(
        transformSliceToAddTableHeaders(preSlice, defaultSchema).eq(postSlice),
      ).toBe(true);
    });
  });

  describe('#setMultipleCellAttrs', () => {
    it('should set selected cell attributes', () => {
      const { editorView } = editor(
        doc(
          p('text'),
          table()(
            tr(td()(p('c1')), td()(p('c2'))),
            tr(td()(p('c3')), td()(p('c4'))),
          ),
        ),
      );
      const { state, dispatch } = editorView;
      selectColumn(0)(state, dispatch);
      setMultipleCellAttrs({ background: 'purple' }, 0)(
        editorView.state,
        dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          table({ localId: TABLE_LOCAL_ID })(
            tr(td({ background: 'purple' })(p('c1')), td()(p('c2'))),
            tr(td({ background: 'purple' })(p('c3')), td()(p('c4'))),
          ),
        ),
      );
    });
  });

  describe('#toggleContextualMenu', () => {
    it('should update isContextualMenuOpen in plugin state', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdEmpty, tdEmpty))),
      );
      const { state, dispatch } = editorView;
      toggleContextualMenu()(state, dispatch);
      const { isContextualMenuOpen } = getPluginState(editorView.state);
      expect(isContextualMenuOpen).toBe(true);
    });
  });

  describe('#setEditorFocus', () => {
    it('should update editorHasFocus in plugin state', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdEmpty, tdEmpty))),
      );
      const { state, dispatch } = editorView;
      setEditorFocus(true)(state, dispatch);
      const { editorHasFocus } = getPluginState(editorView.state);
      expect(editorHasFocus).toBe(true);
    });
  });

  describe('#setTableRef', () => {
    it('should update tableRef and tableNode in plugin state', () => {
      const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))));
      const { state, dispatch } = editorView;
      const tableRef = document.querySelector(
        '.ProseMirror table',
      ) as HTMLTableElement;
      setEditorFocus(true)(state, dispatch);
      setTableRef(tableRef)(editorView.state, dispatch);
      const pluginState = getPluginState(editorView.state);
      expect(pluginState.tableRef).toEqual(tableRef);
      expect(pluginState.tableNode).toEqual(editorView.state.doc.firstChild!);
    });
  });

  describe('#selectRow', () => {
    it('should select a row and set targetCellPosition to point to the first cell', () => {
      const { editorView } = editor(doc(table()(tr(tdEmpty), tr(tdEmpty))));
      const { state, dispatch } = editorView;
      selectRow(1)(state, dispatch);
      const pluginState = getPluginState(editorView.state);
      expect(pluginState.targetCellPosition).toEqual(8);
      expect(isRowSelected(1)(editorView.state.selection));
    });
  });

  describe('#handleCut', () => {
    const editorAnalyticsAPIFake: EditorAnalyticsAPI = {
      attachAnalyticsEvent: jest.fn().mockReturnValue(() => jest.fn()),
    };
    describe('when the entire table is selected', () => {
      it('should remove the table', () => {
        const { editorView, refs } = editor(
          doc(
            table()(
              tr(
                td()(p('{from}a1')),
                td()(p('a2')),
                td()(p('a3')),
                td()(p('{cursorPos}a4')),
              ),
              tr(
                td()(p('b1')),
                td()(p('b2')),
                td()(p('b3')),
                td()(p('{to}b4')),
              ),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        const sel = new CellSelection(
          state.doc.resolve(refs.from - 2),
          state.doc.resolve(refs.to - 2),
        );
        dispatch(state.tr.setSelection(sel as any));
        const oldState = editorView.state;
        dispatch(
          oldState.tr.setSelection(
            new TextSelection(oldState.doc.resolve(refs.cursorPos)),
          ),
        );
        const newTr = handleCut(
          oldState.tr,
          oldState,
          editorView.state,
          editorAnalyticsAPIFake,
        );
        expect(
          editorAnalyticsAPIFake.attachAnalyticsEvent,
        ).toHaveBeenCalledWith({
          action: 'cut',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: {
            horizontalCells: 4,
            totalCells: 8,
            totalColumnCount: 4,
            totalRowCount: 2,
            verticalCells: 2,
          },
          eventType: 'track',
        });
        expect(newTr.doc).toEqualDocument(doc(p('')));
      });
    });

    describe('when selected columns are cut', () => {
      it('should remove those columns', () => {
        const { editorView, refs } = editor(
          doc(
            table()(
              tr(
                td()(p('a1')),
                td()(p('{from}a2')),
                td()(p('a3')),
                td()(p('{cursorPos}a4')),
              ),
              tr(
                td()(p('b1')),
                td()(p('b2')),
                td()(p('{to}b3')),
                td()(p('b4')),
              ),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        // selecting 2 and 3 columns
        const sel = new CellSelection(
          state.doc.resolve(refs.from - 2),
          state.doc.resolve(refs.to - 2),
        );
        dispatch(state.tr.setSelection(sel as any));
        const oldState = editorView.state;
        // re-setting selection to a text selection
        // this is what happens when we let PM handle cut so that it saves content to a clipboard
        dispatch(
          oldState.tr.setSelection(
            new TextSelection(oldState.doc.resolve(refs.cursorPos)),
          ),
        );
        const newTr = handleCut(
          oldState.tr,
          oldState,
          editorView.state,
          editorAnalyticsAPIFake,
        );
        expect(
          editorAnalyticsAPIFake.attachAnalyticsEvent,
        ).toHaveBeenCalledWith({
          action: 'cut',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: {
            horizontalCells: 4,
            totalCells: 8,
            totalColumnCount: 4,
            totalRowCount: 2,
            verticalCells: 2,
          },
          eventType: 'track',
        });
        expect(newTr.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td()(p('a1')), td()(p('a4'))),
              tr(td()(p('b1')), td()(p('b4'))),
            ),
          ),
        );
      });
    });

    describe('when selected rows are cut', () => {
      it('should remove those rows', () => {
        const { editorView, refs } = editor(
          doc(
            table()(
              tr(td()(p('a1')), td()(p('a2')), td()(p('a3'))),
              tr(td()(p('{from}b1')), td()(p('b2')), td()(p('b3'))),
              tr(td()(p('c1')), td()(p('c2')), td()(p('{to}c3'))),
              tr(td()(p('{cursorPos}d1')), td()(p('d2')), td()(p('d3'))),
            ),
          ),
        );
        const { state, dispatch } = editorView;
        // selecting 2 and 3 rows
        const sel = new CellSelection(
          state.doc.resolve(refs.from - 2),
          state.doc.resolve(refs.to - 2),
        );
        dispatch(state.tr.setSelection(sel as any));
        const oldState = editorView.state;
        // re-setting selection to a text selection
        // this is what happens when we let PM handle cut so that it saves content to a clipboard
        dispatch(
          oldState.tr.setSelection(
            new TextSelection(oldState.doc.resolve(refs.cursorPos)),
          ),
        );
        const newTr = handleCut(
          oldState.tr,
          oldState,
          editorView.state,
          editorAnalyticsAPIFake,
        );
        expect(
          editorAnalyticsAPIFake.attachAnalyticsEvent,
        ).toHaveBeenCalledWith({
          action: 'cut',
          actionSubject: 'table',
          actionSubjectId: null,
          attributes: {
            horizontalCells: 4,
            totalCells: 8,
            totalColumnCount: 4,
            totalRowCount: 2,
            verticalCells: 2,
          },
          eventType: 'track',
        });
        expect(newTr.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td()(p('a1')), td()(p('a2')), td()(p('a3'))),
              tr(td()(p('d1')), td()(p('d2')), td()(p('d3'))),
            ),
          ),
        );
      });
    });
  });

  describe('#toggleHeaderColumn', () => {
    let editorView: EditorView;
    const tableDoc = doc(
      table({ localId: TABLE_LOCAL_ID })(
        tr(td()(p('c1')), td()(p('c2'))),
        tr(td({ rowspan: 2 })(p('c3')), td()(p('c4'))),
        tr(td()(p('c6'))),
        tr(td()(p('c7')), td()(p('c8'))),
      ),
    );
    beforeEach(() => {
      ({ editorView } = editor(tableDoc));
      const { state, dispatch } = editorView;
      toggleHeaderColumn(state, dispatch);
    });

    it('should convert all cells including rowspans to table headers', () => {
      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(th()(p('c1')), td()(p('c2'))),
            tr(th({ rowspan: 2 })(p('c3')), td()(p('c4'))),
            tr(td()(p('c6'))),
            tr(th()(p('c7')), td()(p('c8'))),
          ),
        ),
      );
    });

    it('should isHeaderColumnEnabled be true', () => {
      const tableState = getPluginState(editorView.state);

      expect(tableState.isHeaderColumnEnabled).toBe(true);
    });
    describe('Toggle header columns again', () => {
      beforeEach(() => {
        const { state, dispatch } = editorView;
        toggleHeaderColumn(state, dispatch);
      });

      it('should convert all cells including rowspan back to the original document', () => {
        expect(editorView.state.doc).toEqualDocument(tableDoc);
      });

      it('should isHeaderColumnEnabled be false', () => {
        const tableState = getPluginState(editorView.state);
        expect(tableState.isHeaderColumnEnabled).toBe(false);
      });
    });
  });

  describe('#toggleHeaderRow', () => {
    let editorView: EditorView;
    const tableDoc = doc(
      table({ localId: TABLE_LOCAL_ID })(
        tr(th()(p('c1')), th()(p('c2'))),
        tr(td({ rowspan: 2 })(p('c3')), td()(p('c4'))),
        tr(td()(p('c6'))),
        tr(td()(p('c7')), td()(p('c8'))),
      ),
    );
    beforeEach(() => {
      ({ editorView } = editor(tableDoc));
      const { state, dispatch } = editorView;
      toggleHeaderRow(state, dispatch);
    });

    it('should convert all rows including to table normal', () => {
      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(td()(p('c1')), td()(p('c2'))),
            tr(td({ rowspan: 2 })(p('c3')), td()(p('c4'))),
            tr(td()(p('c6'))),
            tr(td()(p('c7')), td()(p('c8'))),
          ),
        ),
      );
    });

    it('should isHeaderRowEnabled be false', () => {
      const tableState = getPluginState(editorView.state);
      expect(tableState.isHeaderRowEnabled).toBe(false);
    });

    describe('Toggle header rows again', () => {
      beforeEach(() => {
        const { state, dispatch } = editorView;
        toggleHeaderRow(state, dispatch);
      });

      it('should convert all rows back to the original document', () => {
        expect(editorView.state.doc).toEqualDocument(tableDoc);
      });

      it('should isHeaderRowEnabled be false', () => {
        const tableState = getPluginState(editorView.state);
        expect(tableState.isHeaderRowEnabled).toBe(true);
      });
    });
  });

  describe('#toggleBoldOnHeaderCells', () => {
    describe('when there is no cursor', () => {
      it('should not add a strong mark on storedMarks', function () {
        const { editorView } = editor(
          doc(table()(tr(th()(p('{<}foo bar{>}'))), tr(td()(p(''))))),
        );

        const { state, dispatch } = editorView;

        const tableCellHeader = findParentNodeOfType(
          state.schema.nodes.tableHeader,
        )(state.selection);

        addBoldInEmptyHeaderCells(tableCellHeader!)(state, dispatch);

        const result = editorView.state.storedMarks || [];
        expect(result).toEqual([]);
      });
    });
    describe('when the cursor is on table header cell', () => {
      describe('and the cell is empty', () => {
        describe('and the user removed the strong mark', () => {
          it('should not add strong mark on storedMarks', () => {
            const { editorView } = editor(
              doc(table()(tr(thCursor), tr(td()(p(''))))),
            );
            const { state, dispatch } = editorView;

            const tableCellHeader = findParentNodeOfType(
              state.schema.nodes.tableHeader,
            )(state.selection);

            editorView.state.storedMarks = [];
            addBoldInEmptyHeaderCells(tableCellHeader!)(state, dispatch);

            const result = editorView.state.storedMarks || [];
            expect(result).toEqual([]);
          });
        });
      });

      describe('and the cell is not empty', () => {
        it('should not add strong mark on storedMarks', () => {
          const { editorView } = editor(
            doc(table()(tr(th()(p('Rato{<>}'))), tr(td()(p('Rato'))))),
          );
          const { state, dispatch } = editorView;
          expect(editorView.state.storedMarks).toBeNull();

          const tableCellHeader = findParentNodeOfType(
            state.schema.nodes.tableHeader,
          )(state.selection);

          addBoldInEmptyHeaderCells(tableCellHeader!)(state, dispatch);
          expect(editorView.state.storedMarks).toBeNull();
        });
      });
    });
  });

  describe('#splitCell', () => {
    /**
     * | th | th | th |
     *  ----      ----
     * | td |    | td |
     *
     * If header row is enabled should split into:
     *
     * | th | th | th |
     *  ---- ---- ----
     * | th | td | td |
     */
    it('should keep right column header and cells after split', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(th()(p('')), th({ rowspan: 2 })(p('foo{<>}')), th()(p(''))),
            tr(td()(p('')), td()(p(''))),
          ),
        ),
      );

      splitCell(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(th()(p('')), th()(p('foo')), th()(p(''))),
            tr(td()(p('')), td()(p('')), td()(p(''))),
          ),
        ),
      );
    });

    /**
     * | th | th | th |
     * |   th    | td |
     *
     * If header column is enabled should split into:
     *
     * | th | th | th |
     * | th | td | td |
     */
    it('should keep right row header and cells after split', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(th()(p('')), th()(p('')), th()(p(''))),
            tr(td({ colspan: 2 })(p('foo{<>}')), td()(p(''))),
          ),
        ),
      );
      toggleHeaderColumn(editorView.state, editorView.dispatch); // Activate header columns first

      splitCell(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(th()(p('')), th()(p('')), th()(p(''))),
            tr(th()(p('foo')), td()(p('')), td()(p(''))),
          ),
        ),
      );
    });
  });
});
