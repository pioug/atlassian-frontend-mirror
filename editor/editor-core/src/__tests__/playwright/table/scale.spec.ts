// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import {
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';

import { createSquareTable } from './__fixtures__/resize-documents';

test.describe('when a table a few min width columns', () => {
  test.describe('and when a new column is insert', () => {
    const squareTable = createSquareTable({
      lines: 3,
      columnWidths: [68, 68, 68, 68, 68, 68, 150, 68, 68],
      hasHeader: true,
    });

    test.use({
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          advanced: true,
        },
      },

      adf: squareTable(sampleSchema).toJSON(),
    });

    test('Should scale remaining columns', async ({ editor }) => {
      fixTest({
        jiraIssueId: 'ED-19724',
        reason:
          'FIXME: This test was automatically skipped due to failure on 24/08/2023: https://product-fabric.atlassian.net/browse/ED-19724',
        browsers: [BROWSERS.webkit],
      });

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(3);

      await cell.click();
      const shortcuts = await tableModel.shortcuts(editor.keyboard);

      await shortcuts.insertColumnAtRight();

      await expect(editor).toMatchDocument(
        createSquareTable({
          lines: 3,
          columnWidths: [57, 61, 61, 61, 140, 61, 61, 136, 61, 61],
          hasHeader: true,
        }),
      );
    });

    test('Should not overflow', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(3);

      await cell.click();
      const shortcuts = await tableModel.shortcuts(editor.keyboard);

      await shortcuts.insertColumnAtRight();

      expect(await tableModel.hasOverflowed()).toBeFalsy();
    });
  });
});

test.describe('when a table there is no space left to scale the columns', () => {
  const squareTable = createSquareTable({
    lines: 3,
    columnWidths: [84, 118, 50, 90, 84, 150, 48, 48, 48, 48, 200],
    hasHeader: true,
  });

  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
    },

    adf: squareTable(sampleSchema).toJSON(),
  });

  test.describe('and when a new column is insert', () => {
    test('Should overflow', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(4);

      await cell.click();
      const shortcuts = await tableModel.shortcuts(editor.keyboard);

      await shortcuts.insertColumnAtRight();

      expect(await tableModel.hasOverflowed()).toBeTruthy();
    });
  });
});
