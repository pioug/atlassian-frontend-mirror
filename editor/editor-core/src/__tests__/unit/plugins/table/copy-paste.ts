import {
  getCellsInTable,
  selectColumn,
  selectTable,
} from '@atlaskit/editor-tables/utils';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { Node as ProsemirrorNode, Fragment, Slice } from 'prosemirror-model';
import { TextSelection, Transaction } from 'prosemirror-state';
// @ts-ignore
import { __serializeForClipboard } from 'prosemirror-view';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  doc,
  p,
  table,
  tr,
  td,
  th,
  code_block,
  br,
  expand,
  panel,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { uuid } from '@atlaskit/adf-schema';
import {
  TablePluginState,
  PluginConfig,
} from '../../../../plugins/table/types';
import {
  unwrapContentFromTable,
  removeTableFromFirstChild,
  removeTableFromLastChild,
  transformSliceToRemoveOpenTable,
  transformSliceToFixHardBreakProblemOnCopyFromCell,
} from '../../../../plugins/table/utils/paste';
import { pluginKey as tablePluginKey } from '../../../../plugins/table/pm-plugins/plugin-factory';
import { transformSliceToRemoveOpenExpand } from '../../../../plugins/expand/utils';

const TABLE_LOCAL_ID = 'test-table-local-id';
const array = (...args: any): Node[] => args.map((i: any) => i(defaultSchema));
const fragment = (...args: any) =>
  Fragment.from(args.map((i: any) => i(defaultSchema)));

const selectCell = (cell: {
  pos: number;
  start: number;
  node: ProsemirrorNode;
}) => (tr: Transaction) => {
  const $anchor = tr.doc.resolve(cell.pos);
  return tr.setSelection(new CellSelection($anchor, $anchor) as any);
};

