import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import selectionPlugin from '@atlaskit/editor-core/src/plugins/selection';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { getCellsInColumn } from '@atlaskit/editor-tables/utils';
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
  table,
  td,
  tdCursor,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../../plugins/table';
import {
  hideResizeHandleLine,
  showResizeHandleLine,
} from '../../../../plugins/table/commands/hover';
import { getDecorations } from '../../../../plugins/table/pm-plugins/decorations/plugin';
import { buildColumnResizingDecorations } from '../../../../plugins/table/pm-plugins/decorations/utils';
import { pluginKey } from '../../../../plugins/table/pm-plugins/plugin-key';
import type { TablePluginState } from '../../../../plugins/table/types';
import { TableDecorations } from '../../../../plugins/table/types';

describe('tables: column resizing decorations', () => {
  const createEditor = createProsemirrorEditorFactory();
  const getEditorFeatureFlags = () => ({});
  const preset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, {}])
    .add(contentInsertionPlugin)
    .add(widthPlugin)
    .add(guidelinePlugin)
    .add(selectionPlugin)
    .add([
      tablePlugin,
      {
        tableOptions: { allowColumnResizing: true },
        getEditorFeatureFlags,
      },
    ]);
  const editor = (doc: DocBuilder) =>
    createEditor<TablePluginState, PluginKey, typeof preset>({
      doc,
      preset,
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
            false,
            () => ({} as any),
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
