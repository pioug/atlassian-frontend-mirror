import {
  EditorEmojiModel,
  EditorNodeContainerModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';

test.describe('selection', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test('selection.ts: Clicking after an emoji produces a text selection to its right', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const emojiNode = EditorEmojiModel.from(nodes.emoji, editor);
    await emojiNode.search('grinning');
    await editor.keyboard.type(':');
    await expect(nodes.emoji.first()).toBeVisible();

    // Delete empty space after the emoji
    await editor.keyboard.press('Backspace');

    const boundingBox = await nodes.emoji.first().boundingBox();

    const targetX = boundingBox!.x + boundingBox!.width;
    const targetY = boundingBox!.y;
    await editor.page.mouse.move(targetX, targetY);
    await editor.page.mouse.click(targetX, targetY);

    await expect(editor).toHaveSelection({
      anchor: 2,
      head: 2,
      type: 'text',
    });
  });
});
