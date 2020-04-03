import { Page } from './_types';

function getExtensionSelector(type: string, key: string) {
  return `[extensionType="${type}"][extensionKey="${key}"]`;
}

export const clickOnExtension = async (
  page: Page,
  type: string,
  key: string,
) => {
  await page.click(getExtensionSelector(type, key));
};

export const waitForExtensionToolbar = async (page: Page) => {
  await page.waitForSelector('[aria-label="Extension floating controls"]');
};
