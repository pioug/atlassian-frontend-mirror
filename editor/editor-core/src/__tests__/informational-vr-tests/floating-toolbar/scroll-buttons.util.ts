// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';

const panelSelectorName = '.ak-editor-panel__content';
const floatingToolbarLableSelector = `[aria-label="Panel floating controls"]`;

const addEmojiSelector = `[aria-label="editor-add-emoji"]`;

const colorPickerPanelSelector = `[aria-label="Background color"]`;
const colorPickerMenu = `[data-test-id="color-picker-menu"]`;

export const dataTestDivSelector = 'ak-editor-content-area';

export const prepareSetupForEmojiSelectorPopup = async (page: Page) => {
  page.setViewportSize({ width: 375, height: 700 });

  await page.addStyleTag({
    content: `
        [data-emoji-picker-container] > div { visibility: hidden !important; }
      `,
  });

  await page.waitForSelector(panelSelectorName);
  await page.waitForSelector(floatingToolbarLableSelector);

  await page.click(addEmojiSelector);
  await page.waitForSelector('div[data-emoji-picker-container="true"]');

  await page.addStyleTag({
    content: `
        ${floatingToolbarLableSelector} > div > div { visibility: hidden !important; }
      `,
  });
};

export const prepareSetupForColorSelectorPopup = async (page: Page) => {
  page.setViewportSize({ width: 375, height: 700 });
  await page.addStyleTag({
    content: `
    [data-test-id="color-picker-menu"] > div { visibility: hidden !important; },
    `,
  });

  await page.waitForSelector(panelSelectorName);
  await page.waitForSelector(floatingToolbarLableSelector);

  await page.click(colorPickerPanelSelector);

  await page.waitForSelector('div[aria-label="Color picker popup"]');
  await page.waitForSelector(colorPickerMenu);

  await page.addStyleTag({
    content: `
      ${floatingToolbarLableSelector} > div > div { visibility: hidden !important; }
    `,
  });
};
