import {
  editorTestCase as test,
  expect,
  EditorFloatingToolbarModel,
  EditorTableModel,
  EditorNodeContainerModel,
} from '@af/editor-libra';
import { simpleTable } from '../table/__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
  adf: simpleTable,
});

test.describe('floating toolbar', () => {
  test('scroll buttons', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      tableModel,
    );
    await editor.page.setViewportSize({ width: 375, height: 700 });
    await editor.selection.set({ anchor: 4, head: 4 });

    const scrollLeftButton = await floatingToolbarModel.scrollLeftButton;
    const scrollRightButton = await floatingToolbarModel.scrollRightButton;

    await test.step('open table options and expect scroll buttons to be disabled', async () => {
      await floatingToolbarModel.toggleTableOptions();

      await expect(scrollLeftButton).toBeDisabled();
      await expect(scrollRightButton).toBeDisabled();

      await floatingToolbarModel.toggleTableOptions();
    });

    await test.step('open color picker and expect scroll buttons to be disabled', async () => {
      await floatingToolbarModel.clickScrollRight();
      await floatingToolbarModel.toggleColorPicker();

      await expect(scrollLeftButton).toBeDisabled();
      await expect(scrollRightButton).toBeDisabled();

      await floatingToolbarModel.toggleColorPicker();
    });

    await test.step('type text in the table and expect the floating toolbar scroll position to be preserved', async () => {
      await editor.keyboard.type('Text');
      await expect(scrollRightButton).toBeDisabled();
    });
  });
});
