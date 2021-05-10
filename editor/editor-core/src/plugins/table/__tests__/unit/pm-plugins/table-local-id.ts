import { selectTable } from '@atlaskit/editor-tables/utils';
import { TextSelection } from 'prosemirror-state';
// @ts-ignore
import { __serializeForClipboard } from 'prosemirror-view';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { handleCut } from '../../../event-handlers';

import {
  doc,
  p,
  table,
  tr,
  td,
  th,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  TablePluginState,
  PluginConfig,
} from '../../../../../plugins/table/types';
import { pluginKey as tablePluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';
import { CellSelection } from '@atlaskit/editor-tables';

const mockUuidGenerated = 'a-mock-uuid';
const mockUuidGenerate = jest.fn().mockReturnValue(mockUuidGenerated);

jest.mock('@atlaskit/adf-schema', () => ({
  ...jest.requireActual<Object>('@atlaskit/adf-schema'),
  uuid: {
    generate: () => mockUuidGenerate(),
  },
}));

describe('table local id plugin', () => {
  // Won't use `createProsemirrorEditorFactory` here, to also cover editorprops
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder) => {
    const tableOptions = {
      allowNumberColumn: true,
      allowHeaderRow: true,
      allowHeaderColumn: true,
      allowBackgroundColor: true,
      permittedLayouts: 'all',
    } as PluginConfig;
    return createEditor({
      doc,
      editorProps: {
        allowReferentiality: true,
        allowTables: tableOptions,
      },
      pluginKey: tablePluginKey,
    });
  };

  const generateTableWithLocalId = (localId: string) =>
    table({ localId: localId })(
      tr(th()(p('1')), th()(p('2')), th()(p('3'))),
      tr(td()(p('4')), td()(p('5')), td()(p('6'))),
      tr(td()(p('7')), td()(p('8')), td()(p('9'))),
    );

  describe('Table localId duplication plugin', () => {
    describe('basic editing of a table', () => {
      it('should NOT touch/overwrite localIds if inserting text inside a table', () => {
        const localIdString = 'mochi-is-fluffy';
        const localIdString2 = 'neko-is-hungry';
        const { editorView, sel } = editor(
          doc(
            table({ localId: localIdString })(tr(th()(p('{<>}1')))),
            table({ localId: localIdString2 })(tr(th()(p('2')))),
            p(''),
          ),
        );
        let { state } = editorView;
        editorView.updateState(state);
        insertText(editorView, 'feed the cats', sel);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: localIdString })(tr(th()(p('feed the cats1')))),
            table({ localId: localIdString2 })(tr(th()(p('2')))),
            p(''),
          ),
        );
      });
    });
    describe('basic copy paste', () => {
      it('generates a new ID when encountering a duplicate', () => {
        const flooFirst = 'floo-the-first';
        mockUuidGenerate.mockReturnValueOnce(flooFirst);
        const localIdString = 'mochi-is-fluffy';
        const {
          editorView,
          refs: { paragraphPos },
        } = editor(
          doc(
            table({ localId: localIdString })(tr(th()(p('{<>}1')))),
            p('{paragraphPos}'),
          ),
        );

        let { state } = editorView;
        // select table
        state = state.apply(selectTable(state.tr));

        // copy table
        const { dom, text } = __serializeForClipboard(
          editorView,
          state.selection.content(),
        );

        // move to paragraph
        const $paraPos = state.doc.resolve(paragraphPos);
        state = state.apply(
          state.tr.setSelection(new TextSelection($paraPos, $paraPos)),
        );

        editorView.updateState(state);

        dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: localIdString })(tr(th()(p('1')))),
            table({ localId: flooFirst })(tr(th()(p('1')))),
          ),
        );
      });
    });
    describe('cut & multiple pastes', () => {
      it('generates a new ID when pasting a table with an existing ID', () => {
        const flooFirst = 'floo-the-first';
        const flooSecond = 'floo-the-second';
        mockUuidGenerate
          .mockReturnValueOnce(flooFirst)
          .mockReturnValueOnce(flooSecond);

        const localIdString = 'mochi-is-fluffy';
        const {
          editorView,
          refs: { from, to },
        } = editor(
          doc(
            table({ localId: localIdString })(
              tr(th()(p('{from}1')), th()(p('2')), th()(p('3'))),
              tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              tr(td()(p('7')), td()(p('8')), td()(p('{to}9'))),
            ),
            p('{paragraphPos}'),
          ),
        );

        let { state } = editorView;
        // select table
        const sel = new CellSelection(
          state.doc.resolve(from - 2),
          state.doc.resolve(to - 2),
        );
        editorView.dispatch(state.tr.setSelection(sel as any));

        // "copy" table
        const { dom, text } = __serializeForClipboard(
          editorView,
          sel.content(),
        );
        const oldState = editorView.state;
        const newTr = handleCut(oldState.tr, oldState, editorView.state);

        // Ensure table is "cut"/removed
        expect(newTr.doc).toEqualDocument(doc(p('')));
        editorView.dispatch(newTr);

        // Paste it & ensure we retain the same ID
        dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(generateTableWithLocalId(localIdString)),
        );

        /** Paste twice, observe for two new generated IDs */
        let state2 = editorView.state;
        const endOfDoc2 = state2.doc.resolve(state2.doc.nodeSize - 2);
        // Move cursor to end of doc, to avoid pasting more cells into existing table
        state2 = state2.apply(
          state2.tr.setSelection(new TextSelection(endOfDoc2)),
        );
        editorView.updateState(state2);
        dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });

        // Second paste
        let state3 = editorView.state;
        const endOfDoc3 = state3.doc.resolve(state3.doc.nodeSize - 2);
        // Move cursor to end of doc, to avoid pasting more cells into existing table
        state3 = state3.apply(
          state3.tr.setSelection(new TextSelection(endOfDoc3)),
        );
        editorView.updateState(state3);
        dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            generateTableWithLocalId(localIdString),
            generateTableWithLocalId(flooFirst),
            generateTableWithLocalId(flooSecond),
          ),
        );
      });
    });
  });
});
