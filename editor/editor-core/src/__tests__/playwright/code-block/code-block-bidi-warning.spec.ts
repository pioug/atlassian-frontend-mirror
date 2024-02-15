import {
  EditorCodeBidiWarningTooltipModel,
  EditorCodeBlockModel,
  EditorMainToolbarModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

const codeWithBidi = '// has bidi chars ‮';

test.describe('code bidi warning plugin', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test('code-block: warns user about bidirectional language support', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const codeBlock = EditorCodeBlockModel.from(nodes.codeBlock);
    const toolbar = EditorMainToolbarModel.from(editor);
    const codeBidiTooltip = EditorCodeBidiWarningTooltipModel.from(editor);

    await toolbar.clickAt('Code snippet');
    await editor.keyboard.type(codeWithBidi);

    // Check the character is highlighted
    const bidiChar = codeBlock.codeBidiCharacter.first();
    await bidiChar.waitFor({ state: 'visible' });
    await expect(bidiChar).toBeVisible();

    // Check the tooltip
    await bidiChar.hover();
    await codeBidiTooltip.waitForStable();
    await expect(codeBidiTooltip.codeBidiCharacterTooltip).toBeVisible();
  });
});
