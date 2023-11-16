import {
  editorTestCase as test,
  expect,
  EditorMainToolbarModel,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, subsup } from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('menu selection', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test('text formatting: menu should close when more options is chosen by mouse', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    const moreFormattingMenu = await toolbar.openMoreFormattingMenu();
    await moreFormattingMenu.clickAt('Underline');
    await expect(moreFormattingMenu.menu).toBeHidden();
  });

  test('text formatting: menu should remain open when more options is chosen by keyboard', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    const moreFormattingMenu = await toolbar.openMoreFormattingMenu();
    await expect(moreFormattingMenu.menu).toBeVisible();
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('Enter');
    await expect(moreFormattingMenu.menu).toBeVisible();
  });
});

test.describe('sub-super-script', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
    adf: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Will not load',
              marks: [
                {
                  type: 'subsup',
                  attrs: {
                    type: 'sup',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  });

  test('text formatting: It can load a document with super script on first line', async ({
    editor,
  }) => {
    await expect(editor).toMatchDocument(
      doc(p(subsup({ type: 'sup' })('Will not load'))),
    );
  });
});
