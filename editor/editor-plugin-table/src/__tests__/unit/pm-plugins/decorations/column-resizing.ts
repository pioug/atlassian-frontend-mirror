import { PluginKey } from 'prosemirror-state';
import { ContentNodeWithPos } from 'prosemirror-utils';
import { getCellsInColumn } from '@atlaskit/editor-tables/utils';

import { DecorationSet, EditorView } from 'prosemirror-view';

import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  td,
  tdCursor,
  tdEmpty,
  tr,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../../plugins/table';
import {
  hideResizeHandleLine,
  showResizeHandleLine,
} from '../../../../plugins/table/commands/hover';
import { getDecorations } from '../../../../plugins/table/pm-plugins/decorations/plugin';
import { buildColumnResizingDecorations } from '../../../../plugins/table/pm-plugins/decorations/utils';
import { pluginKey } from '../../../../plugins/table/pm-plugins/plugin-key';
import {
  TableDecorations,
  TablePluginState,
} from '../../../../plugins/table/types';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';

describe('tables: column resizing decorations', () => {
  const createEditor = createProsemirrorEditorFactory();
  const getEditorFeatureFlags = () => ({});
  const editor = (doc: DocBuilder) =>
    createEditor<TablePluginState, PluginKey>({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add([
          tablePlugin,
          {
            tableOptions: { allowColumnResizing: true },
            getEditorFeatureFlags,
          },
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
        (spec) => spec.key.indexOf(key) > -1,
      );
    }

    return decorationSet.find(cells[0].pos, cells[cells.length - 1].pos);
  };

  describe('#buildColumnResizingDecorations', () => {
    describe.each([
      [0, -1, TableDecorations.COLUMN_RESIZING_HANDLE, 0],
      [0, 0, TableDecorations.COLUMN_RESIZING_HANDLE, 0],
      [0, 1, TableDecorations.COLUMN_RESIZING_HANDLE, 1],
    ])(
      'when columnEndIndex is %i',
      (rowEndIndex, columnEndIndex, decorationKey, expectedDecorations) => {
        it(`should return a decorationSet with ${expectedDecorations} ${decorationKey} type`, () => {
          const {
            editorView: { state },
          } = editor(doc(table()(tr(tdCursor, tdEmpty))));
          const nextDecorationSet = buildColumnResizingDecorations(
            rowEndIndex,
            columnEndIndex,
          )({
            decorationSet: DecorationSet.empty,
            tr: state.tr,
          });

          const decorations = nextDecorationSet.find(
            undefined,
            undefined,
            (spec) => spec.key.indexOf(decorationKey) > -1,
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
