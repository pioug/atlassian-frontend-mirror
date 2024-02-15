import {
  EditorNodeContainerModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  strong,
  table,
  td,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  simpleTable,
  simpleTableWithMergedCell,
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
  },
  adf: simpleTable,
  platformFeatureFlags: {
    'platform.editor.custom-table-width': true,
  },
});

test.describe('drag and drop', () => {
  test.describe('row', () => {
    test.describe('basic functionality', () => {
      test('should be able to drag first row and drop on second row', async ({
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
            table({
              isNumberColumnEnabled: false,
              layout: 'default',
              localId: 'abc-123',
              // @ts-ignore
              width: null,
            })(
              tr(
                th({ background: '#ffffff' })(p('ba')),
                th({ background: '#ffffff' })(p('bb')),
                th({ background: '#ffffff' })(p('bc')),
              ),
              tr(
                td({ background: '#ffffff' })(p(strong('aa'))),
                td({ background: '#ffffff' })(p(strong('ab'))),
                td({ background: '#ffffff' })(p(strong('ac'))),
              ),
              tr(
                td({ background: '#ffffff' })(p('ca')),
                td({ background: '#ffffff' })(p('cb')),
                td({ background: '#ffffff' })(p('cc')),
              ),
            ),
            p(),
          ),
        );
      });
    });

    test.describe('extended drop zones', () => {
      test('should be able to drag first row and drop on second row outside the table border', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const firstRow = await tableModel.rowDragControls(0);
        const secondRow = await tableModel.rowDragControls(1);
        const cell = await tableModel.cell(0);

        await cell.hover();

        const cellBoundingBox = await cell.getBoundingBox();

        // need to drag to trigger render of drop zones
        await firstRow.drag(
          { x: cellBoundingBox!.x + 10, y: cellBoundingBox!.y },
          editor,
        );

        await test.step('drop targets should be visible', async () => {
          expect(await secondRow.isDropTargetVisible()).toBeTruthy();
        });

        const dropTargetBoundingBox = await secondRow.dropTargetBoundingBox();

        // move mouse to correct position - use this instead of hover to ensure cursor is outside table
        // the extended drop target is 150px wide, 80 here will ensure we're over the middle of it
        await editor.page.mouse.move(
          dropTargetBoundingBox!.x + 80,
          dropTargetBoundingBox!.y + dropTargetBoundingBox!.height / 1.25,
        );

        await firstRow.drop(editor);

        await expect(editor).toMatchDocument(
          doc(
            table({ isNumberColumnEnabled: false, layout: 'default' })(
              tr(
                th({ background: '#ffffff' })(p('ba')),
                th({ background: '#ffffff' })(p('bb')),
                th({ background: '#ffffff' })(p('bc')),
              ),
              tr(
                td({ background: '#ffffff' })(p(strong('aa'))),
                td({ background: '#ffffff' })(p(strong('ab'))),
                td({ background: '#ffffff' })(p(strong('ac'))),
              ),
              tr(
                td({ background: '#ffffff' })(p('ca')),
                td({ background: '#ffffff' })(p('cb')),
                td({ background: '#ffffff' })(p('cc')),
              ),
            ),
            p(),
          ),
        );
      });
    });

    test.describe('table with merged cells', () => {
      test.use({
        adf: simpleTableWithMergedCell,
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
                th({ rowspan: 2, background: '#deebff' })(
                  p(strong('aa')),
                  p('ba'),
                ),
                th({ background: '#deebff' })(p(strong('ab'))),
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
  });

  test.describe('column', () => {
    test.describe('basic functionality', () => {
      test('should be able to drag first column and drop on second column', async ({
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
                th({ background: '#ffffff' })(p(strong('ab'))),
                th({ background: '#ffffff' })(p(strong('aa'))),
                th({ background: '#ffffff' })(p(strong('ac'))),
              ),
              tr(
                td({ background: '#ffffff' })(p('bb')),
                td({ background: '#ffffff' })(p('ba')),
                td({ background: '#ffffff' })(p('bc')),
              ),
              tr(
                td({ background: '#ffffff' })(p('cb')),
                td({ background: '#ffffff' })(p('ca')),
                td({ background: '#ffffff' })(p('cc')),
              ),
            ),
            p(),
          ),
        );
      });
    });

    test.describe('extended drop zones', () => {
      test('should be able to drag first column and drop on second column outside the table border', async ({
        editor,
      }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const tableModel = EditorTableModel.from(nodes.table);
        const firstColumn = await tableModel.columnDragControls(0);
        const secondColumn = await tableModel.columnDragControls(1);
        const cell = await tableModel.cell(0);

        await cell.hover();

        const cellBoundingBox = await cell.getBoundingBox();

        // need to drag to trigger render of drop zones
        await firstColumn.drag(
          { x: cellBoundingBox!.x + 10, y: cellBoundingBox!.y },
          editor,
        );

        await test.step('drop targets should be visible', async () => {
          expect(await secondColumn.isExtendedDropTargetVisible()).toBeTruthy();
        });

        const dropTargetBoundingBox =
          await secondColumn.extendedDropTargetBoundingBox();

        // // move mouse to correct position - use this instead of hover to ensure cursor is outside table
        await editor.page.mouse.move(
          dropTargetBoundingBox!.x + dropTargetBoundingBox!.width / 2 + 5,
          dropTargetBoundingBox!.y + dropTargetBoundingBox!.height / 1.25,
        );

        await firstColumn.drop(editor);

        await expect(editor).toMatchDocument(
          doc(
            table({ isNumberColumnEnabled: false, layout: 'default' })(
              tr(
                th({ background: '#ffffff' })(p(strong('ab'))),
                th({ background: '#ffffff' })(p(strong('aa'))),
                th({ background: '#ffffff' })(p(strong('ac'))),
              ),
              tr(
                td({ background: '#ffffff' })(p('bb')),
                td({ background: '#ffffff' })(p('ba')),
                td({ background: '#ffffff' })(p('bc')),
              ),
              tr(
                td({ background: '#ffffff' })(p('cb')),
                td({ background: '#ffffff' })(p('ca')),
                td({ background: '#ffffff' })(p('cc')),
              ),
            ),
            p(),
          ),
        );
      });
    });

    test.describe('table with merged cells', () => {
      test.use({
        adf: simpleTableWithMergedCell,
      });
      test('should not be able to drag first column when there are merged cells', async ({
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
                th({ rowspan: 2, background: '#deebff' })(
                  p(strong('aa')),
                  p('ba'),
                ),
                th({ background: '#deebff' })(p(strong('ab'))),
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
  });
});
