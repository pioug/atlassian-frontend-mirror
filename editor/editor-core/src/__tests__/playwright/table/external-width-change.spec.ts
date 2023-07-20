import {
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
import {
  simpleTable,
  simpleTableWithWidthAttribute,
} from './__fixtures__/base-adfs';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
  adf: simpleTableWithWidthAttribute,
  platformFeatureFlags: { 'platform.editor.custom-table-width': true },
});

const adfs: Record<string, any> = {
  width: simpleTableWithWidthAttribute,
  'no width': simpleTable,
};

for (const key in adfs) {
  test.describe(`viewport change when there is ${key} attribute on table`, () => {
    test.use({
      adf: adfs[key],
    });
    test('table should not rescale to fit viewport', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      await test.step('the table is not overflowed at first', async () => {
        expect(await tableModel.hasOverflowed()).toBeFalsy();
        await expect(tableModel.rightShadow).toBeHidden();
      });

      await editor.page.setViewportSize({ width: 600, height: 1024 });
      await editor.waitForEditorStable();

      await test.step('the table should be overflowed', async () => {
        expect(await tableModel.hasOverflowed()).toBeTruthy();
        await expect(tableModel.rightShadow).toBeVisible();
      });
    });
  });
}
