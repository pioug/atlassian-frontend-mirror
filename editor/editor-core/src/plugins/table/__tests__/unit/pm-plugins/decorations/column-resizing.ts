import { PluginKey } from 'prosemirror-state';
import { DecorationSet, EditorView } from 'prosemirror-view';
import { ContentNodeWithPos, getCellsInColumn } from 'prosemirror-utils';
import {
  td,
  doc,
  p,
  table,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  LightEditorPlugin,
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  showResizeHandleLine,
  hideResizeHandleLine,
} from '../../../../commands/hover';
import tablePlugin from '../../../../../table';
import { buildColumnResizingDecorations } from '../../../../pm-plugins/decorations/utils';
import { TableDecorations, TablePluginState } from '../../../../types';
import { pluginKey } from '../../../../pm-plugins/plugin-factory';
import { getDecorations } from '../../../../pm-plugins/decorations/plugin';

describe('tables: column resizing decorations', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: any) =>
    createEditor<TablePluginState, PluginKey>({
      doc,
      preset: new Preset<LightEditorPlugin>().add([
        tablePlugin,
        { tableOptions: { allowColumnResizing: true } },
      ]),
      pluginKey,
    });

  const getTableDecorations = (
    editorView: EditorView,
    cells: Array<ContentNodeWithPos>,
    key?: TableDecorations,
  ) => {
    const decorationSet = getDecorations(editorView.state);
    if (key) {
      const lastCell = cells[cells.length - 1];
      return decorationSet.find(
        cells[0].pos,
        lastCell.pos + lastCell.node.nodeSize,
        spec => spec.key.indexOf(key) > -1,
      );
    }

    return decorationSet.find(cells[0].pos, cells[cells.length - 1].pos);
  };

  describe('#buildColumnResizingDecorations', () => {
    describe.each([
      [-1, TableDecorations.COLUMN_RESIZING_HANDLE, 0],
      [0, TableDecorations.COLUMN_RESIZING_HANDLE, 0],
      [1, TableDecorations.COLUMN_RESIZING_HANDLE, 1],
    ])(
      'when columnEndIndex is %i',
      (columnEndIndex, decorationKey, expectedDecorations) => {
        it(`should return a decorationSet with ${expectedDecorations} ${decorationKey} type`, () => {
          const {
            editorView: { state },
          } = editor(doc(table()(tr(tdCursor, tdEmpty))));
          const nextDecorationSet = buildColumnResizingDecorations(
            columnEndIndex,
          )({
            decorationSet: DecorationSet.empty,
            tr: state.tr,
          });

          const decorations = nextDecorationSet.find(
            undefined,
            undefined,
            spec => spec.key.indexOf(decorationKey) > -1,
          );

          expect(decorations).toHaveLength(expectedDecorations);
        });
      },
    );
  });

  describe('when the table has merged cells on first row', () => {
    let editorView: EditorView;

    beforeEach(() => {
      const mountedEditor = editor(
        doc(
          p('text'),
          table()(
            tr(tdCursor, td({ colspan: 2 })(p(''))),
            tr(td()(p('a1')), tdEmpty, tdEmpty),
            tr(td()(p('a2')), tdEmpty, tdEmpty),
          ),
        ),
      );

      editorView = mountedEditor.editorView;
    });

    describe('when the showResizeHandleLine is dispatched', () => {
      beforeEach(() => {
        showResizeHandleLine({ left: 1, right: 2 })(
          editorView.state,
          editorView.dispatch,
        );
      });

      it('should add resizer line decoration', () => {
        const cells = getCellsInColumn(1)(editorView.state.selection)!;

        const decor = getTableDecorations(
          editorView,
          cells,
          TableDecorations.COLUMN_RESIZING_HANDLE_LINE,
        );

        expect(decor).toHaveLength(2);
      });

      describe('when the hideResizeHandleLine is dispatched', () => {
        beforeEach(() => {
          hideResizeHandleLine()(editorView.state, editorView.dispatch);
        });

        it('should remove resizer line decoration', () => {
          const cells = getCellsInColumn(1)(editorView.state.selection)!;

          const decor = getTableDecorations(
            editorView,
            cells,
            TableDecorations.COLUMN_RESIZING_HANDLE_LINE,
          );

          expect(decor).toHaveLength(0);
        });
      });
    });
  });
});
