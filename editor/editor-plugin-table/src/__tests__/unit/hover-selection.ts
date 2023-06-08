import { EditorView } from 'prosemirror-view';
import {
  getCellsInColumn,
  getCellsInRow,
  getCellsInTable,
} from '@atlaskit/editor-tables/utils';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  tr,
  tdEmpty,
  tdCursor,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { selectColumns } from '@atlaskit/editor-test-helpers/table';

import {
  clearHoverSelection,
  hoverColumns,
  hoverRows,
  hoverTable,
} from '../../plugins/table/commands';
import { TableDecorations, TablePluginState } from '../../plugins/table/types';
import { pluginKey } from '../../plugins/table/pm-plugins/plugin-key';
import { getDecorations } from '../../plugins/table/pm-plugins/decorations/plugin';
import tablePlugin from '../../plugins/table-plugin';
import { PluginKey } from 'prosemirror-state';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { widthPlugin } from '@atlaskit/editor-plugin-width';

describe('table hover selection plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, {}])
    .add(contentInsertionPlugin)
    .add(widthPlugin)
    .add(tablePlugin);

  const editor = (doc: DocBuilder) =>
    createEditor<TablePluginState, PluginKey>({
      doc,
      preset,
      pluginKey,
    });

  const getTableDecorations = (
    editorView: EditorView,
    cells: Array<{ pos: number }>,
    key?: TableDecorations,
  ) => {
    const decorationSet = getDecorations(editorView.state);

    if (key) {
      return decorationSet.find(
        cells[0].pos,
        cells[cells.length - 1].pos,
        (spec) => spec.key.indexOf(key) > -1,
      );
    }

    return decorationSet.find(cells[0].pos, cells[cells.length - 1].pos);
  };

  describe('when table has 3 columns/2 rows', () => {
    let editorView: EditorView;
    beforeEach(() => {
      const mountedEditor = editor(
        doc(
          p('text'),
          table()(
            tr(tdCursor, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      editorView = mountedEditor.editorView;
    });

    describe('selectColumn(1)', () => {
      const column = 1;
      beforeEach(() => {
        selectColumns([column])(editorView.state, editorView.dispatch);
      });

      it('should add decoration', () => {
        const cells = getCellsInColumn(column)(editorView.state.selection)!;

        const decor = getTableDecorations(
          editorView,
          cells,
          TableDecorations.COLUMN_SELECTED,
        );

        expect(decor).toHaveLength(2);
      });
    });

    describe('hoverColumn(number)', () => {
      it('can create a hover selection over multiple columns', () => {
        hoverColumns([0, 1])(editorView.state, editorView.dispatch);
        const cells = getCellsInColumn(0)(editorView.state.selection)!.concat(
          getCellsInColumn(1)(editorView.state.selection)!,
        );

        expect(
          getTableDecorations(
            editorView,
            cells,
            TableDecorations.ALL_CONTROLS_HOVER,
          ),
        ).toHaveLength(4);
      });

      describe.each([0, 1, 2])(
        'when called hoverColumns with [%d]',
        (column) => {
          it('should create a hover selection of column', () => {
            hoverColumns([column])(editorView.state, editorView.dispatch);
            const decos = getTableDecorations(
              editorView,
              getCellsInColumn(column)(editorView.state.selection)!,
              TableDecorations.ALL_CONTROLS_HOVER,
            );

            // selection spans 2 cells in the selected column (because we have 2 rows in the table)
            expect(decos).toHaveLength(2);
          });
        },
      );
    });
  });

  describe('hoverRow(number)', () => {
    describe('when table has 3 rows', () => {
      let editorView: EditorView;
      beforeEach(() => {
        const mountedEditor = editor(
          doc(
            p('text'),
            table()(
              tr(tdCursor, tdEmpty),
              tr(tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty),
            ),
          ),
        );

        editorView = mountedEditor.editorView;
      });

      it('can create a hover selection over multiple rows', () => {
        hoverRows([0, 1])(editorView.state, editorView.dispatch);
        const cells = getCellsInRow(0)(editorView.state.selection)!.concat(
          getCellsInRow(1)(editorView.state.selection)!,
        );

        expect(
          getTableDecorations(
            editorView,
            cells,
            TableDecorations.ALL_CONTROLS_HOVER,
          ),
        ).toHaveLength(4);
      });

      describe.each([0, 1, 2])('when called hoverRows with [%d]', (row) => {
        it('should create a hover selection of row', () => {
          hoverRows([row])(editorView.state, editorView.dispatch);
          expect(
            getTableDecorations(
              editorView,
              getCellsInRow(row)(editorView.state.selection)!,
              TableDecorations.ALL_CONTROLS_HOVER,
            ),
          ).toHaveLength(2);
        });
      });
    });
  });

  describe('hovertable()', () => {
    describe('when table has 3 rows', () => {
      it('should create a hover selection of the whole table', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(tdCursor, tdEmpty),
              tr(tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty),
            ),
          ),
        );

        hoverTable()(editorView.state, editorView.dispatch);

        // selection should span all 6 cells
        expect(
          getTableDecorations(
            editorView,
            getCellsInTable(editorView.state.selection)!,
            TableDecorations.ALL_CONTROLS_HOVER,
          ),
        ).toHaveLength(6);

        // reset hover selection plugin to an empty DecorationSet
        clearHoverSelection()(editorView.state, editorView.dispatch);
      });
    });
  });
});
