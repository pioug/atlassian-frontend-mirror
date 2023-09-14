import {
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';

import {
  createSquareTable,
  tableNestedInExpandDefaultWidth,
  tableNestedInExpandFullWidth,
} from './__fixtures__/resize-documents';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

import { tableNewColumnMinWidth } from '@atlaskit/editor-common/styles';

const getTableADF = ({
  columnWidths,
  tableWidth,
}: {
  columnWidths: number[];
  tableWidth: number;
}) => {
  return createSquareTable({
    lines: 3,
    columnWidths,
    hasHeader: true,
    tableWidth,
  })(sampleSchema).toJSON();
};

test.use({
  editorProps: {
    appearance: 'full-page',
    allowBreakout: true,
    allowExpand: true,
    allowTables: {
      advanced: true,
    },
  },
  adf: getTableADF({ columnWidths: [63, 181, 104], tableWidth: 350 }),
  platformFeatureFlags: { 'platform.editor.custom-table-width': true },
});

test.describe('New column created in a table with resized columns', () => {
  test.describe('when table width is smaller than default', () => {
    test(`should have width of ${tableNewColumnMinWidth}px`, async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(0);
      await cell.click();

      const shortcuts = await tableModel.shortcuts(editor.keyboard);
      await shortcuts.insertColumnAtRight();

      await expect(editor).toMatchDocument(
        createSquareTable({
          lines: 3,
          columnWidths: [48, tableNewColumnMinWidth, 108, 54],
          hasHeader: true,
          tableWidth: 350,
        }),
      );
    });

    test(`should not overflow`, async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(0);
      await cell.click();

      const shortcuts = await tableModel.shortcuts(editor.keyboard);
      await shortcuts.insertColumnAtRight();

      const hasOverflowed = await tableModel.hasOverflowed();
      expect(hasOverflowed).toBeFalsy();
    });
  });

  test.describe('when table width is default', () => {
    test.use({
      adf: getTableADF({ columnWidths: [79, 427, 253], tableWidth: 760 }),
    });

    test(`should have width of ${tableNewColumnMinWidth}px`, async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(0);
      await cell.click();

      const shortcuts = await tableModel.shortcuts(editor.keyboard);
      await shortcuts.insertColumnAtRight();

      await expect(editor).toMatchDocument(
        createSquareTable({
          lines: 3,
          columnWidths: [59, tableNewColumnMinWidth, 354, 207],
          hasHeader: true,
          tableWidth: 760,
        }),
      );
    });
  });

  test.describe('when table width is larger than default', () => {
    test.use({
      adf: createSquareTable({
        lines: 3,
        columnWidths: [125, 464, 1208],
        hasHeader: true,
        tableWidth: 1800,
      })(sampleSchema).toJSON(),
    });

    test(`should have width of ${tableNewColumnMinWidth}px`, async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(0);
      await cell.click();

      const shortcuts = await tableModel.shortcuts(editor.keyboard);
      await shortcuts.insertColumnAtRight();

      await expect(editor).toMatchDocument(
        createSquareTable({
          lines: 3,
          columnWidths: [113, tableNewColumnMinWidth, 428, 1119],
          hasHeader: true,
          tableWidth: 1800,
        }),
      );
    });
  });

  test.describe('when table is nested in expand default width', () => {
    test.use({
      adf: tableNestedInExpandDefaultWidth,
    });

    test('should display correctly', async ({ editor }) => {
      fixTest({
        jiraIssueId: 'ED-19387',
        reason:
          'FIXME: This test was automatically skipped due to failure on 07/08/2023: https://product-fabric.atlassian.net/browse/ED-19387',
        browsers: [BROWSERS.webkit],
      });

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(0);
      await cell.click();

      const shortcuts = await tableModel.shortcuts(editor.keyboard);
      await shortcuts.insertColumnAtRight();

      const hasOverflowed = await tableModel.hasOverflowed();
      expect(hasOverflowed).toBeFalsy();

      await expect(editor).toMatchDocumentSnapshot();
    });
  });

  test.describe('when table is nested in expand full width', () => {
    test.use({
      adf: tableNestedInExpandFullWidth,
    });

    test('should display correctly', async ({ editor }) => {
      fixTest({
        jiraIssueId: 'ED-19387',
        reason:
          'FIXME: This test was automatically skipped due to failure on 07/08/2023: https://product-fabric.atlassian.net/browse/ED-19387',
        browsers: [BROWSERS.webkit],
      });

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(0);
      await cell.click();

      const shortcuts = await tableModel.shortcuts(editor.keyboard);
      await shortcuts.insertColumnAtRight();

      const hasOverflowed = await tableModel.hasOverflowed();
      expect(hasOverflowed).toBeFalsy();

      await expect(editor).toMatchDocumentSnapshot();
    });
  });
});
