import {
  EditorNodeContainerModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  bodiedExtension,
  doc,
  expand,
  p,
  strong,
  table,
  td,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  simpleTable,
  simpleTableWithMergedCellNotInFirstRow,
  simpleTableWithMergedCellNotInFirstRowInExpand,
  simpleTableWithMergedCellNotInFirstRowInExtension,
  simpleTableWithMergedCells,
  simpleTableWithMergedCellsInExpand,
  simpleTableWithMergedCellsInExtension,
} from './drag-and-drop.spec.ts-fixtures';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
    featureFlags: {
      'table-drag-and-drop': true,
    },
    allowExpand: true,
    allowExtension: true,
  },
  adf: simpleTable,
  platformFeatureFlags: {
    'platform.editor.custom-table-width': true,
  },
});

test.describe('drag and drop with merged cells', () => {
  test.describe('selecting row', () => {
    test.describe('in plain table', () => {
      test.use({
        adf: simpleTableWithMergedCells,
      });

      test('should not be able to drag first row when there are merged cells', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const firstRow = await tableModel.rowDragControls(0);
        const cell = await tableModel.cell(0);

        await cell.hover();
        await firstRow.dragTo(1, editor);

        await expect(editor).toMatchDocument(
          doc(
            table({ isNumberColumnEnabled: false, layout: 'default' })(
              tr(
                th({ background: '#deebff' })(p(strong('aa'))),
                th({ rowspan: 2, background: '#deebff' })(
                  p(strong('ab')),
                  p('ba'),
                ),
                th({ background: '#deebff' })(p(strong('ac'))),
              ),
              tr(
                td({ background: '#b3d4ff' })(p('bb')),
                td({ background: '#b3d4ff' })(p('bc')),
              ),
              tr(
                td({ background: '#4c9aff' })(p('ca')),
                td({ background: '#4c9aff' })(p('cb')),
                td({ background: '#4c9aff' })(p('cc')),
              ),
            ),
            p(),
          ),
        );
      });
    });

    test.describe('in expand', () => {
      test.use({
        adf: simpleTableWithMergedCellsInExpand,
      });

      test('should not be able to drag first row when there are merged cells', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        await editor.selection.set({ anchor: 5, head: 5 }); // make sure focus is within table

        const firstRow = await tableModel.rowDragControls(0);

        const cell = await tableModel.cell(0);

        await cell.hover();
        await firstRow.dragTo(1, editor);

        await expect(editor).toMatchDocument(
          doc(
            expand({ title: 'Expand title' })(
              table({ isNumberColumnEnabled: false, layout: 'default' })(
                tr(
                  th({ background: '#deebff' })(p(strong('aa'))),
                  th({ rowspan: 2, background: '#deebff' })(
                    p(strong('ab')),
                    p('ba'),
                  ),
                  th({ background: '#deebff' })(p(strong('ac'))),
                ),
                tr(
                  td({ background: '#b3d4ff' })(p('bb')),
                  td({ background: '#b3d4ff' })(p('bc')),
                ),
                tr(
                  td({ background: '#4c9aff' })(p('ca')),
                  td({ background: '#4c9aff' })(p('cb')),
                  td({ background: '#4c9aff' })(p('cc')),
                ),
              ),
              p(),
            ),
          ),
        );
      });
    });

    test.describe('in extension', () => {
      test.use({
        adf: simpleTableWithMergedCellsInExtension,
      });

      test('should not be able to drag first row when there are merged cells', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        await editor.selection.set({ anchor: 5, head: 5 }); // make sure focus is within table
        const firstRow = await tableModel.rowDragControls(0);

        const cell = await tableModel.cell(0);

        await cell.hover();
        await firstRow.dragTo(1, editor);

        await expect(editor).toMatchDocument(
          doc(
            bodiedExtension({
              extensionType: 'com.atlassian.confluence.macro.core',
              extensionKey: 'excerpt',
              layout: 'default',
              localId: 'testId',
              parameters: {
                macroParams: {
                  hidden: {
                    value: 'false',
                  },
                },
              },
            })(
              table({ isNumberColumnEnabled: false, layout: 'default' })(
                tr(
                  th({ background: '#deebff' })(p(strong('aa'))),
                  th({ rowspan: 2, background: '#deebff' })(
                    p(strong('ab')),
                    p('ba'),
                  ),
                  th({ background: '#deebff' })(p(strong('ac'))),
                ),
                tr(
                  td({ background: '#b3d4ff' })(p('bb')),
                  td({ background: '#b3d4ff' })(p('bc')),
                ),
                tr(
                  td({ background: '#4c9aff' })(p('ca')),
                  td({ background: '#4c9aff' })(p('cb')),
                  td({ background: '#4c9aff' })(p('cc')),
                ),
              ),
              p(),
            ),
          ),
        );
      });
    });
  });

  test.describe('selecting column', () => {
    test.describe('in plain table', () => {
      test.use({
        adf: simpleTableWithMergedCells,
      });
      test('should be able to drag column when there are merged cells in column', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const firstColumn = await tableModel.columnDragControls(1);
        const cell = await tableModel.cell(1);

        await cell.hover();
        await firstColumn.dragTo(2, editor);

        await expect(editor).toMatchDocument(
          doc(
            table({ isNumberColumnEnabled: false, layout: 'default' })(
              tr(
                th({ background: '#deebff' })(p(strong('aa'))),
                th({ background: '#deebff' })(p(strong('ac'))),
                th({ rowspan: 2, background: '#deebff' })(
                  p(strong('ab')),
                  p('ba'),
                ),
              ),
              tr(
                td({ background: '#b3d4ff' })(p('bb')),
                td({ background: '#b3d4ff' })(p('bc')),
              ),
              tr(
                td({ background: '#4c9aff' })(p('ca')),
                td({ background: '#4c9aff' })(p('cc')),
                td({ background: '#4c9aff' })(p('cb')),
              ),
            ),
            p(),
          ),
        );
      });
    });
    test.describe('in expand', () => {
      test.use({
        adf: simpleTableWithMergedCellsInExpand,
      });
      test('should be able to drag column when there are merged cells in column', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        await editor.selection.set({ anchor: 5, head: 5 }); // make sure focus is within table
        const firstColumn = await tableModel.columnDragControls(1);
        const cell = await tableModel.cell(1);

        await cell.hover();
        await firstColumn.dragTo(2, editor);

        await expect(editor).toMatchDocument(
          doc(
            expand({ title: 'Expand title' })(
              table({ isNumberColumnEnabled: false, layout: 'default' })(
                tr(
                  th({ background: '#deebff' })(p(strong('aa'))),
                  th({ background: '#deebff' })(p(strong('ac'))),
                  th({ rowspan: 2, background: '#deebff' })(
                    p(strong('ab')),
                    p('ba'),
                  ),
                ),
                tr(
                  td({ background: '#b3d4ff' })(p('bb')),
                  td({ background: '#b3d4ff' })(p('bc')),
                ),
                tr(
                  td({ background: '#4c9aff' })(p('ca')),
                  td({ background: '#4c9aff' })(p('cc')),
                  td({ background: '#4c9aff' })(p('cb')),
                ),
              ),
              p(),
            ),
          ),
        );
      });
    });

    test.describe('in extension', () => {
      test.use({
        adf: simpleTableWithMergedCellsInExtension,
      });
      test('should be able to drag column when there are merged cells in column', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        await editor.selection.set({ anchor: 5, head: 5 }); // make sure focus is within table
        const firstColumn = await tableModel.columnDragControls(1);
        const cell = await tableModel.cell(1);

        await cell.hover();
        await firstColumn.dragTo(2, editor);

        await expect(editor).toMatchDocument(
          doc(
            bodiedExtension({
              extensionType: 'com.atlassian.confluence.macro.core',
              extensionKey: 'excerpt',
              layout: 'default',
              localId: 'testId',
              parameters: {
                macroParams: {
                  hidden: {
                    value: 'false',
                  },
                },
              },
            })(
              table({ isNumberColumnEnabled: false, layout: 'default' })(
                tr(
                  th({ background: '#deebff' })(p(strong('aa'))),
                  th({ background: '#deebff' })(p(strong('ac'))),
                  th({ rowspan: 2, background: '#deebff' })(
                    p(strong('ab')),
                    p('ba'),
                  ),
                ),
                tr(
                  td({ background: '#b3d4ff' })(p('bb')),
                  td({ background: '#b3d4ff' })(p('bc')),
                ),
                tr(
                  td({ background: '#4c9aff' })(p('ca')),
                  td({ background: '#4c9aff' })(p('cc')),
                  td({ background: '#4c9aff' })(p('cb')),
                ),
              ),
              p(),
            ),
          ),
        );
      });
    });

    test.describe('in plain table but NOT in first row', () => {
      test.use({
        adf: simpleTableWithMergedCellNotInFirstRow,
      });

      test('should be NOT able to drag first column when there are merged cells in column', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const firstColumn = await tableModel.columnDragControls(0);
        const cell = await tableModel.cell(0);

        await cell.hover();
        await firstColumn.dragTo(1, editor);

        await expect(editor).toMatchDocument(
          doc(
            table({ isNumberColumnEnabled: false, layout: 'default' })(
              tr(
                th({ background: '#deebff' })(p(strong('aa'))),
                th({ background: '#deebff' })(p(strong('ab'))),
                th({ background: '#deebff' })(p(strong('ac'))),
              ),
              tr(
                td({ colspan: 2, background: '#b3d4ff' })(p('ba')),
                td({ background: '#b3d4ff' })(p('bc')),
              ),
              tr(
                td({ background: '#4c9aff' })(p('ca')),
                td({ background: '#4c9aff' })(p('cb')),
                td({ background: '#4c9aff' })(p('cc')),
              ),
            ),
            p(),
          ),
        );
      });

      test('should be able to drag 2nd row when there are merged cells in side', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        await editor.selection.set({ anchor: 5, head: 5 });

        const sourceRow = await tableModel.rowDragControls(1);
        const cell = await tableModel.cell(3);

        await cell.hover();
        await sourceRow.dragTo(2, editor);

        await expect(editor).toMatchDocument(
          doc(
            table({ isNumberColumnEnabled: false, layout: 'default' })(
              tr(
                th({ background: '#deebff' })(p(strong('aa'))),
                th({ background: '#deebff' })(p(strong('ab'))),
                th({ background: '#deebff' })(p(strong('ac'))),
              ),
              tr(
                td({ background: '#4c9aff' })(p('ca')),
                td({ background: '#4c9aff' })(p('cb')),
                td({ background: '#4c9aff' })(p('cc')),
              ),
              tr(
                td({ colspan: 2, background: '#b3d4ff' })(p('ba')),
                td({ background: '#b3d4ff' })(p('bc')),
              ),
            ),
            p(),
          ),
        );
      });
    });

    test.describe('in expand but NOT in first row', () => {
      test.use({
        adf: simpleTableWithMergedCellNotInFirstRowInExpand,
      });

      test('should be NOT able to drag first column when there are merged cells in column', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        await editor.selection.set({ anchor: 5, head: 5 }); // make sure focus is within table
        const firstColumn = await tableModel.columnDragControls(0);
        const cell = await tableModel.cell(0);

        await cell.hover();
        await firstColumn.dragTo(1, editor);

        await expect(editor).toMatchDocument(
          doc(
            expand({ title: 'Expand title' })(
              table({ isNumberColumnEnabled: false, layout: 'default' })(
                tr(
                  th({ background: '#deebff' })(p(strong('aa'))),
                  th({ background: '#deebff' })(p(strong('ab'))),
                  th({ background: '#deebff' })(p(strong('ac'))),
                ),
                tr(
                  td({ colspan: 2, background: '#b3d4ff' })(p('ba')),
                  td({ background: '#b3d4ff' })(p('bc')),
                ),
                tr(
                  td({ background: '#4c9aff' })(p('ca')),
                  td({ background: '#4c9aff' })(p('cb')),
                  td({ background: '#4c9aff' })(p('cc')),
                ),
              ),
              p(),
            ),
          ),
        );
      });

      test('should be able to drag 2nd row when there are merged cells in side', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        await editor.selection.set({ anchor: 5, head: 5 }); // make sure focus is within table
        const sourceRow = await tableModel.rowDragControls(1);
        const cell = await tableModel.cell(3);

        await cell.hover();
        await sourceRow.dragTo(2, editor);

        await expect(editor).toMatchDocument(
          doc(
            expand({ title: 'Expand title' })(
              table({ isNumberColumnEnabled: false, layout: 'default' })(
                tr(
                  th({ background: '#deebff' })(p(strong('aa'))),
                  th({ background: '#deebff' })(p(strong('ab'))),
                  th({ background: '#deebff' })(p(strong('ac'))),
                ),
                tr(
                  td({ background: '#4c9aff' })(p('ca')),
                  td({ background: '#4c9aff' })(p('cb')),
                  td({ background: '#4c9aff' })(p('cc')),
                ),
                tr(
                  td({ colspan: 2, background: '#b3d4ff' })(p('ba')),
                  td({ background: '#b3d4ff' })(p('bc')),
                ),
              ),
              p(),
            ),
          ),
        );
      });
    });

    test.describe('in extension table but NOT in first row', () => {
      test.use({
        adf: simpleTableWithMergedCellNotInFirstRowInExtension,
      });

      test('should be NOT able to drag first column when there are merged cells in column', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        await editor.selection.set({ anchor: 5, head: 5 });
        const firstColumn = await tableModel.columnDragControls(0);
        const cell = await tableModel.cell(0);

        await cell.hover();
        await firstColumn.dragTo(1, editor);

        await expect(editor).toMatchDocument(
          doc(
            bodiedExtension({
              extensionType: 'com.atlassian.confluence.macro.core',
              extensionKey: 'excerpt',
              layout: 'default',
              localId: 'testId',
              parameters: {
                macroParams: {
                  hidden: {
                    value: 'false',
                  },
                },
              },
            })(
              table({ isNumberColumnEnabled: false, layout: 'default' })(
                tr(
                  th({ background: '#deebff' })(p(strong('aa'))),
                  th({ background: '#deebff' })(p(strong('ab'))),
                  th({ background: '#deebff' })(p(strong('ac'))),
                ),
                tr(
                  td({ colspan: 2, background: '#b3d4ff' })(p('ba')),
                  td({ background: '#b3d4ff' })(p('bc')),
                ),
                tr(
                  td({ background: '#4c9aff' })(p('ca')),
                  td({ background: '#4c9aff' })(p('cb')),
                  td({ background: '#4c9aff' })(p('cc')),
                ),
              ),
              p(),
            ),
          ),
        );
      });

      test('should be able to drag 2nd row when there are merged cells in side', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        await editor.selection.set({ anchor: 5, head: 5 });

        const sourceRow = await tableModel.rowDragControls(1);
        const cell = await tableModel.cell(3);

        await cell.hover();
        await sourceRow.dragTo(2, editor);

        await expect(editor).toMatchDocument(
          doc(
            bodiedExtension({
              extensionType: 'com.atlassian.confluence.macro.core',
              extensionKey: 'excerpt',
              layout: 'default',
              localId: 'testId',
              parameters: {
                macroParams: {
                  hidden: {
                    value: 'false',
                  },
                },
              },
            })(
              table({ isNumberColumnEnabled: false, layout: 'default' })(
                tr(
                  th({ background: '#deebff' })(p(strong('aa'))),
                  th({ background: '#deebff' })(p(strong('ab'))),
                  th({ background: '#deebff' })(p(strong('ac'))),
                ),
                tr(
                  td({ background: '#4c9aff' })(p('ca')),
                  td({ background: '#4c9aff' })(p('cb')),
                  td({ background: '#4c9aff' })(p('cc')),
                ),
                tr(
                  td({ colspan: 2, background: '#b3d4ff' })(p('ba')),
                  td({ background: '#b3d4ff' })(p('bc')),
                ),
              ),
              p(),
            ),
          ),
        );
      });
    });
  });
});
