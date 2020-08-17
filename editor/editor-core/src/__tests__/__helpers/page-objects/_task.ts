import { TestPage } from './_types';
import { clickToolbarMenu, ToolbarMenuItem } from './_toolbar';
import { selectors } from './_editor';

export const LIST_SELECTOR = '[data-node-type="actionList"]';
export const ITEM_SELECTOR = `.taskItemView-content-wrap`;

export const clickTaskNth = async (page: TestPage, nth: number) => {
  await waitForTaskList(page);
  await page.click(`${ITEM_SELECTOR}:nth-of-type(${nth})`);
};

export const toggleTaskNth = async (page: TestPage, nth: number) => {
  await waitForTaskList(page);
  await page.waitForSelector(
    `${ITEM_SELECTOR}:nth-of-type(${nth}) input[type="checkbox"]`,
  );
  await page.click(
    `${ITEM_SELECTOR}:nth-of-type(${nth}) input[type="checkbox"]`,
  );
};

export const waitForTaskList = async (page: TestPage) => {
  await page.waitForSelector(LIST_SELECTOR);
};

export const insertTaskFromMenu = async (page: TestPage) => {
  await clickToolbarMenu(page, ToolbarMenuItem.insertMenu);
  await page.waitForSelector(selectors.dropList);
  await clickToolbarMenu(page, ToolbarMenuItem.action);
};
