import {
  EditorTableModel,
  EditorNodeContainerModel,
  EditorPopupModel,
  editorTestCase as test,
  expect,
  fixTest,
} from '@af/editor-libra';
import { tableWithScoll } from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
      stickyHeaders: true,
    },
    allowStatus: true,
    featureFlags: {
      stickyHeadersOptimization: true,
    },
  },
  adf: tableWithScoll,
});

test.describe('sticky header', () => {
  test.describe('fixed floating contextual button', async () => {
    test('should hide / show when scrolled outside / inside the bounds of the table', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const scrollAnchor = await nodes.table.locator('[localid="scroll-here"]');
      await scrollAnchor.scrollIntoViewIfNeeded();

      await test.step('set selection in header row first cell and expect fixed contextual button to show', async () => {
        await editor.selection.set({ anchor: 4, head: 4 });
        const stickyHeader = await tableModel.stickyHeader();
        expect(await stickyHeader.isFixedContextButtonVisible()).toBeTruthy();
      });

      await test.step('scroll table and expect fixed contextual button to hide', async () => {
        await tableModel.scrollTable(editor, 300);
        const stickyHeader = await tableModel.stickyHeader();
        expect(await stickyHeader.isFixedContextButtonHidden()).toBeTruthy();
      });

      await test.step('set selection in header row last cell, scroll to the table end and expect fixed contextual button to show', async () => {
        await editor.selection.set({ anchor: 16, head: 16 });
        await tableModel.scrollTable(editor, 2000);
        const stickyHeader = await tableModel.stickyHeader();
        expect(await stickyHeader.isFixedContextButtonVisible()).toBeTruthy();
      });

      await test.step('scroll to the table start and expect fixed contextual button to hide', async () => {
        await tableModel.scrollTable(editor, -2000);
        const stickyHeader = await tableModel.stickyHeader();
        expect(await stickyHeader.isFixedContextButtonHidden()).toBeTruthy();
      });
    });
  });

  test.describe('sync width', () => {
    test('should sync width with table when parent scroll container is resized', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-19015',
        reason: 'TODO: Need to find the cause of flakiness',
      });

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(150);
      await cell.click();

      const layoutModel = await tableModel.layout(editor);
      await layoutModel.toWide();
      await layoutModel.toFullWidth();

      await editor.page.setViewportSize({
        width: 750,
        height: editor.page.viewportSize()!.height,
      });

      const tableBox = await nodes.table
        .locator('table.pm-table-sticky')
        .boundingBox();
      const rowBox = await nodes.table.locator('tr.sticky').boundingBox();

      expect(tableBox?.width).toEqual(rowBox?.width);
    });
  });

  test.describe('numbered columns', () => {
    // ED-16817: Adding column from cell options scrolls table back to top as it resets selection to first cell in new column
    // This causes the sticky header to reset. There were issues with the numbered column syncing with sticky header.
    test('sticky numbered column header should have top style reset when adding column from cell options', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(150);
      await cell.click();

      const cellOptions = await cell.options(EditorPopupModel.from(editor));
      await cellOptions.insertColumn();

      const firstNumberedRow = nodes.table.locator(
        '.pm-table-numbered-column__button:nth-child(1)',
      );
      await expect(firstNumberedRow).toHaveCSS('top', 'auto');
    });
  });
});
