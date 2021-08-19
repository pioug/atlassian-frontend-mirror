import { selectTable } from '@atlaskit/editor-tables/utils';
import { TextSelection, NodeSelection } from 'prosemirror-state';
// @ts-ignore
import { __serializeForClipboard } from 'prosemirror-view';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { replaceRaf } from 'raf-stub';

import { handleCut } from '../../../event-handlers';

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
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  TablePluginState,
  PluginConfig,
} from '../../../../../plugins/table/types';
import { pluginKey as tablePluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';
import { CellSelection } from '@atlaskit/editor-tables';

import { uuid } from '@atlaskit/adf-schema';

replaceRaf();
const requestAnimationFrame = window.requestAnimationFrame as any;

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

  const editor = (
    doc: DocBuilder,
    options: {
      skipRefs: boolean;
      defaultValue: any;
    } = {
      skipRefs: false,
      defaultValue: undefined,
    },
  ) => {
    const { skipRefs, defaultValue } = options;
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
        allowExpand: true,
        allowLayouts: true,
        allowTables: tableOptions,
        defaultValue,
      },
      pluginKey: tablePluginKey,
      skipRefs,
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

  describe('Table localId duplication plugin', () => {
    describe('table initialisation', () => {
      it('should generate IDs on multiple tables without IDs', () => {
        const spy = jest
          .spyOn(uuid, 'generate')
          .mockReturnValueOnce(flooFirst)
          .mockReturnValueOnce(flooSecond);
        /**
         * We need to feed in a defaultValue here and skip the ref logic in
         * createEditor as that setSelection fires off some transaction
         * which inadvertently triggers our usual "a table is added" checks.
         *
         * We want to check that this flow can happen:
         * 1. load document with pre-existing non-local-id table
         * 2. immediately use it for charts (without adding a new table to
         * trigger our "check all table IDs" logic in appendTransaction)
         */

        const tableAsDefaultValue = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'table',
              attrs: {
                isNumberColumnEnabled: false,
                layout: 'default',
                localId: undefined,
              },
              content: [
                {
                  type: 'tableRow',
                  content: [
                    {
                      type: 'tableHeader',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: '1',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'table',
              attrs: {
                isNumberColumnEnabled: false,
                layout: 'default',
                localId: undefined,
              },
              content: [
                {
                  type: 'tableRow',
                  content: [
                    {
                      type: 'tableHeader',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: '1',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'paragraph',
              content: [],
            },
          ],
        };
        const { editorView } = editor(doc(), {
          skipRefs: true,
          defaultValue: tableAsDefaultValue,
        });
        // Ensure we actually initialised with no ID
        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: '' })(tr(th()(p('1')))),
            table({ localId: '' })(tr(th()(p('1')))),
            p(''),
          ),
        );
        expect(spy).toBeCalledTimes(0);

        // Check we add IDs for existing tables
        let { state } = editorView;
        editorView.updateState(state);
        requestAnimationFrame.step();
        /**
         * This one is really only needed if we use the "remove the
         * `checkIsAddingTable` solution". But who doesn't want to feed the cats
         */
        insertText(editorView, 'feed the cats', state.doc.nodeSize - 3);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: flooFirst })(tr(th()(p('1')))),
            table({ localId: flooSecond })(tr(th()(p('1')))),
            p('feed the cats'),
          ),
        );
        expect(spy).toBeCalledTimes(2);
      });
    });
    describe('basic editing of a table', () => {
      it('should NOT touch/overwrite localIds if inserting text inside a table', () => {
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
        const spy = jest.spyOn(uuid, 'generate').mockReturnValueOnce(flooFirst);
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
        expect(spy).toBeCalledTimes(1);
      });
    });
    describe('cut & multiple pastes', () => {
      it('detects duplicates inside expand & tables', () => {
        const spy = jest
          .spyOn(uuid, 'generate')
          .mockReturnValueOnce(flooSecond)
          .mockReturnValueOnce(flooThird);

        const {
          editorView,
          refs: { from, to, insideExpandPos, insideLayoutPos },
        } = editor(
          doc(
            expand({ title: '' })(p('{insideExpandPos}')),
            layoutSection(
              layoutColumn({ width: 50 })(
                table({ localId: flooFirst })(
                  tr(th()(p('{from}1')), th()(p('2')), th()(p('3'))),
                  tr(td()(p('4')), td()(p('5')), td()(p('6'))),
                  tr(td()(p('7')), td()(p('8')), td()(p('{to}9'))),
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
              layoutColumn({ width: 50 })(generateTableWithLocalId(flooFirst)),
              layoutColumn({ width: 50 })(generateTableWithLocalId(flooSecond)),
            ),
            p(),
          ),
        );
        expect(spy).toBeCalledTimes(1);

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
            expand({ title: '' })(generateTableWithLocalId(flooFirst)),
            layoutSection(
              layoutColumn({ width: 50 })(generateTableWithLocalId(flooThird)),
              layoutColumn({ width: 50 })(generateTableWithLocalId(flooSecond)),
            ),
            p(),
          ),
        );
        expect(spy).toBeCalledTimes(2);
      });
      it('generates a new ID when pasting a table with an existing ID', () => {
        const spy = jest
          .spyOn(uuid, 'generate')
          .mockReturnValueOnce(flooFirst)
          .mockReturnValueOnce(flooSecond);

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
        expect(spy).toBeCalledTimes(2);
      });
      it('_retains_ IDs when pasting the same table IDs over existing IDs', () => {
        const spy = jest
          .spyOn(uuid, 'generate')
          .mockReturnValueOnce(flooFirst)
          .mockReturnValueOnce(flooSecond);

        const localIdString = 'mochi-is-fluffy';
        const { editorView } = editor(
          doc(
            table({ localId: localIdString })(
              tr(th()(p('1')), th()(p('2')), th()(p('3'))),
              tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              tr(td()(p('7')), td()(p('8')), td()(p('9'))),
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
          doc(generateTableWithLocalId(localIdString), p('')),
        );
        expect(spy).not.toBeCalled();
      });
    });
  });
});
