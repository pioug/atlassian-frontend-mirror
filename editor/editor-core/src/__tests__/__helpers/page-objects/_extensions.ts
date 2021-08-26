import { TestPage, PuppeteerPage, isPuppeteer } from './_types';
import { waitForFloatingControl } from './_toolbar';
import { selectors } from './_editor';

export const extensionSelectors = {
  configPanel: '[data-testid="extension-config-panel"]',
};

export const QUICK_INSERT_TRIGGER = '/';

function getExtensionSelector(type: string, key: string) {
  return `[extensionType="${type}"][extensionKey="${key}"]`;
}

export const clickOnExtension = async (
  page: TestPage,
  type: string,
  key: string,
) => {
  await page.click(getExtensionSelector(type, key));
};

export const waitForExtensionToolbar = async (page: PuppeteerPage) => {
  await waitForFloatingControl(page, 'Extension floating controls');
};

export const quickInsert = async (
  page: any,
  title: string,
  clickAtSelection: boolean = true,
) => {
  const firstWordTitle = title.split(' ')[0];
  await page.waitForSelector(selectors.editor);
  await page.type(selectors.editor, QUICK_INSERT_TRIGGER);

  await page.waitForSelector(selectors.quickInsert);

  if (firstWordTitle) {
    const keys = firstWordTitle.split('');
    if (isPuppeteer(page)) {
      for (let key of keys) {
        await page.keyboard.type(key);
      }
    } else {
      await page.keys(keys);
    }
  }

  await page.waitForSelector(selectors.typeaheadPopup);

  if (clickAtSelection) {
    const optionSelector = ` [role="option"][aria-label*="${firstWordTitle}" i]`;
    await page.waitForSelector(selectors.typeaheadPopup.concat(optionSelector));
    await page.click(selectors.typeaheadPopup.concat(optionSelector));
  }
};
