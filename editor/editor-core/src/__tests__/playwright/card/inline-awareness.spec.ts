import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorInlineCardModel,
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
  const overlayText = 'Change view';
  const iconSelector = '[data-testid="inline-card-overlay-close"]';

  test('hover over smart links with short link title will show only icon on an overlay', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard.nth(0));
    await inlineCardModel.waitForStable();
    await inlineCardModel.hover();

    await expect(editor.page.locator(iconSelector)).toBeVisible();
    await expect(editor.page.getByText(overlayText)).toBeHidden();
  });

  test('hover over smart links with long link title will show icon and label on an overlay', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard.nth(1));
    await inlineCardModel.waitForStable();
    await inlineCardModel.hover();

    await expect(editor.page.locator(iconSelector)).toBeVisible();
    await expect(editor.page.getByText(overlayText)).toBeVisible();
  });
});