describe('table plugin', () => {
  beforeAll(() => {
    uuid.setStatic(TABLE_LOCAL_ID);
  });

  afterAll(() => {
    uuid.setStatic(false);
  });
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
        allowTables: tableOptions,
      },
      pluginKey: tablePluginKey,
    });
  };

  describe('TableView', () => {
    describe('copy paste', () => {
      it('copies one cell onto another', () => {
        const { editorView } = editor(
          doc(
            table()(
              tr(th()(p('{<>}1')), th()(p('2')), th()(p('3'))),
              tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              tr(td()(p('7')), td()(p('8')), td()(p('9'))),
            ),
          ),
        );

        let { state } = editorView;

        // select first cell
        const cells = getCellsInTable(state.selection);
        expect(cells![0].node.textContent).toEqual('1');
        state = state.apply(selectCell(cells![0])(state.tr));

        // copy it
        const { dom, text } = __serializeForClipboard(
          editorView,
          state.selection.content(),
        );

        // select the destination cell, which is 8
        const targetCell = cells![cells!.length - 2];
        expect(targetCell.node.textContent).toEqual('8');
        state = state.apply(selectCell(targetCell)(state.tr));

        // apply local state to view before paste
        editorView.updateState(state);

        // paste the first cell over the top of it
        dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(th()(p('1')), th()(p('2')), th()(p('3'))),
              tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              tr(td()(p('7')), th()(p('1')), td()(p('9'))),
            ),
          ),
        );
      });

      it('copies one column onto another', () => {
        const {
          editorView,
          refs: { nextPos },
        } = editor(
          doc(
            table()(
              tr(th()(p('{<>}1')), th()(p('2')), th()(p('3{nextPos}'))),
              tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              tr(td()(p('7')), td()(p('8')), td()(p('9'))),
            ),
          ),
        );

        let { state } = editorView;

        // select second column
        state = state.apply(selectColumn(1)(state.tr));

        // copy it
        const { dom, text } = __serializeForClipboard(
          editorView,
          state.selection.content(),
        );

        // move cursor to the 3rd column
        const $pos = state.doc.resolve(nextPos);
        state = state.apply(
          state.tr.setSelection(new TextSelection($pos, $pos)),
        );

        // apply local state to view before paste
        editorView.updateState(state);

        // paste the column
        dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(th()(p('1')), th()(p('2')), th()(p('2'))),
              tr(td()(p('4')), td()(p('5')), td()(p('5'))),
              tr(td()(p('7')), td()(p('8')), td()(p('8'))),
            ),
          ),
        );
      });

      it('copies a table with all attributes', () => {
        const {
          editorView,
          refs: { nextPos },
        } = editor(
          doc(
            table({
              layout: 'wide',
              localId: TABLE_LOCAL_ID,
            })(
              tr(th()(p('{<>}1')), th()(p('2')), th()(p('3'))),
              tr(
                td({ background: '#fffcf2' })(p('4')),
                td({ background: '#fffcf7' })(p('5')),
                td()(p('6')),
              ),
              tr(td()(p('7')), td()(p('8')), td()(p('9'))),
            ),
            p('{nextPos}'),
          ),
        );

        let { state } = editorView;
        state = state.apply(selectTable(state.tr));

        const { dom, text } = __serializeForClipboard(
          editorView,
          state.selection.content(),
        );

        // move cursor to the 3rd column
        const $pos = state.doc.resolve(nextPos);
        state = state.apply(
          state.tr.setSelection(new TextSelection($pos, $pos)),
        );

        editorView.updateState(state);

        // paste the column
        dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ layout: 'wide', localId: TABLE_LOCAL_ID })(
              tr(th()(p('1')), th()(p('2')), th()(p('3'))),
              tr(
                td({ background: '#fffcf2' })(p('4')),
                td({ background: '#fffcf7' })(p('5')),
                td()(p('6')),
              ),
              tr(td()(p('7')), td()(p('8')), td()(p('9'))),
            ),
            table({ layout: 'wide', localId: TABLE_LOCAL_ID })(
              tr(th()(p('1')), th()(p('2')), th()(p('3'))),
              tr(
                td({ background: '#fffcf2' })(p('4')),
                td({ background: '#fffcf7' })(p('5')),
                td()(p('6')),
              ),
              tr(td()(p('7')), td()(p('8')), td()(p('9'))),
            ),
          ),
        );
      });
    });
  });

  describe('copy-pasting content inside expand', () => {
    describe('transformSliceToRemoveOpenExpand()', () => {
      it('should unwrap expand if it is the only top level node and not a part of copied content', () => {
        const slice = new Slice(fragment(expand()(p('text'))), 2, 2);
        const expectedSlice = new Slice(fragment(p('text')), 1, 1);

        expect(transformSliceToRemoveOpenExpand(slice, defaultSchema)).toEqual(
          expectedSlice,
        );
      });

      it('should ignore the process if top expand is a part of the copied content', () => {
        const slice = new Slice(fragment(expand()(p('text'))), 1, 1);

        expect(transformSliceToRemoveOpenExpand(slice, defaultSchema)).toEqual(
          slice,
        );
      });

      it('should ignore the process if have multiple top level nodes', () => {
        const slice = new Slice(fragment(p('text'), expand()(p('text'))), 2, 2);

        expect(transformSliceToRemoveOpenExpand(slice, defaultSchema)).toEqual(
          slice,
        );
      });

      it('should ignore the process if top level node is not an expand', () => {
        const slice = new Slice(fragment(panel()(p('text'))), 2, 2);

        expect(transformSliceToRemoveOpenExpand(slice, defaultSchema)).toEqual(
          slice,
        );
      });
    });
  });

  describe('copy-pasting table content', () => {
    describe('unwrapContentFromTable()', () => {
      it('should ignore any node that is not a table', () => {
        const tableNode = p('text')(defaultSchema);
        expect(unwrapContentFromTable(tableNode)).toBe(tableNode);
      });

      it('should unwrap any content inside a table', () => {
        const tableNode = table()(
          tr(th()(p('1')), th()(p('2'))),
          tr(td()(code_block()('3')), td()(p('4'))),
        )(defaultSchema);

        const expected = array(p('1'), p('2'), code_block()('3'), p('4'));
        expect(unwrapContentFromTable(tableNode)).toEqual(expected);
      });
    });

    describe('removeTableFromFirstChild()', () => {
      it('should unwrap the table when it is the first child of a node', () => {
        const tableNode = table()(
          tr(th()(p('1')), th()(p('2'))),
          tr(td()(code_block()('3')), td()(p('4'))),
        )(defaultSchema);

        const expected = array(p('1'), p('2'), code_block()('3'), p('4'));
        expect(removeTableFromFirstChild(tableNode, 0)).toEqual(expected);
      });

      it('should do nothing when the table is not the first child of a node', () => {
        const tableNode = table()(
          tr(th()(p('1')), th()(p('2'))),
          tr(td()(code_block()('3')), td()(p('4'))),
        )(defaultSchema);
        expect(removeTableFromFirstChild(tableNode, 1)).toEqual(tableNode);
      });
    });

    describe('removeTableFromLastChild()', () => {
      it('should unwrap the table when it is the last child of a node', () => {
        const tableNode = table()(
          tr(th()(p('1')), th()(p('2'))),
          tr(td()(code_block()('3')), td()(p('4'))),
        );
        const sliceFragment = fragment(p('Start'), tableNode);

        const expected = array(p('1'), p('2'), code_block()('3'), p('4'));
        expect(
          removeTableFromLastChild(
            sliceFragment.lastChild!,
            sliceFragment.childCount - 1,
            sliceFragment,
          ),
        ).toEqual(expected);
      });

      it('should do nothing when the table is not the last child of a node', () => {
        const tableNode = table()(
          tr(th()(p('1')), th()(p('2'))),
          tr(td()(code_block()('3')), td()(p('4'))),
        );
        const sliceFragment = fragment(p('Start'), tableNode, p('End'));

        expect(
          removeTableFromLastChild(sliceFragment.child(1), 1, sliceFragment),
        ).toEqualDocument(tableNode);
      });
    });

    describe('transformSliceToFixHardBreakProblemOnCopyFromCell()', () => {
      describe('when a slice contains a hardBreak after a table with only one cell', () => {
        it('should return only the content', () => {
          const slice = new Slice(
            fragment(table()(tr(th()(p('1')))), p(br())),
            0,
            1,
          );

          expect(
            transformSliceToFixHardBreakProblemOnCopyFromCell(
              slice,
              defaultSchema,
            ),
          ).toEqual(new Slice(fragment(p('1')), 0, 1));
        });
      });
    });

    describe('transformSliceToRemoveOpenTable()', () => {
      describe('when a slice contains only one table', () => {
        it('should ignore the table if the node is closed', () => {
          const slice = new Slice(
            fragment(
              table()(
                tr(th()(p('1')), th()(p('2'))),
                tr(td()(code_block()('3')), td()(p('4'))),
              ),
            ),
            0,
            0,
          );
          expect(transformSliceToRemoveOpenTable(slice, defaultSchema)).toBe(
            slice,
          );
        });

        it('should unwrap the table if the node is open', () => {
          const slice = new Slice(
            fragment(
              table()(
                tr(th()(p('1')), th()(p('2'))),
                tr(td()(code_block()('3')), td()(p('4'))),
              ),
            ),
            4,
            4,
          );
          expect(transformSliceToRemoveOpenTable(slice, defaultSchema)).toEqual(
            new Slice(
              fragment(p('1'), p('2'), code_block()('3'), p('4')),
              1,
              1,
            ),
          );
        });
      });

      describe('when a slice begins with a table', () => {
        it('should ignore the table if the node is closed', () => {
          const slice = new Slice(
            fragment(
              table()(
                tr(th()(p('1')), th()(p('2'))),
                tr(td()(code_block()('3')), td()(p('4'))),
              ),
              p('End'),
            ),
            0,
            0,
          );
          expect(transformSliceToRemoveOpenTable(slice, defaultSchema)).toBe(
            slice,
          );
        });

        it('should unwrap the table if the node is open', () => {
          const slice = new Slice(
            fragment(
              table()(
                tr(th()(p('1')), th()(p('2'))),
                tr(td()(code_block()('3')), td()(p('4'))),
              ),
              p('End'),
            ),
            4,
            0,
          );
          expect(transformSliceToRemoveOpenTable(slice, defaultSchema)).toEqual(
            new Slice(
              fragment(p('1'), p('2'), code_block()('3'), p('4'), p('End')),
              1,
              0,
            ),
          );
        });
      });

      describe('when a slice ends with a table', () => {
        it('should ignore the table if the node is closed', () => {
          const slice = new Slice(
            fragment(
              p('Start'),
              table()(
                tr(th()(p('1')), th()(p('2'))),
                tr(td()(code_block()('3')), td()(p('4'))),
              ),
            ),
            0,
            0,
          );
          expect(transformSliceToRemoveOpenTable(slice, defaultSchema)).toBe(
            slice,
          );
        });

        it('should unwrap the table if the node is open', () => {
          const slice = new Slice(
            fragment(
              p('Start'),
              table()(
                tr(th()(p('1')), th()(p('2'))),
                tr(td()(code_block()('3')), td()(p('4'))),
              ),
            ),
            0,
            4,
          );
          expect(transformSliceToRemoveOpenTable(slice, defaultSchema)).toEqual(
            new Slice(
              fragment(p('Start'), p('1'), p('2'), code_block()('3'), p('4')),
              0,
              1,
            ),
          );
        });
      });

      describe('when a slice starts in one table and ends in another', () => {
        it('should ignore the table if the slice is closed', () => {
          const tableNode = table()(
            tr(th()(p('1')), th()(p('2'))),
            tr(td()(code_block()('3')), td()(p('4'))),
          );
          const slice = new Slice(
            fragment(tableNode, p('Middle'), tableNode),
            0,
            0,
          );
          expect(transformSliceToRemoveOpenTable(slice, defaultSchema)).toBe(
            slice,
          );
        });
      });
    });
  });
});
