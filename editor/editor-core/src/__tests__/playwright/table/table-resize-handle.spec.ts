// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import {
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import {
  simpleTable,
  simpleTableWithOneRow,
  simpleTableWithOneRowWithText,
  simpleTableWithTwoRows,
  tablesWithDifferentColumns,
  simpleTableWithScroll,
} from './__fixtures__/base-adfs';
import { createSquareTable } from './__fixtures__/resize-documents';

const tableWithFiftyRows = createSquareTable({
  lines: 50,
  columnWidths: [255, 255, 255],
  hasHeader: true,
})(sampleSchema).toJSON();

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
  adf: simpleTable,
  platformFeatureFlags: { 'platform.editor.custom-table-width': true },
});

const RESIZE_HANDLE_HEIGHT = {
  MIN: 43,
  MEDIUM: 64,
  MAX: 96,
};

test.describe('resize handle height should depend on table height', () => {
  test.describe('when table has three rows', () => {
    test('resize handle height should be minimum', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const resizerModel = tableModel.resizer();
      await tableModel.hoverBody();
      expect(await resizerModel.handleHeight()).toBe(RESIZE_HANDLE_HEIGHT.MAX);
    });
  });

  test.describe('when table has two rows', () => {
    test.use({
      adf: simpleTableWithTwoRows,
    });

    test('resize handle height should be medium', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const resizerModel = tableModel.resizer();
      await tableModel.hoverBody();
      expect(await resizerModel.handleHeight()).toBe(
        RESIZE_HANDLE_HEIGHT.MEDIUM,
      );
    });
  });

  test.describe('when table has one empty row', () => {
    test.use({
      adf: simpleTableWithOneRow,
    });

    test('resize handle height should be minimum', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const resizerModel = tableModel.resizer();
      await tableModel.hoverBody();
      expect(await resizerModel.handleHeight()).toBe(RESIZE_HANDLE_HEIGHT.MIN);
    });
  });

  test.describe('when table has one row with two lines of text', () => {
    test.use({
      adf: simpleTableWithOneRowWithText,
    });

    test('resize handle height should be medium', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const resizerModel = tableModel.resizer();
      await tableModel.hoverBody();
      expect(await resizerModel.handleHeight()).toBe(
        RESIZE_HANDLE_HEIGHT.MEDIUM,
      );
    });
  });
});

test.describe('resize handle should be visible on hover', () => {
  test.use({
    adf: tableWithFiftyRows,
  });

  test('when a page with a large table', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const resizerModel = tableModel.resizer();

    await test.step('is loaded', async () => {
      await tableModel.hoverBody();
      expect(await resizerModel.waitForHandleToBeVisible()).toBeTruthy();
    });

    await test.step('is scrolled down', async () => {
      await editor.page.mouse.wheel(0, 2000);
      await tableModel.hoverBody();
      expect(await resizerModel.waitForHandleToBeVisible()).toBeTruthy();
    });

    await test.step('is scrolled up', async () => {
      await editor.page.mouse.wheel(0, -4000);
      await tableModel.hoverBody();
      expect(await resizerModel.waitForHandleToBeVisible()).toBeTruthy();
    });
  });
});

test.describe('resize handle should be visible on hover', () => {
  test.use({
    adf: simpleTableWithScroll,
  });
  test('outside the table but within the hover zone', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const resizerModel = tableModel.resizer();

    await test.step('handle should not be visible', async () => {
      expect(await resizerModel.waitForHandleToBeHidden()).toBeTruthy();
    });

    await tableModel.hoverZone.hover({ position: { x: 1, y: 1 } });

    await test.step('handle should  be visible', async () => {
      expect(await resizerModel.waitForHandleToBeVisible()).toBeTruthy();
    });
  });
});

test.describe('resize handle should be visible when table is selected', () => {
  test.use({
    adf: tablesWithDifferentColumns,
  });

  test('with a page with multiple tables', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const firstTableModel = EditorTableModel.from(nodes.table.nth(0));
    const secondTableModel = EditorTableModel.from(nodes.table.nth(1));

    const firstTableResizerModel = firstTableModel.resizer();
    const secondTableResizerModel = secondTableModel.resizer();

    await test.step('only first table is selected', async () => {
      await firstTableModel.selectTable();
      expect(
        await firstTableResizerModel.waitForHandleToBeVisible(),
      ).toBeTruthy();
      expect(
        await secondTableResizerModel.waitForHandleToBeHidden(),
      ).toBeTruthy();
    });

    await test.step('second table is selected', async () => {
      await secondTableModel.selectTable();
      expect(
        await firstTableResizerModel.waitForHandleToBeHidden(),
      ).toBeTruthy();
      expect(
        await secondTableResizerModel.waitForHandleToBeVisible(),
      ).toBeTruthy();
    });
  });
});

test.describe('resize handle shadow', () => {
  test('should show and hide correctly', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const resizerModel = tableModel.resizer();

    await test.step('should show when hovering handle', async () => {
      await resizerModel.hoverHandle();
      expect(await resizerModel.waitForHandleShadowToBeVisible()).toBeTruthy();
    });

    await test.step('show hide when not hovering handle', async () => {
      await tableModel.hoverBody();
      expect(await resizerModel.waitForHandleShadowToBeHidden()).toBeTruthy();
    });
  });
});

test.describe('resize handle should not overlap the table', () => {
  test('when table has three rows', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const resizerModel = tableModel.resizer();
    await tableModel.hoverBody();

    const handle = await resizerModel.handleBoundingBox();
    const container = await resizerModel.containerBoundingBox();

    expect(handle).toBeDefined();
    expect(container).toBeDefined();
    expect(handle?.x ?? 0).toBeGreaterThan(0);
    expect(container?.x ?? 0).toBeGreaterThan(0);
    expect(container?.width ?? 0).toBeGreaterThan(0);

    // This is the real test -- If the handle is less then the container x + w then the handle is overlapping the edge of the table
    // and for table we must ensure that handles are adjacent to the tables.
    expect(container!.x + container!.width).toBeLessThanOrEqual(handle!.x);
  });
});
