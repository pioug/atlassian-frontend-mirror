import {
  EditorFloatingToolbarModel,
  EditorInlineCardModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import { inlineCardAdf } from './inline-awareness.spec.ts-fixtures/adf';

test.use({
  adf: inlineCardAdf,
  editorProps: {
    appearance: 'full-page',
    allowTextAlignment: true,
    smartLinks: {},
  },
  platformFeatureFlags: {
    'platform.linking-platform.smart-card.inline-switcher': true,
  },
});

test.describe('inline card awareness', () => {
  test('hover over an inline smart links with short link title will show only icon on an overlay', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
    const inlineCardModel = inlineCardsModel.card(0);
    await inlineCardModel.waitForResolvedStable();
    await inlineCardModel.hover();

    await expect(inlineCardModel.overlay).toBeVisible();
    await expect(inlineCardModel.overlayIcon).toBeVisible();
    await expect(inlineCardModel.overlayLabel).toBeHidden();
    await expect(inlineCardModel.overlayGradient).toBeVisible();
  });

  test('hover over an inline smart links with long link title will show icon and label on an overlay', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
    const inlineCardModel = inlineCardsModel.card(1);
    await inlineCardModel.waitForResolvedStable();
    await inlineCardModel.hover();

    await expect(inlineCardModel.overlay).toBeVisible();
    await expect(inlineCardModel.overlayIcon).toBeVisible();
    await expect(inlineCardModel.overlayLabel).toBeVisible();
    await expect(inlineCardModel.overlayGradient).toBeVisible();
  });

  test('click on an inline smart link opens link toolbar and overlay is closed', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
    const inlineCardModel = inlineCardsModel.card(1);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardsModel,
    );
    await inlineCardModel.waitForResolvedStable();
    await inlineCardModel.click();
    await floatingToolbarModel.waitForStable();

    // element being accessed "outside" of must be away from editor toolbar (which can overlay focus)
    editor.page.getByText('Click Me');

    await expect(floatingToolbarModel.isVisible()).toBeTruthy();
    await expect(inlineCardModel.overlay).toBeHidden();
  });
});
