import { TestPage } from './_types';

const SELECTOR = `.dateView-content-wrap`;

export const clickOnDate = async (page: TestPage) => {
  await waitForDate(page);
  await page.click(SELECTOR);
};

export const waitForDate = async (page: TestPage) => {
  await page.waitForSelector(SELECTOR);
};

export const waitForDatePicker = async (page: TestPage) => {
  await page.waitForSelector('[aria-label="calendar"]');
};
