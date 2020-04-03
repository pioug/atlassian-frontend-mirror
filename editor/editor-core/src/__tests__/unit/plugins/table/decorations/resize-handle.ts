import { DecorationSet, EditorView } from 'prosemirror-view';
import { getCellsInColumn } from 'prosemirror-utils';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
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
  TablePluginState,
  TableDecorations,
} from '../../../../../plugins/table/types';
import { ContentNodeWithPos } from 'prosemirror-utils';
import {
  showResizeHandleLine,
  hideResizeHandleLine,
} from '../../../../../plugins/table/commands/hover';
import {
  getPluginState,
  pluginKey,
} from '../../../../../plugins/table/pm-plugins/plugin-factory';

describe('table resizer decorations plugin', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        allowTables: {
          allowColumnResizing: true,
        },
      },
      pluginKey,
    });
  const getTableDecorations = (
    editorView: EditorView,
    cells: Array<ContentNodeWithPos>,
    key?: TableDecorations,
  ) => {
    const { decorationSet }: { decorationSet: DecorationSet } = getPluginState(
      editorView.state,
    );

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
