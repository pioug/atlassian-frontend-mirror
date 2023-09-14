import {
  editorTestCase as test,
  expect,
  EditorMainToolbarModel,
  EditorTableModel,
  EditorNodeContainerModel,
} from '@af/editor-libra';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  code_block,
  table,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  editorProps: {
    appearance: 'full-width',
    allowTables: true,
    elementBrowser: {
      showModal: true,
      replacePlusMenu: true,
    },
  },
});

test.describe('code-block with gap-cursor', () => {
  test('Inserting a code-block at gap-cursor should not replace the node after', async ({
    editor,
  }) => {
    const { keyboard } = editor;

    // insert a table
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Table');

    //place cursor before table
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    let cell = await tableModel.cell(0);
    await cell.click();
    await keyboard.press('ArrowLeft');
    await keyboard.press('ArrowLeft');

    //insert code snippet from toolbar
    await toolbar.clickAt('Insert /');
    await editor.waitForEditorStable();
    await keyboard.type('Code Snippet');
    await keyboard.press('Enter');

    await expect(editor).toMatchDocument(
      doc(code_block()(), table()(tr.any, tr.any, tr.any)),
    );
  });
});
