import { Page } from './_types';

const SELECTOR = `.inlineCardView-content-wrap`;

export const clickOnCard = async (page: Page) => {
  await waitForCard(page);
  await page.click(SELECTOR);
};

export const waitForCard = async (page: Page) => {
  await page.waitForSelector(SELECTOR);
};

export const waitForCardToolbar = async (page: Page) => {
  await page.waitForSelector('[aria-label="Card floating controls"]');
};
