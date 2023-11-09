// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';
import {
  EditorBlockCardModel,
  EditorInlineCardModel,
  EditorPageModel,
  EditorNodeContainerModel,
} from '@af/editor-libra/page-models';
// eslint-disable-next-line
import { deviceViewPorts } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';

export const prepareSetupForInlineAndBlockCard = async (page: Page) => {
  const editor = await EditorPageModel.from({ page });
  const nodes = EditorNodeContainerModel.from(editor);
  await page.setViewportSize(deviceViewPorts.LaptopHiDPI);
  const blockCardLocators = await nodes.blockCard.all();
  const inlineCardLocators = await nodes.inlineCard.all();
  await editor.waitForEditorStable();
  blockCardLocators.map((blockCardLocator) => {
    const blockCard = EditorBlockCardModel.from(blockCardLocator);
    blockCard.waitForStable();
  });
  inlineCardLocators.map((cardLocator) => {
    const card = EditorInlineCardModel.from(cardLocator);
    card.waitForStable();
  });
};

export const prepareSetupForCardWithDataSource = async (page: Page) => {
  const editor = await EditorPageModel.from({ page });
  const nodes = EditorNodeContainerModel.from(editor);
  await page.setViewportSize(deviceViewPorts.LaptopHiDPI);
  const blockCard = EditorBlockCardModel.from(nodes.blockCard);
  await blockCard.waitForStable();
  await editor.waitForEditorStable();
};

export const prepareSetupForEmbedCard =
  (checkForIframe: boolean) => async (page: Page) => {
    const editor = await EditorPageModel.from({ page });
    const nodes = EditorNodeContainerModel.from(editor);
    await page.setViewportSize(deviceViewPorts.LaptopHiDPI);
    const embedCard = await nodes.embedCard.elementHandle();
    await embedCard?.waitForElementState('stable');
    if (checkForIframe) {
      nodes.embedCard
        .locator('iframe[data-iframe-loaded="true"]')
        .waitFor({ state: 'attached' });
    }
    await editor.waitForEditorStable();
  };
