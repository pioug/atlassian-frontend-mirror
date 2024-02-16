import {
  EditorNodeContainerModel,
  EditorPopupModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import { tableWithScroll } from './__fixtures__/base-adfs';
import {
  simpleTableWithScroll,
  tableInLayout,
  tableWithMultipleHeaderRows,
  tableWithMultipleMergedHeaderRows,
} from './sticky-header.spec.ts-fixtures';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
      stickyHeaders: true,
    },
    allowStatus: true,
    allowLayouts: true,
  },
  adf: tableWithScroll,
});

test.describe('sticky header', () => {
  test.describe('fixed floating contextual button', async () => {
    test('should hide / show when scrolled outside / inside the bounds of the table', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const scrollAnchor = nodes.table.locator('[localid="scroll-here"]');
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

      const stickyModel = await tableModel.stickyHeader();
      await stickyModel.waitForRowStable();

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
    // FIXME: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2257574/steps/%7B7f583bb9-62c8-45f0-9ce4-9dce1a495739%7D/test-report
    test.skip('sticky numbered column header should have top style reset when adding column from cell options', async ({
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

  test.describe('floating insert column button', async () => {
    test('should be visible when sticky header is enabled', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const scrollAnchor = nodes.table.locator('[localid="scroll-here"]');
      await scrollAnchor.scrollIntoViewIfNeeded();

      const columnControls = await tableModel.columnControls({ index: 0 });
      await columnControls.hover();

      expect(await columnControls.isInsertColumnButtonVisible()).toBeTruthy();
    });
  });

  test.describe('sync width', () => {
    test.use({
      adf: simpleTableWithScroll,
      platformFeatureFlags: { 'platform.editor.custom-table-width': true },
    });

    test('should sync width with table while table is resizing', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const resizerModel = tableModel.resizer();

      const bottom = editor.page.getByText('Bottom');
      await bottom.scrollIntoViewIfNeeded();

      const cell = await tableModel.cell(23);
      await cell.click();

      await resizerModel.resizeAndHold(
        {
          mouse: editor.page.mouse,
          moveDistance: 100,
        },
        false,
      );

      const stickyModel = await tableModel.stickyHeader();
      await stickyModel.waitForRowStable();

      const tableBox = await nodes.table
        .locator('table.pm-table-sticky')
        .boundingBox();
      const rowBox = await nodes.table.locator('tr.sticky').boundingBox();

      expect(tableBox?.width).toEqual(rowBox?.width);
    });
  });

  test.describe('table with scroll', () => {
    test.use({
      adf: simpleTableWithScroll,
    });
    test('Sticky header should correctly toggle on and off', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const stickyModel = await tableModel.stickyHeader();

      await expect(tableModel.tableElement).not.toHaveClass('pm-table-sticky');
      await expect(stickyModel.stickyRow).toBeHidden();

      const bottom = editor.page.getByText('Bottom');
      await bottom.scrollIntoViewIfNeeded();

      await expect(tableModel.tableElement).toHaveClass('pm-table-sticky');
      await expect(stickyModel.stickyRow).toBeVisible();
    });

    test('Sticky header should still correctly toggle on and off, after a column has been added', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const stickyModel = await tableModel.stickyHeader();

      await expect(tableModel.tableElement).not.toHaveClass('pm-table-sticky');
      await expect(stickyModel.stickyRow).toBeHidden();

      const cell = await tableModel.cell(0);
      await cell.click();
      const shortcuts = await tableModel.shortcuts(editor.keyboard);
      await shortcuts.insertColumnAtRight();

      const bottom = editor.page.getByText('Bottom');
      await bottom.scrollIntoViewIfNeeded();

      await expect(tableModel.tableElement).toHaveClass('pm-table-sticky');
      await expect(stickyModel.stickyRow).toBeVisible();
    });
  });

  test.describe('tables with multiple headers', () => {
    test.use({
      adf: tableWithMultipleHeaderRows,
    });

    test('should only have the first header be sticky', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table.nth(0));
      const stickyModel = await tableModel.stickyHeader();

      await expect(tableModel.tableElement).not.toHaveClass('pm-table-sticky');
      await expect(stickyModel.stickyRow).toBeHidden();

      const scrollAnchor = nodes.table.locator('[localid="scroll-here"]');
      await scrollAnchor.scrollIntoViewIfNeeded();

      await expect(tableModel.tableElement).toHaveClass('pm-table-sticky');
      await expect(stickyModel.stickyRow).toBeVisible();
      await expect(stickyModel.stickyRow).toHaveText('FirstHeaderRow');
    });
  });

  test.describe('tables with multiple merged headers', () => {
    test.use({
      adf: tableWithMultipleMergedHeaderRows,
    });

    test('should not have sticky header', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table.nth(0));
      const stickyModel = await tableModel.stickyHeader();

      const scrollAnchor = nodes.table.locator('[localid="scroll-here"]');
      await scrollAnchor.scrollIntoViewIfNeeded();

      await expect(tableModel.tableElement).not.toHaveClass('pm-table-sticky');
      await expect(stickyModel.stickyRow).toBeHidden();
    });
  });

  test.describe('tables inside layout node', () => {
    test.use({
      adf: tableInLayout,
    });

    test('should have sticky header', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table.nth(0));
      const stickyModel = await tableModel.stickyHeader();

      const scrollAnchor = nodes.table.locator('[localid="scroll-here"]');
      await scrollAnchor.scrollIntoViewIfNeeded();

      await expect(tableModel.tableElement).toHaveClass('pm-table-sticky');
      await expect(stickyModel.stickyRow).toBeVisible();
    });
  });
});
