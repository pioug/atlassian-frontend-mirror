import {
  EditorBreakoutModel,
  EditorNodeContainerModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import { nestedInExpandAdf } from './horizontal-scroll-shadow.spec.ts-fixtures';

test.describe('Horizontal scroll shadows of a table nested in expand:', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowBreakout: true,
      allowExpand: true,
      allowTables: {
        advanced: true,
      },
      featureFlags: {
        'table-drag-and-drop': true,
      },
    },
    adf: nestedInExpandAdf,
    platformFeatureFlags: {
      'platform.editor.custom-table-width': true,
    },
  });

  test('should not be visible when expand changes its width', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const breakoutModel = EditorBreakoutModel.from(editor);

    await test.step('to wide', async () => {
      await breakoutModel.toWide();
      expect(await tableModel.hasOverflowed()).toBeFalsy();
      await expect(tableModel.leftShadow).toBeHidden();
      await expect(tableModel.rightShadow).toBeHidden();
    });

    await test.step('to full width', async () => {
      await breakoutModel.toFullWidth();
      expect(await tableModel.hasOverflowed()).toBeFalsy();
      await expect(tableModel.leftShadow).toBeHidden();
      await expect(tableModel.rightShadow).toBeHidden();
    });

    await test.step('to default width', async () => {
      await breakoutModel.toCenter();
      expect(await tableModel.hasOverflowed()).toBeFalsy();
      await expect(tableModel.leftShadow).toBeHidden();
      await expect(tableModel.rightShadow).toBeHidden();
    });
  });
});
