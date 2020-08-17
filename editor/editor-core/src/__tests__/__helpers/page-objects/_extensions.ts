import { TestPage, PuppeteerPage } from './_types';
import { waitForFloatingControl } from './_toolbar';

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
