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
    const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
    const inlineCardModel = inlineCardsModel.card(0);
    await inlineCardModel.waitForStable();
    await inlineCardModel.hover();

    await expect(inlineCardModel.overlay).toBeVisible();
    await expect(inlineCardModel.overlayIconClose).toBeVisible();
    await expect(inlineCardModel.overlayLabel).toBeHidden();
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
    await expect(inlineCardModel.overlayIconClose).toBeVisible();
    await expect(inlineCardModel.overlayLabel).toBeVisible();
  });

  test('click on an inline smart link opens link toolbar and keeps an overlay opened', async ({
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
    await editor.page.getByText('Click Me');

    await expect(floatingToolbarModel.isVisible()).toBeTruthy();
    await expect(inlineCardModel.overlay).toBeVisible();
    await expect(inlineCardModel.overlayIconOpen).toBeVisible();
    await expect(inlineCardModel.overlayLabel).toBeVisible();
  });

  test('click outside an inline smart link hides link toolbar and an overlay', async ({
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

    await expect(inlineCardModel.overlay).toBeVisible();

    // element being clicked "outside" of must be away from editor toolbar (which can overlay focus) and
    // force: true is required to prevent toolbar intercepting click event
    // eslint-disable-next-line playwright/no-force-option
    await editor.page.getByText('Click Me').click({ force: true });
    await expect(floatingToolbarModel.toolbar).toBeHidden();
    await expect(inlineCardModel.overlay).toBeHidden();
  });
});
