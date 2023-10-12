import {
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';
import { tablesWithDifferentColumns } from './__fixtures__/base-adfs';

const MIN_COLUMN_WIDTH = 48;
const MAX_COLUMN_WIDTH = 1800;
const minWidths = {
  oneColumn: MIN_COLUMN_WIDTH + 1,
  twoColumns: MIN_COLUMN_WIDTH * 2 + 1,
  threeColumns: MIN_COLUMN_WIDTH * 3 + 1,
};

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
    allowAnalyticsGASV3: true,
  },
  adf: tablesWithDifferentColumns,
  platformFeatureFlags: { 'platform.editor.custom-table-width': true },
});

test.describe('resizing a table', () => {
  test('should limit minimum width if resizing in 3 column', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-20321',
      reason:
        'FIXME: This test was automatically skipped due to failure on 05/10/2023: https://product-fabric.atlassian.net/browse/ED-20321',
      browsers: [BROWSERS.webkit],
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const tableLocator = nodes.table.nth(0);
    const threeColumnTable = EditorTableModel.from(tableLocator);
    const resizerModel = threeColumnTable.resizer();
    await threeColumnTable.selectTable();

    await resizerModel.resize({
      mouse: editor.page.mouse,
      moveDistance: -1000,
    });

    expect(await resizerModel.containerWidth()).toBe(minWidths.threeColumns);
    expect(await threeColumnTable.containerWidth()).toBe(
      minWidths.threeColumns,
    );
  });

  test('should limit minimum width if resizing in 2 column', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-19850',
      reason:
        'FIXME: This test was automatically skipped due to failure on 04/09/2023: https://product-fabric.atlassian.net/browse/ED-19850',
      browsers: [BROWSERS.webkit],
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const tableLocator = nodes.table.nth(1);
    const twoColumnTable = EditorTableModel.from(tableLocator);
    const resizerModel = twoColumnTable.resizer();
    await twoColumnTable.selectTable();

    await resizerModel.resize({
      mouse: editor.page.mouse,
      moveDistance: -1000,
    });

    expect(await resizerModel.containerWidth()).toBe(minWidths.twoColumns);
    expect(await twoColumnTable.containerWidth()).toBe(minWidths.twoColumns);
  });

  test('should limit minimum width if resizing in 1 column', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-20258',
      reason:
        'FIXME: This test was automatically skipped due to failure on 29/09/2023: https://product-fabric.atlassian.net/browse/ED-20258',
      browsers: [BROWSERS.webkit],
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const tableLocator = nodes.table.nth(2);
    const oneColumnTable = EditorTableModel.from(tableLocator);
    const resizerModel = oneColumnTable.resizer();
    await oneColumnTable.selectTable();

    await resizerModel.resize({
      mouse: editor.page.mouse,
      moveDistance: -1000,
    });

    expect(await resizerModel.containerWidth()).toBe(minWidths.oneColumn);
    expect(await oneColumnTable.containerWidth()).toBe(minWidths.oneColumn);
  });

  // more than 3 columns should have limitation as 3 columns
  test('should reach minimum width if resizing in 5 column', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableLocator = nodes.table.nth(3);
    const fiveColumn = EditorTableModel.from(tableLocator);
    const resizerModel = fiveColumn.resizer();
    await fiveColumn.selectTable();

    await resizerModel.resize({
      mouse: editor.page.mouse,
      moveDistance: -1000,
    });

    expect(await resizerModel.containerWidth()).toBe(minWidths.threeColumns);
    expect(await fiveColumn.containerWidth()).toBe(minWidths.threeColumns);
  });

  // FIXME: This test was manually skipped due to flakiness: https://atlassian.slack.com/archives/C03SZ041DB7/p1692332936293629
  test.fixme(
    'should reach maximum width if resizing in 3 column',
    async ({ editor }) => {
      await editor.page.setViewportSize({ width: 2000, height: 1024 });
      await editor.waitForEditorStable();
      const nodes = EditorNodeContainerModel.from(editor);
      const tableLocator = nodes.table.nth(4);
      const fiveColumn = EditorTableModel.from(tableLocator);
      const resizerModel = fiveColumn.resizer();
      await fiveColumn.selectTable();

      await resizerModel.resize({
        mouse: editor.page.mouse,
        moveDistance: 1500,
      });

      expect(await resizerModel.containerWidth()).toBe(MAX_COLUMN_WIDTH);
      expect(await fiveColumn.containerWidth()).toBe(MAX_COLUMN_WIDTH);
    },
  );
});
