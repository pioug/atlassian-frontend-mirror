import { TestPage, PuppeteerPage } from './_types';
import { waitForFloatingControl } from './_toolbar';
import { selectors } from './_editor';

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

export const quickInsert = async (page: any, title: string) => {
  // WARNING: remove spaces, otherwise be interpreted as a select event
  //   an alternative could be to split and use `.keys(['Space'])` between words
  const titleSafe = title.replace(/ /g, '');

  await page.waitForSelector(selectors.editor);
  await page.type(selectors.editor, '/');
  await page.waitForSelector(selectors.quickInsert);
  await page.type(selectors.editor, titleSafe);

  await page.waitForSelector('div[aria-label="Popup"]');
  await page.waitForSelector(
    `[aria-label="Popup"] [role="button"][aria-describedby="${title}"]`,
  );
  await page.click(`[aria-label="Popup"] [role="button"]`);
};
