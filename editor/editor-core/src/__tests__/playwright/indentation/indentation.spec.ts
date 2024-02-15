import { expect, editorTestCase as test } from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, indentation, p } from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('indentation', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test('should indent when tab is pressed', async ({ editor }) => {
    await editor.keyboard.type('Hello world');
    await editor.keyboard.press('Tab');

    await expect(editor).toHaveDocument(
      doc(p('Hello world', indentation({ level: 1 })())),
    );
  });

  test('should indent to max indentation and no more', async ({ editor }) => {
    await editor.keyboard.type('Hello world');

    // repeat 7 times where max is 6
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');

    await expect(editor).toHaveDocument(
      doc(p('Hello world', indentation({ level: 6 })())),
    );
  });

  test('should not indent backwards when at 0 indentation', async ({
    editor,
  }) => {
    await editor.keyboard.type('Hello world');

    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Shift+Tab');
    await editor.keyboard.press('Shift+Tab');

    await expect(editor).toHaveDocument(doc(p('Hello world')));
  });

  test('should indent back to 0 when at max indentation', async ({
    editor,
  }) => {
    await editor.keyboard.type('Hello world');

    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');
    await editor.keyboard.press('Tab');

    await expect(editor).toHaveDocument(
      doc(p('Hello world', indentation({ level: 6 })())),
    );

    await editor.keyboard.press('Shift+Tab');
    await editor.keyboard.press('Shift+Tab');
    await editor.keyboard.press('Shift+Tab');
    await editor.keyboard.press('Shift+Tab');
    await editor.keyboard.press('Shift+Tab');
    await editor.keyboard.press('Shift+Tab');
    await editor.keyboard.press('Shift+Tab');

    await expect(editor).toHaveDocument(doc(p('Hello world')));
  });
});
