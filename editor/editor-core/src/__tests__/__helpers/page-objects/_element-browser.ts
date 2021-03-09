import {
  PuppeteerPage,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';
import { WebDriverPage } from './_types';

export const elementBrowserSelectors = {
  elementBrowser: '[data-testid="element-browser"]',
  viewMore: '[data-testid="view-more-elements-item"]',
  elementItems: '[data-testid="element-items"]',
  listItems: '[data-testid^="element-item-"]:not([data-testid$="--container"])',
  modalBrowser: '[role="dialog"]',
  categoryItem: '[data-testid="element-browser-category-item"]',
  elementListContainer: '.ReactVirtualized__Collection',
};

/**
 * The insertables list uses virtualisation.
 * Icons within the insertable list items are lazy loaded
 * as either an SVG or IMG element.
 * Both on intial mounting of the list, as well as via
 * scrolling to loop through the virtualised nodes.
 */
async function waitForInsertableItems(page: PuppeteerPage, sel: string) {
  await page.waitForSelector(sel);
  await page.waitForFunction(
    (selector: string) => {
      const totalItems = document.querySelectorAll<HTMLElement>(selector)
        .length;
      const totalSVG = document.querySelectorAll<HTMLElement>(`${selector} svg`)
        .length;
      const totalIMG = document.querySelectorAll<HTMLElement>(`${selector} img`)
        .length;
      // Icons can be a mixture of SVG and/or IMG elements.
      // Check that we have a matching number of icons.
      return totalItems === totalSVG + totalIMG;
    },
    { polling: 'mutation', timeout: 10000 },
    sel,
  );

  const hasImages: boolean = await page.evaluate<
    (selector: string) => Promise<boolean>
  >((selector: string): Promise<boolean> => {
    return Promise.resolve(
      document.querySelectorAll<HTMLElement>(`${selector} img`).length > 0,
    );
  }, sel);

  if (hasImages) {
    await waitForLoadedImageElements(page, 10000);
  }
}

export async function waitForBrowseMenuIcons(page: PuppeteerPage) {
  await waitForInsertableItems(
    page,
    `${elementBrowserSelectors.elementBrowser} ${elementBrowserSelectors.listItems}`,
  );
}

export async function waitForInsertMenuIcons(page: PuppeteerPage) {
  await waitForInsertableItems(
    page,
    `${elementBrowserSelectors.elementItems} ${elementBrowserSelectors.listItems}`,
  );
}

export async function waitForNumOfModalBrowserItems(
  page: WebDriverPage,
  number: Number,
) {
  await page.waitUntil(async () => {
    const items = await page.$$(elementBrowserSelectors.listItems);
    return items.length >= number;
  }, 'waitForNumOfModalBrowserItems failed');
}
