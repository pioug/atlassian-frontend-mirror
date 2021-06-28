import { EditorView } from 'prosemirror-view';
import {
  getCellsInColumn,
  getCellsInRow,
  getCellsInTable,
} from '@atlaskit/editor-tables/utils';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
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
} from '../../../../plugins/table/commands';
import {
  TablePluginState,
  TableDecorations,
  TableCssClassName as ClassName,
} from '../../../../plugins/table/types';
import { pluginKey } from '../../../../plugins/table/pm-plugins/plugin-factory';
import { getDecorations } from '../../../../plugins/table/pm-plugins/decorations/plugin';

describe('table hover selection plugin', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
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

      test('should add decoration', () => {
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

          it('should apply the hovered column class', () => {
            hoverColumns([column])(editorView.state, editorView.dispatch);

            const decos = getTableDecorations(
              editorView,
              getCellsInColumn(column)(editorView.state.selection)!,
              TableDecorations.ALL_CONTROLS_HOVER,
            );

            decos.forEach((deco) => {
              expect(deco).toEqual(
                expect.objectContaining({
                  type: expect.objectContaining({
                    attrs: expect.objectContaining({
                      class: expect.stringContaining(ClassName.HOVERED_COLUMN),
                    }),
                  }),
                }),
              );
            });
          });

          it('can apply the danger class to the decoration', () => {
            hoverColumns([column], true)(editorView.state, editorView.dispatch);

            const decos = getTableDecorations(
              editorView,
              getCellsInColumn(column)(editorView.state.selection)!,
              TableDecorations.ALL_CONTROLS_HOVER,
            );

            expect(decos).toHaveLength(2);
            const expected = [
              ClassName.HOVERED_CELL_IN_DANGER,
              ClassName.HOVERED_COLUMN,
            ];

            decos.forEach((deco) => {
              // @ts-ignore
              expect(deco.type.attrs.class.split(' ')).toEqual(
                expect.arrayContaining(expected),
              );
            });
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

        it('can apply the danger class to the decoration', () => {
          hoverRows([row], true)(editorView.state, editorView.dispatch);
          const cells = getCellsInRow(row)(editorView.state.selection)!;
          const decos = getTableDecorations(
            editorView,
            cells,
            TableDecorations.ALL_CONTROLS_HOVER,
          );

          expect(decos).toHaveLength(2);
          decos.forEach((deco) => {
            // @ts-ignore
            expect(deco.type.attrs.class.split(' ')).toContain('danger');
          });
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
