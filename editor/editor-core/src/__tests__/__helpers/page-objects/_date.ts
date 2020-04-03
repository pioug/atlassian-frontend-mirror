import { Page } from './_types';

const SELECTOR = `.dateView-content-wrap`;

export const clickOnDate = async (page: Page) => {
  await waitForDate(page);
  await page.click(SELECTOR);
};

export const waitForDate = async (page: Page) => {
  await page.waitForSelector(SELECTOR);
};

export const waitForDatePicker = async (page: Page) => {
  await page.waitForSelector('[aria-label="calendar"]');
};
