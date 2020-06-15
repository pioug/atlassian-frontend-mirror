import { Page } from './_types';
import { waitForFloatingControl } from './_toolbar';

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
  await waitForFloatingControl(page, 'Extension floating controls');
};
