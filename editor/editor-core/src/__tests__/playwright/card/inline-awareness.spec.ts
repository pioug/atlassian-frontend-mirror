import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorInlineCardModel,
  EditorFloatingToolbarModel,
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
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
  },
});

test.describe('inline card awareness', () => {
  test('hover over an inline smart links with short link title will show only icon on an overlay', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard.nth(0));
    await inlineCardModel.waitForResolvedStable();
    await inlineCardModel.hover();

    await expect(inlineCardModel.overlay).toBeVisible();
    await expect(inlineCardModel.overlayIconClose).toBeVisible();
    await expect(inlineCardModel.overlayLabel).toBeHidden();
  });

  test('hover over an inline smart links with long link title will show icon and label on an overlay', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard.nth(1));
    await inlineCardModel.waitForResolvedStable();
    await inlineCardModel.hover();

    await expect(inlineCardModel.overlay).toBeVisible();
    await expect(inlineCardModel.overlayIconClose).toBeVisible();
    await expect(inlineCardModel.overlayLabel).toBeVisible();
  });

  test('click on an inline smart link opens link toolbar and keeps an overlay opened', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard.nth(1));
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardModel,
    );
    await inlineCardModel.waitForResolvedStable();
    await inlineCardModel.click();
    await floatingToolbarModel.waitForStable();
    await nodes.paragraph.first().hover();

    await expect(floatingToolbarModel.isVisible()).toBeTruthy();
    await expect(inlineCardModel.overlay).toBeVisible();
    await expect(inlineCardModel.overlayIconOpen).toBeVisible();
    await expect(inlineCardModel.overlayLabel).toBeVisible();
  });

  test('click outside an inline smart link hides link toolbar and an overlay', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard.nth(1));
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardModel,
    );
    await inlineCardModel.waitForResolvedStable();
    await inlineCardModel.click();
    await floatingToolbarModel.waitForStable();

    await expect(inlineCardModel.overlay).toBeVisible();

    await nodes.paragraph.first().click();
    await expect(floatingToolbarModel.toolbar).toBeHidden();

    await expect(inlineCardModel.overlay).toBeHidden();
  });
});
