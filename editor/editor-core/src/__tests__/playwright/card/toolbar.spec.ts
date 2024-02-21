import {
  EditorFloatingToolbarModel,
  EditorHyperlinkModel,
  EditorInlineCardModel,
  EditorMainToolbarModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import { cardAppearanceAdf } from './toolbar.spec.ts-fixtures';

test.describe('card: toolbar', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      smartLinks: {
        allowBlockCards: true,
        allowEmbeds: true,
      },
      featureFlags: {
        'lp-link-picker': true,
      },
    },
  });

  test('link picker popup is visible at bottom when new link picker is enabled', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    const { link } = EditorNodeContainerModel.from(editor);
    const linkModel = EditorHyperlinkModel.from(link.first());
    const floatingToolbar = EditorFloatingToolbarModel.from(editor, linkModel);

    await editor.page.setViewportSize({
      width: 950,
      height: 500,
    });
    await editor.waitForEditorStable();

    await editor.keyboard.type('Test one, two, three');
    await editor.keyboard.press('Enter');

    await editor.keyboard.type('Test one, two, three');
    await editor.keyboard.press('Enter');

    await editor.keyboard.type('Test one, two, three');
    await editor.keyboard.press('Enter');

    await editor.keyboard.type('Test one, two, three');
    await editor.keyboard.press('Enter');

    await editor.keyboard.type('Test one, two, three');
    await editor.keyboard.press('Enter');

    await editor.keyboard.type('Test one, two, three');
    await editor.keyboard.press('Enter');

    await toolbar.clickAt('Link');

    await editor.waitForEditorStable();

    await expect(floatingToolbar.popup).toBeVisible();
    await expect(floatingToolbar.linkInput).toBeVisible();
    await expect(floatingToolbar.linkInput).toBeFocused();
  });

  test.describe('aaa', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        smartLinks: {
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
      adf: cardAppearanceAdf,
    });

    test('can exit edit link mode by pressing esc', async ({ editor }) => {
      const { link } = EditorNodeContainerModel.from(editor);
      const cardModel = EditorInlineCardModel.from(link.first());
      const floatingToolbar = EditorFloatingToolbarModel.from(
        editor,
        cardModel,
      );

      await link.first().click();

      await expect(floatingToolbar.blockCardIcon).toBeVisible();

      await floatingToolbar.editLink();

      await expect(floatingToolbar.cardOptionsPopup).toBeVisible();
      await expect(floatingToolbar.blockCardIcon).toBeHidden();
      await expect(floatingToolbar.linkInput).toBeVisible();
      await expect(floatingToolbar.linkInput).toBeFocused();

      await editor.keyboard.press('Escape');

      await expect(floatingToolbar.blockCardIcon).toBeVisible();
      await expect(floatingToolbar.linkInput).toBeHidden();
    });

    test('shows suggestions in link picker when clearing the url in edit mode', async ({
      editor,
    }) => {
      const { link } = EditorNodeContainerModel.from(editor);
      const cardModel = EditorInlineCardModel.from(link.first());
      const floatingToolbar = EditorFloatingToolbarModel.from(
        editor,
        cardModel,
      );

      await link.first().click();

      await expect(floatingToolbar.blockCardIcon).toBeVisible();

      await floatingToolbar.editLink();

      await expect(floatingToolbar.cardOptionsPopup).toBeVisible();
      await expect(floatingToolbar.blockCardIcon).toBeHidden();
      await expect(floatingToolbar.linkInput).toBeVisible();
      await expect(floatingToolbar.linkInput).toBeFocused();

      await expect(floatingToolbar.linkSuggestionOptions).toHaveCount(0);

      await floatingToolbar.clearLink();

      await expect(floatingToolbar.linkSuggestionOptions.first()).toBeVisible();
    });
  });
});
