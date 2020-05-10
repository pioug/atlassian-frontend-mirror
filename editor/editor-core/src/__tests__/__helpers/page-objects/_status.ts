import { Page } from './_types';
import { clickToolbarMenu, ToolbarMenuItem } from './_toolbar';
import { selectors } from './_editor';

export const enum STATUS_SELECTORS {
  STATUS_NODE = '.statusView-content-wrap',
  STATUS_POPUP_INPUT = '[aria-label="Popup"] input',
}

export const clickOnStatus = async (page: Page) => {
  await waitForStatus(page);
  await page.click(STATUS_SELECTORS.STATUS_NODE);
};

export const waitForStatus = async (page: Page) => {
  await page.waitForSelector(STATUS_SELECTORS.STATUS_NODE);
};

export const waitForStatusToolbar = async (page: Page) => {
  await page.waitForSelector(STATUS_SELECTORS.STATUS_POPUP_INPUT);
};

export const insertStatusFromMenu = async (page: Page) => {
  await clickToolbarMenu(page, ToolbarMenuItem.insertMenu);
  await page.waitForSelector(selectors.dropList);
  await clickToolbarMenu(page, ToolbarMenuItem.status);
};
