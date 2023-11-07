import {
  editorTestCase as test,
  expect,
  EditorMainToolbarModel,
  EditorNodeContainerModel,
  EditorCodeBlockModel,
  EditorFloatingToolbarModel,
} from '@af/editor-libra';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, code_block } from '@atlaskit/editor-test-helpers/doc-builder';
import type { EditorAppearance } from '@atlaskit/editor-common/types';

const appearances: EditorAppearance[] = ['comment', 'full-page'];

appearances.forEach((appearance) => {
  test.use({
    editorProps: {
      appearance,
    },
  });

  test(`code-block: produces correct ADF after language change for ${appearance}`, async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const codeBlock = EditorCodeBlockModel.from(nodes.codeBlock);
    const toolbar = EditorMainToolbarModel.from(editor);
    const codeBlockToolbar = EditorFloatingToolbarModel.from(editor, codeBlock);

    await toolbar.clickAt('Code snippet');
    await codeBlockToolbar.changeLanguageTo('Javascript');

    await expect(editor).toMatchDocument(
      doc(code_block({ language: 'javascript' })()),
    );
  });

  test(`code-block: code block language is preserved after floating toolbar loses and gains focus for ${appearance}`, async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const codeBlock = EditorCodeBlockModel.from(nodes.codeBlock);
    const toolbar = EditorMainToolbarModel.from(editor);
    const codeBlockToolbar = EditorFloatingToolbarModel.from(editor, codeBlock);

    await toolbar.clickAt('Code snippet');
    await codeBlockToolbar.changeLanguageTo('Javascript');

    // Unfocus code block (so floating toolbar hides)
    await codeBlock.focus();
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');

    await editor.keyboard.type('test paragraph');
    expect(await codeBlockToolbar.isHidden()).toBe(true);

    // Focus code block again
    await codeBlock.focus();

    expect(await codeBlockToolbar.isVisible()).toBe(true);
    expect(await codeBlockToolbar.currentLanguage()).toBe('JavaScript');
  });

  test(`code-block: code block selected language correctly changes when moving selection directly from one code block to another for ${appearance}`, async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const firstCodeBlock = EditorCodeBlockModel.from(nodes.codeBlock.first());
    const toolbar = EditorMainToolbarModel.from(editor);
    const firstCodeBlockToolbar = EditorFloatingToolbarModel.from(
      editor,
      firstCodeBlock,
    );

    await toolbar.clickAt('Code snippet');
    await firstCodeBlockToolbar.changeLanguageTo('Javascript');
    await firstCodeBlock.focus();

    expect(await firstCodeBlockToolbar.currentLanguage()).toBe('JavaScript');

    // Unfocus code block (so floating toolbar hides)
    await firstCodeBlock.focus();
    await editor.keyboard.press('ArrowDown');

    // Insert a second code block
    await toolbar.clickAt('Code snippet');
    const secondCodeBlock = EditorCodeBlockModel.from(nodes.codeBlock.nth(1));
    const secondCodeBlockToolbar = EditorFloatingToolbarModel.from(
      editor,
      secondCodeBlock,
    );
    expect(await secondCodeBlockToolbar.isLanguagePlaceholderVisible()).toBe(
      true,
    );

    await secondCodeBlockToolbar.changeLanguageTo('Arduino');
    expect(await secondCodeBlockToolbar.currentLanguage()).toBe('Arduino');

    // The first should still be javascript when we go back
    await firstCodeBlock.focus();
    expect(await firstCodeBlockToolbar.currentLanguage()).toBe('JavaScript');

    await expect(editor).toMatchDocument(
      doc(
        code_block({ language: 'javascript' })(),
        code_block({ language: 'arduino' })(),
      ),
    );
  });

  test(`code-block: code block selected language correctly changes when moving selection directly from one code block to another where one blocks selected is undefined for ${appearance}`, async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const firstCodeBlock = EditorCodeBlockModel.from(nodes.codeBlock.first());
    const toolbar = EditorMainToolbarModel.from(editor);
    const firstCodeBlockToolbar = EditorFloatingToolbarModel.from(
      editor,
      firstCodeBlock,
    );

    await toolbar.clickAt('Code snippet');
    await editor.keyboard.press('ArrowDown');

    // Insert a second code block
    await toolbar.clickAt('Code snippet');
    const secondCodeBlock = EditorCodeBlockModel.from(nodes.codeBlock.nth(1));
    const secondCodeBlockToolbar = EditorFloatingToolbarModel.from(
      editor,
      secondCodeBlock,
    );
    expect(await secondCodeBlockToolbar.isLanguagePlaceholderVisible()).toBe(
      true,
    );

    await secondCodeBlockToolbar.changeLanguageTo('Arduino');
    expect(await secondCodeBlockToolbar.currentLanguage()).toBe('Arduino');

    // The first should still be undefined when we go back
    await firstCodeBlock.focus();
    expect(await firstCodeBlockToolbar.isLanguagePlaceholderVisible()).toBe(
      true,
    );

    await expect(editor).toMatchDocument(
      doc(
        code_block({ language: undefined })(),
        code_block({ language: 'arduino' })(),
      ),
    );
  });
});
