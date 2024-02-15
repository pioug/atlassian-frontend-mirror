import {
  EditorMainToolbarModel,
  EditorPopupModel,
  EditorTableSelectorModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  strong,
  table,
  td,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
  platformFeatureFlags: {
    'platform.editor.insert-block.table-selector-button': true,
  },
});

test.describe('Toolbar TableSelector', () => {
  test('should open table selector popup from toolbar', async ({ editor }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Table size');

    const popup = EditorPopupModel.from(editor);

    const tableSelector = EditorTableSelectorModel.from(popup);
    await tableSelector.toBeVisible();
    await expect(tableSelector.popup).toBeVisible();
  });

  test('table selector popup should close when screen has small width', async ({
    editor,
  }) => {
    // Sets window width to start wide
    await editor.page.setViewportSize({ width: 1000, height: 750 });

    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Table size');

    const popup = EditorPopupModel.from(editor);

    const tableSelector = EditorTableSelectorModel.from(popup);
    await tableSelector.toBeVisible();
    await expect(tableSelector.popup).toBeVisible();

    // Update window size to smaller width.
    await editor.page.setViewportSize({ width: 400, height: 750 });

    await tableSelector.toBeHidden();
    await expect(tableSelector.popup).toBeHidden();
  });

  test('insert a table using the table selector popup', async ({ editor }) => {
    const column = 4;
    const row = 5;

    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Table size');

    const popup = EditorPopupModel.from(editor);

    const tableSelector = EditorTableSelectorModel.from(popup);
    await tableSelector.toBeVisible();
    await tableSelector.insertTableFromSelector(row, column);
    await expect(tableSelector.popup).toBeHidden();
    await expect(editor).toMatchDocument(
      doc(
        table()(
          tr(th().any, th().any, th().any, th().any),
          tr(td().any, td().any, td().any, td().any),
          tr(td().any, td().any, td().any, td().any),
          tr(td().any, td().any, td().any, td().any),
          tr(td().any, td().any, td().any, td().any),
        ),
      ),
    );
  });

  test('should be able to type in a new table after inserted via the table selector popup', async ({
    editor,
  }) => {
    const column = 4;
    const row = 3;

    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Table size');

    const popup = EditorPopupModel.from(editor);

    const tableSelector = EditorTableSelectorModel.from(popup);
    await tableSelector.toBeVisible();
    await tableSelector.insertTableFromSelector(row, column);
    await editor.keyboard.type('a');

    await expect(editor).toMatchDocument(
      doc(
        table()(
          tr(th()(p(strong('a'))), th().any, th().any, th().any),
          tr(td().any, td().any, td().any, td().any),
          tr(td().any, td().any, td().any, td().any),
        ),
      ),
    );

    await expect(tableSelector.popup).toBeHidden();
  });

  test('table selector should expand for selections bigger than default size', async ({
    editor,
  }) => {
    const column = 4;
    const row = 5;

    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Table size');

    const popup = EditorPopupModel.from(editor);

    const tableSelector = EditorTableSelectorModel.from(popup);
    await tableSelector.toBeVisible();
    await tableSelector.hoverTableSelectorButton(row, column);
    await tableSelector.insertTableFromSelector(row + 1, column);

    await expect(editor).toMatchDocument(
      doc(
        table()(
          tr(th().any, th().any, th().any, th().any),
          tr(td().any, td().any, td().any, td().any),
          tr(td().any, td().any, td().any, td().any),
          tr(td().any, td().any, td().any, td().any),
          tr(td().any, td().any, td().any, td().any),
          tr(td().any, td().any, td().any, td().any),
        ),
      ),
    );

    await expect(tableSelector.popup).toBeHidden();
  });

  test('should have correct selected rows and columns displayed at the bottom when hovered', async ({
    editor,
  }) => {
    const column = 4;
    const row = 5;

    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Table size');

    const popup = EditorPopupModel.from(editor);

    const tableSelector = EditorTableSelectorModel.from(popup);
    await tableSelector.toBeVisible();
    await tableSelector.hoverTableSelectorButton(row, column);

    await expect(tableSelector.tableSelectorPopupText).toHaveText(
      `${row} x ${column}`,
    );
  });
  test('table selector should insert table using keyboard', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Table size');

    const popup = EditorPopupModel.from(editor);

    const tableSelector = EditorTableSelectorModel.from(popup);
    await tableSelector.toBeVisible();

    await editor.keyboard.press('Tab');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(
        table()(
          tr(th().any, th().any, th().any),
          tr(td().any, td().any, td().any),
          tr(td().any, td().any, td().any),
        ),
      ),
    );

    await expect(tableSelector.popup).toBeHidden();
  });

  test('table selector keyboard mode should remove mouse selection', async ({
    editor,
  }) => {
    const column = 4;
    const row = 5;

    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Table size');

    const popup = EditorPopupModel.from(editor);

    const tableSelector = EditorTableSelectorModel.from(popup);
    await tableSelector.toBeVisible();
    await tableSelector.hoverTableSelectorButton(row, column);

    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Enter');

    await expect(editor).toMatchDocument(doc(table()(tr(th().any))));

    await expect(tableSelector.popup).toBeHidden();
  });

  test('keyboard selection should display correct rows and columns at the bottom', async ({
    editor,
  }) => {
    const column = 3;
    const row = 4;

    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Table size');

    const popup = EditorPopupModel.from(editor);

    const tableSelector = EditorTableSelectorModel.from(popup);
    await tableSelector.toBeVisible();

    await editor.keyboard.press('Tab');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');

    await expect(tableSelector.tableSelectorPopupText).toHaveText(
      `${row} x ${column}`,
    );
  });
});
