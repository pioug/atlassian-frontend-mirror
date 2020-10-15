import { TestPage } from './_types';
import { clickToolbarMenu, ToolbarMenuItem } from './_toolbar';
import { selectors } from './_editor';

export enum STATUS_SELECTORS {
  STATUS_NODE = '.statusView-content-wrap',
  STATUS_POPUP_INPUT = '[aria-label="Popup"] input',
}

export const clickOnStatus = async (page: TestPage) => {
  await waitForStatus(page);
  await page.click(STATUS_SELECTORS.STATUS_NODE);
};

export const waitForStatus = async (page: TestPage) => {
  await page.waitForSelector(STATUS_SELECTORS.STATUS_NODE);
};

export const waitForStatusToolbar = async (page: TestPage) => {
  await page.waitForSelector(STATUS_SELECTORS.STATUS_POPUP_INPUT);
};

export const insertStatusFromMenu = async (page: TestPage) => {
  await clickToolbarMenu(page, ToolbarMenuItem.insertMenu);
  await page.waitForSelector(selectors.dropList);
  await clickToolbarMenu(page, ToolbarMenuItem.status);
};
