import { TestPage, PuppeteerPage } from './_types';
import { waitForFloatingControl } from './_toolbar';

const SELECTOR = `.inlineCardView-content-wrap`;

export const clickOnCard = async (page: TestPage) => {
  await waitForCard(page);
  await page.click(SELECTOR);
};

export const waitForCard = async (page: TestPage) => {
  await page.waitForSelector(SELECTOR);
};

export const waitForCardToolbar = async (page: PuppeteerPage) => {
  await waitForFloatingControl(page, 'Card options');
};
