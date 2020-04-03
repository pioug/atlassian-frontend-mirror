import { ElementHandle } from 'puppeteer';
import { Page } from './_types';

export const waitForMenuIconsToLoad = async (page: Page) => {
  const menuItemSelector = '.fabric-editor-typeahead [class^="Item-"]';
  const menuItems: ElementHandle[] = await page.$$(menuItemSelector);
  await page.waitForFunction(
    (selector: string, numItems: number) =>
      document.querySelectorAll(selector).length === numItems,
    {},
    `${menuItemSelector} svg`,
    menuItems.length,
  );
};
