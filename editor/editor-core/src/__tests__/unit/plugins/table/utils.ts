import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  td,
  tdCursor,
  tdEmpty,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  getColumnsWidths,
  getRowHeights,
  isColumnDeleteButtonVisible,
  isRowDeleteButtonVisible,
  getColumnDeleteButtonParams,
  getRowDeleteButtonParams,
  getRowsParams,
  getColumnClassNames,
  getRowClassNames,
} from '../../../../plugins/table/utils';
import { TablePluginState } from '../../../../plugins/table/types';
import { pluginKey } from '../../../../plugins/table/pm-plugins/plugin-factory';

describe('table plugin: utils', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
      pluginKey,
    });

  describe('#getColumnsWidths', () => {
    describe('when columns are not merged', () => {
      it('should return an array of widths of all columns', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(td({})(p('a1')), td({})(p('a2'))),
              tr(td({})(p('b1')), td({})(p('b2'))),
            ),
          ),
        );
        const columnsWidths = getColumnsWidths(editorView);
        columnsWidths.forEach((width) => {
          expect(typeof width).toEqual('number');
          expect(width && width > 0).toBe(true);
        });
      });
    });

    describe('when columns are merged', () => {
      describe('when merged column has cells', () => {
        it('should return an array of widths of all columns', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({ colspan: 2 })(p('a1')), td({})(p('a3'))),
                tr(td({})(p('b1')), td({})(p('b2')), td({})(p('b3'))),
              ),
            ),
          );
          const columnsWidths = getColumnsWidths(editorView);
          expect(columnsWidths).toEqual([1, undefined, 1]);
        });
      });
    });
  });

  describe('#getRowHeights', () => {
    describe('when rows are not merged', () => {
      it('should return an array of heights of all rows', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(td({})(p('a1')), td({})(p('a2'))),
              tr(td({})(p('b1')), td({})(p('b2'))),
            ),
          ),
        );
        const tableRef = editorView.dom.querySelector('table')!;
        const rowHeights = getRowHeights(tableRef);
        rowHeights.forEach((height) => {
          expect(typeof height).toEqual('number');
          expect(height > 0).toBe(true);
        });
      });
    });

    describe('when rows are merged', () => {
      describe('when merged row has cells', () => {
        it('should return an array of heights of all rows', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({ rowspan: 2 })(p('a1')), td({})(p('a2'))),
                tr(td({})(p('b2'))),
              ),
            ),
          );
          const tableRef = editorView.dom.querySelector('table')!;
          const rowHeights = getRowHeights(tableRef);

          rowHeights.forEach((height) => {
            expect(typeof height).toEqual('number');
            expect(height > 0).toBe(true);
          });
        });
      });
    });
  });

  describe('#isColumnDeleteButtonVisible', () => {
    describe('when selection is a TextSelection', () => {
      it('should return false', () => {
        const { editorView } = editor(
          doc(p('text'), table()(tr(tdCursor, tdEmpty, tdEmpty))),
        );
        expect(isColumnDeleteButtonVisible(editorView.state.selection)).toBe(
          false,
        );
      });
    });
    describe('when selection is a CellSelection', () => {
      describe('when no columns are fully selected', () => {
        it('should return false', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, td({})(p('{cell>}b3'))),
                tr(tdEmpty, tdEmpty, tdEmpty),
              ),
            ),
          );

          expect(isColumnDeleteButtonVisible(editorView.state.selection)).toBe(
            false,
          );
        });
      });
      describe('when a column is selected', () => {
        it('should return true', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(td({})(p('{cell>}c1')), tdEmpty, tdEmpty),
              ),
            ),
          );

          expect(isColumnDeleteButtonVisible(editorView.state.selection)).toBe(
            true,
          );
        });
      });
      describe('when table is selected', () => {
        it('should return false', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, td({})(p('{cell>}c3'))),
              ),
            ),
          );

          expect(isColumnDeleteButtonVisible(editorView.state.selection)).toBe(
            false,
          );
        });
      });
    });
  });

  describe('#isRowDeleteButtonVisible', () => {
    describe('when selection is a TextSelection', () => {
      it('should return false', () => {
        const { editorView } = editor(
          doc(p('text'), table()(tr(tdCursor, tdEmpty, tdEmpty))),
        );
        expect(isRowDeleteButtonVisible(editorView.state.selection)).toBe(
          false,
        );
      });
    });
    describe('when selection is a CellSelection', () => {
      describe('when no rows are fully selected', () => {
        it('should return false', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
                tr(tdEmpty, td({})(p('{cell>}b3')), tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
              ),
            ),
          );

          expect(isRowDeleteButtonVisible(editorView.state.selection)).toBe(
            false,
          );
        });
      });
      describe('when a row is selected', () => {
        it('should return true', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({})(p('{<cell}a1')), tdEmpty, td({})(p('{cell>}a1'))),
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
              ),
            ),
          );

          expect(isRowDeleteButtonVisible(editorView.state.selection)).toBe(
            true,
          );
        });
      });
      describe('when table is selected', () => {
        it('should return false', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, td({})(p('{cell>}c3'))),
              ),
            ),
          );

          expect(isRowDeleteButtonVisible(editorView.state.selection)).toBe(
            false,
          );
        });
      });
    });
  });

  describe('#getColumnDeleteButtonParams', () => {
    describe('when selection is a TextSelection', () => {
      it('should return null', () => {
        const { editorView } = editor(
          doc(p('text'), table()(tr(tdCursor, tdEmpty, tdEmpty))),
        );
        const columnsWidths = [100, 150, 200];
        expect(
          getColumnDeleteButtonParams(
            columnsWidths,
            editorView.state.selection,
          ),
        ).toBe(null);
      });
    });
    describe('when selection is a CellSelection and 3 columns are selected', () => {
      describe('columnsWidths = [100, 150, 200]', () => {
        it('should return indexes = [0, 1, 2]', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, td({})(p('{cell>}c3')), tdEmpty),
              ),
            ),
          );

          const columnsWidths = [100, 150, 200];
          const { indexes, left } = getColumnDeleteButtonParams(
            columnsWidths,
            editorView.state.selection,
          )!;
          expect(indexes).toEqual([0, 1, 2]);
          expect(left > 0).toBe(true);
        });
      });
    });
  });

  describe('#getRowDeleteButtonParams', () => {
    describe('when selection is a TextSelection', () => {
      it('should return null', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(tdCursor, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );
        const rowsHeights = [100, 150, 200];
        expect(
          getRowDeleteButtonParams(rowsHeights, editorView.state.selection),
        ).toBe(null);
      });
    });
    describe('when selection is a CellSelection and 3 rows are selected', () => {
      describe('rowsHeights = [100, 150, 200]', () => {
        it('should return indexes = [0, 1, 2]', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, td({})(p('{cell>}c3'))),
                tr(tdEmpty, tdEmpty, tdEmpty),
              ),
            ),
          );

          const rowsHeights = [100, 150, 200];
          const { indexes, top } = getRowDeleteButtonParams(
            rowsHeights,
            editorView.state.selection,
          )!;
          expect(indexes).toEqual([0, 1, 2]);
          expect(top > 0).toBe(true);
        });
      });
      describe('rowsHeights = [100, ,150, ,200]', () => {
        it('should return indexes = [0, 1, 2]', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(
                  td({ rowspan: 2 })(p('{<cell}a1')),
                  td({ rowspan: 2 })(p('a2')),
                  td({ rowspan: 2 })(p('a3')),
                ),
                tr(
                  td({ rowspan: 2 })(p('c1')),
                  td({ rowspan: 2 })(p('c2')),
                  td({ rowspan: 2 })(p('{cell>}c3')),
                ),
                tr(tdEmpty, tdEmpty, tdEmpty),
              ),
            ),
          );

          const rowsHeights = [100, , 150, , 200];
          const { indexes, top } = getRowDeleteButtonParams(
            rowsHeights,
            editorView.state.selection,
          )!;
          expect(indexes).toEqual([0, 2]);
          expect(top > 0).toBe(true);
        });
      });
    });
  });

  describe('#getRowsParams', () => {
    describe('rowHeights = [100, 150, 200]', () => {
      it('should return consecutive indexes', () => {
        const rowHeights = [100, 150, 200];
        const rows = getRowsParams(rowHeights);
        rows.forEach((row, index) => {
          expect(row.startIndex).toEqual(index);
          expect(row.endIndex).toEqual(index + 1);
          expect(row.height).toEqual(rowHeights[index]);
        });
      });
    });
    describe('rowHeights = [100, ,150, ,200]', () => {
      it('should return correct indexes', () => {
        const rowHeights = [100, , 150, , 200];
        const rows = getRowsParams(rowHeights);
        const expectedIndexes = [0, 2, 4, 5];
        for (let i = 0, count = rows.length; i < count; i++) {
          const row = rows[i];
          expect(row.startIndex).toEqual(expectedIndexes[i]);
          expect(row.endIndex).toEqual(expectedIndexes[i + 1]);
          expect(row.height).toEqual(rowHeights[expectedIndexes[i]]);
        }
      });
    });
  });

  describe('#getColumnClassNames', () => {
    describe('when selection is a TextSelection', () => {
      [[0], [1], [2], [0, 1], [1, 2], [0, 2]].forEach((hoveredColumns) => {
        describe(`when hoveredColumns = ${hoveredColumns}`, () => {
          it('return a string containing "active" substring', () => {
            const { editorView } = editor(
              doc(
                p('text'),
                table()(
                  tr(tdCursor, tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                ),
              ),
            );
            const isInDanger = false;
            const classNames = getColumnClassNames(
              hoveredColumns[0],
              editorView.state.selection,
              hoveredColumns,
              isInDanger,
            );
            expect(classNames.indexOf('active') > -1).toBe(true);
          });
          describe('when isInDanger = true', () => {
            it('return a string containing "danger" substring', () => {
              const { editorView } = editor(
                doc(
                  p('text'),
                  table()(
                    tr(tdCursor, tdEmpty, tdEmpty),
                    tr(tdEmpty, tdEmpty, tdEmpty),
                    tr(tdEmpty, tdEmpty, tdEmpty),
                  ),
                ),
              );
              const isInDanger = true;
              const classNames = getColumnClassNames(
                hoveredColumns[0],
                editorView.state.selection,
                hoveredColumns,
                isInDanger,
              );
              expect(classNames.indexOf('danger') > -1).toBe(true);
            });
          });
        });
      });
    });
    describe('when selection is a CellSelection', () => {
      describe('when no columns are fully selected', () => {
        it('should return an empty string', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, td({})(p('{cell>}b3'))),
                tr(tdEmpty, tdEmpty, tdEmpty),
              ),
            ),
          );

          const classNames = getColumnClassNames(
            0,
            editorView.state.selection,
            [],
            false,
          );
          expect(classNames).toBe('');
        });
      });
      describe('when a column is selected', () => {
        it('return a string containing "active" substring', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, td({})(p('{cell>}c3'))),
              ),
            ),
          );

          [0, 1, 2].forEach((index) => {
            const classNames = getColumnClassNames(
              index,
              editorView.state.selection,
              [],
              false,
            );
            expect(classNames.indexOf('active') > -1).toBe(true);
          });
        });
        describe('when isInDanger = true', () => {
          it('return a string containing "danger" substring', () => {
            const { editorView } = editor(
              doc(
                p('text'),
                table()(
                  tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty, td({})(p('{cell>}c3'))),
                ),
              ),
            );
            [0, 1, 2].forEach((index) => {
              const classNames = getColumnClassNames(
                index,
                editorView.state.selection,
                [],
                true,
              );
              expect(classNames.indexOf('danger') > -1).toBe(true);
            });
          });
        });
      });
    });
  });

  describe('#getRowClassNames', () => {
    describe('when selection is a TextSelection', () => {
      [[0], [1], [2], [0, 1], [1, 2], [0, 2]].forEach((hoveredRows) => {
        describe(`when hoveredRows = ${hoveredRows}`, () => {
          it('return a string containing "active" substring', () => {
            const { editorView } = editor(
              doc(
                p('text'),
                table()(
                  tr(tdCursor, tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                ),
              ),
            );
            const isInDanger = false;
            const classNames = getRowClassNames(
              hoveredRows[0],
              editorView.state.selection,
              hoveredRows,
              isInDanger,
            );
            expect(classNames.indexOf('active') > -1).toBe(true);
          });
          describe('when isInDanger = true', () => {
            it('return a string containing "danger" substring', () => {
              const { editorView } = editor(
                doc(
                  p('text'),
                  table()(
                    tr(tdCursor, tdEmpty, tdEmpty),
                    tr(tdEmpty, tdEmpty, tdEmpty),
                    tr(tdEmpty, tdEmpty, tdEmpty),
                  ),
                ),
              );
              const isInDanger = true;
              const classNames = getRowClassNames(
                hoveredRows[0],
                editorView.state.selection,
                hoveredRows,
                isInDanger,
              );
              expect(classNames.indexOf('danger') > -1).toBe(true);
            });
          });
        });
      });
    });
    describe('when selection is a CellSelection', () => {
      describe('when no rows are fully selected', () => {
        it('should return an empty string', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(tdEmpty, td({})(p('{cell>}c3')), tdEmpty),
              ),
            ),
          );

          const classNames = getRowClassNames(
            0,
            editorView.state.selection,
            [],
            false,
          );
          expect(classNames).toBe('');
        });
      });
      describe('when a row is selected', () => {
        it('return a string containing "active" substring', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, td({})(p('{cell>}c3'))),
              ),
            ),
          );

          [0, 1, 2].forEach((index) => {
            const classNames = getRowClassNames(
              index,
              editorView.state.selection,
              [],
              false,
            );
            expect(classNames.indexOf('active') > -1).toBe(true);
          });
        });
        describe('when isInDanger = true', () => {
          it('return a string containing "danger" substring', () => {
            const { editorView } = editor(
              doc(
                p('text'),
                table()(
                  tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty, td({})(p('{cell>}c3'))),
                ),
              ),
            );
            [0, 1, 2].forEach((index) => {
              const classNames = getRowClassNames(
                index,
                editorView.state.selection,
                [],
                true,
              );
              expect(classNames.indexOf('danger') > -1).toBe(true);
            });
          });
        });
      });
    });
  });
});
