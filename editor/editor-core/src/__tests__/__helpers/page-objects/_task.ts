import { Page } from './_types';

export const LIST_SELECTOR = '[data-node-type="actionList"]';
export const ITEM_SELECTOR = `.taskItemView-content-wrap`;

export const clickTaskNth = async (page: Page, nth: number) => {
  await waitForTaskList(page);
  await page.click(`${ITEM_SELECTOR}:nth-of-type(${nth})`);
};

export const toggleTaskNth = async (page: Page, nth: number) => {
  await waitForTaskList(page);
  await page.waitForSelector(
    `${ITEM_SELECTOR}:nth-of-type(${nth}) input[type="checkbox"]`,
  );
  await page.click(
    `${ITEM_SELECTOR}:nth-of-type(${nth}) input[type="checkbox"]`,
  );
};

export const waitForTaskList = async (page: Page) => {
  await page.waitForSelector(LIST_SELECTOR);
};
