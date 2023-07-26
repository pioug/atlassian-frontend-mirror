import {
  EditorNodeContainerModel,
  EditorTableModel,
  EditorPopupModel,
  EditorFloatingToolbarModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import {
  simpleTableWithOneParagraphAfter,
  nestedTables,
  tableWithWidthAttributeAndLayout,
} from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
  adf: simpleTableWithOneParagraphAfter,
  platformFeatureFlags: { 'platform.editor.custom-table-width': true },
});

test.describe('resizing a table', () => {
  test('handle should be show and hide when hovering', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const resizerModel = tableModel.resizer();

    // Move selection and mouse away
    await editor.page.mouse.move(100, 600, { steps: 10 });
    await editor.selection.set({ anchor: 45, head: 45 });

    await test.step('resizer handle should not be visible', async () => {
      expect(await resizerModel.waitForHandleToBeHidden()).toBeTruthy();
    });

    await tableModel.hoverBody();

    await test.step('resizer handle should be visible', async () => {
      expect(await resizerModel.waitForHandleToBeVisible()).toBeTruthy();
    });
  });

  test('should resize to correct width and centre when dragging handle larger', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const resizerModel = tableModel.resizer();

    await resizerModel.resize({ mouse: editor.page.mouse, moveDistance: 100 });

    expect(await resizerModel.containerWidth()).toBe(960);
    expect(await resizerModel.containerMarginLeft()).toBe('-100px');
    expect(await tableModel.containerWidth()).toBe(960);
  });

  test('should resize to correct width and centre when dragging handle smaller', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const resizerModel = tableModel.resizer();

    await resizerModel.resize({ mouse: editor.page.mouse, moveDistance: -100 });

    expect(await resizerModel.containerWidth()).toBe(560);
    expect(await resizerModel.containerMarginLeft()).toBe('100px');
    expect(await tableModel.containerWidth()).toBe(560);
  });

  test('should hide the table controls when resizing and show them when finishing', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const resizerModel = tableModel.resizer();
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      tableModel,
    );
    const rowControlModel = await tableModel.rowControls({ index: 1 });
    const columnControlModel = await tableModel.columnControls({ index: 1 });

    const cell = await tableModel.cell(1);
    await cell.click();
    const cellOptions = await cell.options(EditorPopupModel.from(editor));

    await resizerModel.resizeAndHold({
      mouse: editor.page.mouse,
      moveDistance: 5,
    });

    // Expect all controls to be hidden
    expect(await rowControlModel.isHidden()).toBeTruthy();
    expect(await rowControlModel.isCornerControlHidden()).toBeTruthy();
    expect(await columnControlModel.isHidden()).toBeTruthy();
    expect(await cell.isCellOptionsHidden()).toBeTruthy();
    expect(await cellOptions.isVisible()).toBeFalsy();
    expect(await floatingToolbarModel.isVisible()).toBeFalsy();

    await editor.page.mouse.up();

    expect(await rowControlModel.isVisible()).toBeTruthy();
    expect(await rowControlModel.isCornerControlVisible()).toBeTruthy();
    expect(await columnControlModel.isVisible()).toBeTruthy();
    expect(await cell.isCellOptionsVisible()).toBeTruthy();
    expect(await cellOptions.isVisible()).toBeTruthy();
    expect(await floatingToolbarModel.isVisible()).toBeTruthy();
  });

  test('should resize to correct width and snap to closest guideline', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const resizerModel = tableModel.resizer();

    // Before we resize we make sure the current size is what we expect it to be.
    expect(await resizerModel.containerWidth()).toBe(760);

    // 95 is because we want to move it to within 1 pixel of the table snap gap, which at the moment is 3px (1px each side).
    // and since the next closest guideline is 200px (100px at 2x scale) away (ie. 960px wide) we're going to move 100 - 1 pixels.
    // The result of doing this will cause the resize to snap to the guideline.
    await resizerModel.resize({ mouse: editor.page.mouse, moveDistance: 99 });

    expect(await resizerModel.containerWidth()).toBe(960);
    expect(await tableModel.containerWidth()).toBe(960);
  });

  // FIXME: This test was manually skipped due to flakiness: https://atlassian.slack.com/archives/C05F7EJ6C0L/p1690349111624389
  test.fixme(
    "should resize to the closest guideline and back to it's original size correctly",
    async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const resizerModel = tableModel.resizer();

      // Before we resize we make sure the current size is what we expect it to be.
      expect(await resizerModel.containerWidth()).toBe(760);

      await resizerModel.resize({ mouse: editor.page.mouse, moveDistance: 99 });

      expect(await resizerModel.containerWidth()).toBe(960);

      await resizerModel.resizeAndHold({
        mouse: editor.page.mouse,
        moveDistance: -99,
      });

      // IMPORTANT: We need to ensure that no margin is being applied before we release the up button.
      expect(await resizerModel.containerMarginLeft()).toBe('0px');

      await editor.page.mouse.up();

      expect(await resizerModel.containerMarginLeft()).toBe('0px');
      // NOTE: the widths are not committed until after the mouse up has occured.
      expect(await resizerModel.containerWidth()).toBe(760);
      expect(await tableModel.containerWidth()).toBe(760);
    },
  );
});

test.describe('rendering table width', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
    },
    adf: tableWithWidthAttributeAndLayout,
    platformFeatureFlags: { 'platform.editor.custom-table-width': true },
  });

  test('should use width attribute over layout attribute to render table', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    expect(await tableModel.containerWidth()).toBe(1200);
  });
});

test.describe('table nested', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowLayouts: true,
      allowExtension: true,
      allowExpand: true,
      allowTables: {
        advanced: true,
      },
    },
    adf: nestedTables,
    platformFeatureFlags: { 'platform.editor.custom-table-width': true },
  });

  const nestedTableSet = [
    {
      name: 'expand',
      index: 0,
    },
    {
      name: 'layout',
      index: 1,
    },
    {
      name: 'extension',
      index: 2,
    },
  ];

  nestedTableSet.forEach(({ name, index }) => {
    test(`in ${name}:`, async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      let tableLocator = nodes.table.nth(index);
      let tableModel = EditorTableModel.from(tableLocator);
      let resizerModel = tableModel.resizer();

      // Move selection and mouse away
      await editor.page.mouse.move(100, 600, { steps: 10 });
      await editor.selection.set({ anchor: 191, head: 191 });

      await test.step(`should not have resize handle visible without hover`, async () => {
        expect(await resizerModel.waitForHandleToBeHidden()).toBeTruthy();
      });
      await tableModel.hoverBody();
      await test.step(`should not have resize handle visible when hovered`, async () => {
        expect(await resizerModel.waitForHandleToBeHidden()).toBeTruthy();
      });
    });
  });

  test('in document without other parent nodes', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    let tableLocator = nodes.table.nth(3);
    let tableModel = EditorTableModel.from(tableLocator);
    let resizerModel = tableModel.resizer();

    // Move selection and mouse away
    await editor.page.mouse.move(100, 600, { steps: 10 });
    await editor.selection.set({ anchor: 191, head: 191 });

    await test.step(`should not have resize handle visible without hover`, async () => {
      expect(await resizerModel.waitForHandleToBeHidden()).toBeTruthy();
    });
    await tableModel.hoverBody();
    await test.step(`should have resize handle visible when hovered`, async () => {
      expect(await resizerModel.waitForHandleToBeVisible()).toBeTruthy();
    });
  });
});
