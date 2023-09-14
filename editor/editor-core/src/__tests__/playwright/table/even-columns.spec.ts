// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import {
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import { createSquareTable } from './__fixtures__/resize-documents';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
});
test.describe('when a table has custom column width', () => {
  const squareTable = createSquareTable({
    lines: 3,
    columnWidths: [160, 120, 60, 100],
    hasHeader: true,
  });

  test.use({
    adf: squareTable(sampleSchema).toJSON(),
  });

  test('Should even columns on double click on resize handle when table is selected', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    await tableModel.selectTable();

    const cell = await tableModel.cell(1);
    await cell.hoverBorder({ cellSide: 'right' });

    await cell.doubleClickResizeHandler();

    await expect(editor).toMatchDocument(
      createSquareTable({
        lines: 3,
        columnWidths: [110, 110, 110, 110],
        hasHeader: true,
      }),
    );
  });

  test.describe('and when the table has overflowed', () => {
    const squareTableOverflowed = createSquareTable({
      lines: 3,
      columnWidths: [100, 100, 100, 400, 400, 100],
      hasHeader: true,
    });

    test.use({
      adf: squareTableOverflowed(sampleSchema).toJSON(),
    });

    test('Should even columns and remain overflown on double click on resize handle when table is selected', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      await test.step('make sure the table is already overflowed', async () => {
        expect(await tableModel.hasOverflowed()).toBeTruthy();
      });

      await tableModel.selectTable();

      const cell = await tableModel.cell(1);
      await cell.hoverBorder({ cellSide: 'right' });

      await cell.doubleClickResizeHandler();

      expect(await tableModel.hasOverflowed()).toBeTruthy();
      await expect(editor).toMatchDocument(
        createSquareTable({
          lines: 3,
          columnWidths: [200, 200, 200, 200, 200, 200],
          hasHeader: true,
        }),
      );
    });
  });
});
