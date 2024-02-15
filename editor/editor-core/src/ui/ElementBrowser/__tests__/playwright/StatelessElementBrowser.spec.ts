import {
  EditorMainToolbarModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { code_block, doc } from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  editorProps: {
    appearance: 'full-width',
    elementBrowser: {
      showModal: true,
      replacePlusMenu: true,
    },
  },
});

test.describe('StatelessElementBrowser', () => {
  test('should add searched element on pressing enter', async ({ editor }) => {
    const { keyboard } = editor;
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Insert elements');
    await keyboard.type('Code Snippet');
    await keyboard.press('Enter');

    // ED-21102 to check if the editor has focus
    await keyboard.type('Hello World');
    await expect(editor).toHaveDocument(doc(code_block()('Hello World')));
  });
});
