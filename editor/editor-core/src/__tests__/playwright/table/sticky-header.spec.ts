import {
  EditorTableModel,
  EditorNodeContainerModel,
  EditorPopupModel,
  editorTestCase as test,
  expect,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';
import {
  tableWithScoll,
  simpleTableWithScroll,
} from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
      stickyHeaders: true,
    },
    allowStatus: true,
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
        reason:
          'Test timeout of 30000ms exceeded. locator.hover: Target closed',
        browsers: [BROWSERS.webkit],
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
    test('sticky numbered column header should have top style reset when adding column from cell options', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-19256, ED-19267, ED-19278',
        reason:
          'FIXME: This test was automatically skipped due to failure on 28/07/2023: https://product-fabric.atlassian.net/browse/ED-19256',
        browsers: [BROWSERS.chromium, BROWSERS.firefox, BROWSERS.webkit],
      });

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
      fixTest({
        jiraIssueId: 'ED-19605',
        reason:
          'FIXME: This test was automatically skipped due to failure on 18/08/2023: https://product-fabric.atlassian.net/browse/ED-19605',
        browsers: [BROWSERS.webkit],
      });

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const scrollAnchor = await nodes.table.locator('[localid="scroll-here"]');
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
    // FIXME: Test is failing on master on 22/09/23: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/1707466/steps/%7B5d950a71-3106-4e63-83e2-5b812353912e%7D/test-report
    test.skip('should sync width with table while table is resizing', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-19805',
        reason: 'Flaky test on firefox',
        browsers: [BROWSERS.firefox],
      });

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const resizerModel = tableModel.resizer();

      const bottom = await editor.page.getByText('Bottom');
      bottom.scrollIntoViewIfNeeded();

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
});
