import {
  editorTestCase as test,
  expect,
  EditorMainToolbarModel,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, code_block } from '@atlaskit/editor-test-helpers/doc-builder';

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
    await toolbar.clickAt('Insert /');
    await keyboard.type('Code Snippet');
    await keyboard.press('Enter');

    await expect(editor).toHaveDocument(doc(code_block()()));
  });
});
