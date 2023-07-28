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

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
  adf: tablesWithDifferentColumns,
  platformFeatureFlags: { 'platform.editor.custom-table-width': true },
});

test.describe('resizing a table', () => {
  test('should limit minimum width if resizing in 3 column', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-19257, ED-19268, ED-19279',
      reason:
        'FIXME: This test was automatically skipped due to failure on 28/07/2023: https://product-fabric.atlassian.net/browse/ED-19257',
      browsers: [BROWSERS.chromium, BROWSERS.firefox, BROWSERS.webkit],
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const tableLocator = nodes.table.nth(0);
    const threeColumnTable = EditorTableModel.from(tableLocator);
    const resizerModel = threeColumnTable.resizer();

    await resizerModel.resize({
      mouse: editor.page.mouse,
      moveDistance: -1000,
    });

    expect(await resizerModel.containerWidth()).toBe(MIN_COLUMN_WIDTH * 3);
    expect(await threeColumnTable.containerWidth()).toBe(MIN_COLUMN_WIDTH * 3);
  });

  test('should limit minimum width if resizing in 2 column', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-19258, ED-19269, ED-19280',
      reason:
        'FIXME: This test was automatically skipped due to failure on 28/07/2023: https://product-fabric.atlassian.net/browse/ED-19258',
      browsers: [BROWSERS.chromium, BROWSERS.firefox, BROWSERS.webkit],
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const tableLocator = nodes.table.nth(1);
    const twoColumnTable = EditorTableModel.from(tableLocator);
    const resizerModel = twoColumnTable.resizer();

    await resizerModel.resize({
      mouse: editor.page.mouse,
      moveDistance: -1000,
    });

    expect(await resizerModel.containerWidth()).toBe(MIN_COLUMN_WIDTH * 2);
    expect(await twoColumnTable.containerWidth()).toBe(MIN_COLUMN_WIDTH * 2);
  });

  test('should limit minimum width if resizing in 1 column', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-19259, ED-19270, ED-19281',
      reason:
        'FIXME: This test was automatically skipped due to failure on 28/07/2023: https://product-fabric.atlassian.net/browse/ED-19259',
      browsers: [BROWSERS.chromium, BROWSERS.firefox, BROWSERS.webkit],
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const tableLocator = nodes.table.nth(2);
    const oneColumnTable = EditorTableModel.from(tableLocator);
    const resizerModel = oneColumnTable.resizer();

    await resizerModel.resize({
      mouse: editor.page.mouse,
      moveDistance: -1000,
    });

    expect(await resizerModel.containerWidth()).toBe(MIN_COLUMN_WIDTH);
    expect(await oneColumnTable.containerWidth()).toBe(MIN_COLUMN_WIDTH);
  });

  // more than 3 columns should have limitation as 3 columns
  test('should reach minimum width if resizing in 5 column', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-19261, ED-19271, ED-19282',
      reason:
        'FIXME: This test was automatically skipped due to failure on 28/07/2023: https://product-fabric.atlassian.net/browse/ED-19261',
      browsers: [BROWSERS.chromium, BROWSERS.firefox, BROWSERS.webkit],
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const tableLocator = nodes.table.nth(3);
    const fiveColumn = EditorTableModel.from(tableLocator);
    const resizerModel = fiveColumn.resizer();

    await resizerModel.resize({
      mouse: editor.page.mouse,
      moveDistance: -1000,
    });

    expect(await resizerModel.containerWidth()).toBe(MIN_COLUMN_WIDTH * 3);
    expect(await fiveColumn.containerWidth()).toBe(MIN_COLUMN_WIDTH * 3);
  });

  test('should reach maximum width if resizing in 3 column', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-19262, ED-19272, ED-19283',
      reason:
        'FIXME: This test was automatically skipped due to failure on 28/07/2023: https://product-fabric.atlassian.net/browse/ED-19262',
      browsers: [BROWSERS.chromium, BROWSERS.firefox, BROWSERS.webkit],
    });

    await editor.page.setViewportSize({ width: 2000, height: 1024 });
    await editor.waitForEditorStable();
    const nodes = EditorNodeContainerModel.from(editor);
    const tableLocator = nodes.table.nth(4);
    const fiveColumn = EditorTableModel.from(tableLocator);
    const resizerModel = fiveColumn.resizer();

    await resizerModel.resize({
      mouse: editor.page.mouse,
      moveDistance: 1500,
    });

    expect(await resizerModel.containerWidth()).toBe(MAX_COLUMN_WIDTH);
    expect(await fiveColumn.containerWidth()).toBe(MAX_COLUMN_WIDTH);
  });
});
