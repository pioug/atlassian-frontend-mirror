import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  EDITOR_PANEL_ICON_ELEMENT as ARIA_LABEL_ELEMENT,
  EDITOR_PANEL_ELEMENT as PANEL_TYPE_ELEMENT,
} from '../../_utils/locators';

export const INFO_PANEL_ARIA_LABEL_VALUE = 'Panel info';
export const ERROR_PANEL_ARIA_LABEL_VALUE = 'Panel error';
export const WARNING_PANEL_ARIA_LABEL_VALUE = 'Panel warning';

export const ERROR_PANEL_TYPE = 'error';
export const INFO_PANEL_TYPE = 'info';
export const WARNING_PANEL_TYPE = 'warning';

/**
 * Get aria Label value of panel
 */
export async function getPanelArialabel(page: Page) {
  await page.switchToWeb();
  return await page.getAttributeValue(ARIA_LABEL_ELEMENT, 'aria-label');
}

/**
 * Get data-panel-type value of panel
 */
export async function getPanelType(page: Page) {
  await page.switchToWeb();
  return await page.getAttributeValue(PANEL_TYPE_ELEMENT, 'data-panel-type');
}
