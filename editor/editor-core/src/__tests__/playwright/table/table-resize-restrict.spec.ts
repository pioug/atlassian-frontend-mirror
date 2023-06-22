import {
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
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
