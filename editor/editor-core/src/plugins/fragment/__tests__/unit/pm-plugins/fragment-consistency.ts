import { selectTable } from '@atlaskit/editor-tables/utils';
import { TextSelection, NodeSelection } from 'prosemirror-state';
// @ts-expect-error We're importing internals, of course we expect an error
import { __serializeForClipboard } from 'prosemirror-view';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { replaceRaf } from 'raf-stub';

// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { handleCut } from '@atlaskit/editor-plugin-table/src/plugins/table/event-handlers';

import fragmentMarkPlugin from '../../../index';
import { pluginKey as fragmentMarkPluginKey } from '../../../plugin-key';

import {
  doc,
  p,
  expand,
  layoutColumn,
  layoutSection,
  table,
  tr,
  td,
  th,
  fragmentMark,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { CellSelection } from '@atlaskit/editor-tables';

import { uuid } from '@atlaskit/adf-schema';

import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import extensionPlugin from '../../../../extension';
import layoutPlugin from '../../../../layout';
import expandPlugin from '../../../../expand';
import panelPlugin from '../../../../panel';

replaceRaf();

const mockUuidGenerated = 'a-mock-uuid';
const mockUuidGenerate = jest.fn().mockReturnValue(mockUuidGenerated);

jest.mock('@atlaskit/adf-schema', () => ({
  ...jest.requireActual<Object>('@atlaskit/adf-schema'),
  uuid: {
    generate: () => mockUuidGenerate(),
  },
}));

describe('fragment mark consistency plugin', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>();
    preset.add(fragmentMarkPlugin);
    preset.add([tablesPlugin, { tableOptions: {} }]);
    preset.add(extensionPlugin);
    preset.add(layoutPlugin);
    preset.add(expandPlugin);
    preset.add(panelPlugin);

    return createEditor({
      doc,
      preset,
      pluginKey: fragmentMarkPluginKey,
    });
  };

  const localIdString = 'mochi-is-fluffy';
  const localIdString2 = 'neko-is-hungry';
  const flooFirst = 'floo-the-first';
  const flooSecond = 'floo-the-second';
  const flooThird = 'floo-the-third';

  const generateTableWithLocalId = (localId: string) =>
    table({ localId: localId })(
      tr(th()(p('1')), th()(p('2')), th()(p('3'))),
      tr(td()(p('4')), td()(p('5')), td()(p('6'))),
      tr(td()(p('7')), td()(p('8')), td()(p('9'))),
    );

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('localId duplication', () => {
    describe('basic editing of a table', () => {
      it('should NOT touch/overwrite localIds if inserting text inside a table', () => {
        const { editorView, sel } = editor(
          doc(
            fragmentMark({ localId: localIdString })(
              table({ localId: localIdString2 })(tr(th()(p('{<>}1')))),
            ),
          ),
        );
        let { state } = editorView;
        editorView.updateState(state);
        insertText(editorView, 'feed the cats', sel);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            fragmentMark({ localId: localIdString })(
              table({ localId: localIdString2 })(tr(th()(p('feed the cats1')))),
            ),
          ),
        );
      });
    });
    describe('basic copy paste', () => {
      it('generates a new local id for fragment mark when encountering a duplicate', () => {
        jest.spyOn(uuid, 'generate').mockReturnValueOnce(flooFirst);
        const {
          editorView,
          refs: { paragraphPos },
        } = editor(
          doc(
            fragmentMark({ localId: localIdString })(
              table({ localId: mockUuidGenerated })(tr(th()(p('{<>}1')))),
            ),
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
            fragmentMark({ localId: localIdString })(
              table({ localId: mockUuidGenerated })(tr(th()(p('1')))),
            ),
            fragmentMark({ localId: flooFirst })(
              table({ localId: mockUuidGenerated })(tr(th()(p('1')))),
            ),
          ),
        );
      });
    });
    describe('cut & multiple pastes', () => {
      it('detects duplicates inside expand & tables', () => {
        jest.spyOn(uuid, 'generate').mockReturnValueOnce(flooSecond);

        const {
          editorView,
          refs: { from, to, insideExpandPos, insideLayoutPos },
        } = editor(
          doc(
            expand({ title: '' })(p('{insideExpandPos}')),
            layoutSection(
              layoutColumn({ width: 50 })(
                fragmentMark({ localId: flooFirst })(
                  table({ localId: mockUuidGenerated })(
                    tr(th()(p('{from}1')), th()(p('2')), th()(p('3'))),
                    tr(td()(p('4')), td()(p('5')), td()(p('6'))),
                    tr(td()(p('7')), td()(p('8')), td()(p('{to}9'))),
                  ),
                ),
              ),
              layoutColumn({ width: 50 })(p('{insideLayoutPos}')),
            ),
            p(''),
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
        let state2 = editorView.state;
        const insideLayout = state2.doc.resolve(insideLayoutPos);
        // Move cursor inside layout
        state2 = state2.apply(
          state2.tr.setSelection(new TextSelection(insideLayout)),
        );
        editorView.updateState(state2);

        // paste into layout, expect new ID
        dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            expand({ title: '' })(p('')),
            layoutSection(
              layoutColumn({ width: 50 })(
                fragmentMark({ localId: flooFirst })(
                  generateTableWithLocalId(mockUuidGenerated),
                ),
              ),
              layoutColumn({ width: 50 })(
                fragmentMark({ localId: flooSecond })(
                  generateTableWithLocalId(mockUuidGenerated),
                ),
              ),
            ),
            p(),
          ),
        );

        jest.spyOn(uuid, 'generate').mockReturnValueOnce(flooThird);

        let state3 = editorView.state;
        const insideExpand = state3.doc.resolve(insideExpandPos);
        // Move cursor inside layout
        state3 = state3.apply(
          state3.tr.setSelection(new TextSelection(insideExpand)),
        );
        editorView.updateState(state3);
        dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });

        /**
         * The end result order of IDs that we'll now observe is the following:
         *  1. flooFirst
         *  2. flooThird
         *  3. flooSecond
         *
         * This is because we had `flooFirst` in our clipboard. We've now pasted
         * it into the expand, so that becomes the first observed instance of
         * the table. The "third" ID (second unique regeneration) then gets
         * replaced in the first layout column.
         *
         */
        expect(editorView.state.doc).toEqualDocument(
          doc(
            expand({ title: '' })(
              fragmentMark({ localId: flooFirst })(
                generateTableWithLocalId(mockUuidGenerated),
              ),
            ),
            layoutSection(
              layoutColumn({ width: 50 })(
                fragmentMark({ localId: flooThird })(
                  generateTableWithLocalId(mockUuidGenerated),
                ),
              ),
              layoutColumn({ width: 50 })(
                fragmentMark({ localId: flooSecond })(
                  generateTableWithLocalId(mockUuidGenerated),
                ),
              ),
            ),
            p(),
          ),
        );
      });
      it('generates a new ID when pasting a table with an existing ID', () => {
        const {
          editorView,
          refs: { from, to },
        } = editor(
          doc(
            fragmentMark({ localId: localIdString })(
              table({ localId: mockUuidGenerated })(
                tr(th()(p('{from}1')), th()(p('2')), th()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
                tr(td()(p('7')), td()(p('8')), td()(p('{to}9'))),
              ),
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
          doc(
            fragmentMark({ localId: localIdString })(
              generateTableWithLocalId(mockUuidGenerated),
            ),
          ),
        );

        /** Paste twice, observe for two new generated IDs */
        jest.spyOn(uuid, 'generate').mockReturnValueOnce(flooFirst);
        let state2 = editorView.state;
        const endOfDoc2 = state2.doc.resolve(state2.doc.nodeSize - 2);
        // Move cursor to end of doc, to avoid pasting more cells into existing table
        state2 = state2.apply(
          state2.tr.setSelection(new TextSelection(endOfDoc2)),
        );
        editorView.updateState(state2);
        dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });

        // Second paste
        jest.spyOn(uuid, 'generate').mockReturnValueOnce(flooSecond);
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
            fragmentMark({ localId: localIdString })(
              generateTableWithLocalId(mockUuidGenerated),
            ),
            fragmentMark({ localId: flooFirst })(
              generateTableWithLocalId(mockUuidGenerated),
            ),
            fragmentMark({ localId: flooSecond })(
              generateTableWithLocalId(mockUuidGenerated),
            ),
          ),
        );
      });
      it('_retains_ IDs when pasting the same fragment IDs over existing IDs', () => {
        const localIdString = 'mochi-is-fluffy';
        const { editorView } = editor(
          doc(
            fragmentMark({ localId: localIdString })(
              table({ localId: mockUuidGenerated })(
                tr(th()(p('1')), th()(p('2')), th()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
                tr(td()(p('7')), td()(p('8')), td()(p('9'))),
              ),
            ),
            p(''),
          ),
        );

        let { state } = editorView;
        // select doc
        const sel = NodeSelection.create(state.doc, 0);
        editorView.dispatch(state.tr.setSelection(sel));

        // "copy" entire doc
        const { dom, text } = __serializeForClipboard(
          editorView,
          sel.content(),
        );

        // Paste it & ensure we retain the same ID
        dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            fragmentMark({ localId: localIdString })(
              generateTableWithLocalId(mockUuidGenerated),
            ),
            p(''),
          ),
        );
      });
    });
  });
});
