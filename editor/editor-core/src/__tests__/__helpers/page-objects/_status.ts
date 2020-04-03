import { Page } from './_types';

const SELECTOR = `.statusView-content-wrap`;

export const clickOnStatus = async (page: Page) => {
  await waitForStatus(page);
  await page.click(SELECTOR);
};

export const waitForStatus = async (page: Page) => {
  await page.waitForSelector(SELECTOR);
};

export const waitForStatusToolbar = async (page: Page) => {
  await page.waitForSelector('[aria-label="Popup"] input[type="text"]');
};
