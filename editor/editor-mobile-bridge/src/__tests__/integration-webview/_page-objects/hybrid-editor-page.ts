import URL from 'url';
import Page, {
  BS_LOCAL_PROXY_DOMAIN,
} from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { PORT } from '../../../../build/utils';
import {
  getPanelArialabel as getInfoPanelAriaLabelValue,
  getPanelArialabel as getWarningPanelAriaLabelValue,
  getPanelArialabel as getErrorPanelAriaLabelValue,
  getPanelType,
  INFO_PANEL_ARIA_LABEL_VALUE,
  INFO_PANEL_TYPE,
  ERROR_PANEL_ARIA_LABEL_VALUE,
  ERROR_PANEL_TYPE,
  WARNING_PANEL_ARIA_LABEL_VALUE,
  WARNING_PANEL_TYPE,
} from './fragments/panel-fragment';
import {
  ACTION_ITEM_HELP_TEXT,
  ACTION_ITEM_HELP_TEXT_IN_ZH,
  AT_SYMBOL,
  DECISION_PANEL_HELP_TEXT,
} from '../_utils/constants';
import {
  DECISION_PANEL_TYPE,
  getDecisionPanelType,
  getDecision,
} from './fragments/decision-fragment';
import { isActionItemNodeTypePresent } from './fragments/action-item-fragment';

export const SELECTORS_WEB = {
  EDITOR: '#editor .ProseMirror',
};
export const EDITOR_CONTENT_AREA_ELEMENT = '.ak-editor-content-area';

/**
 * Load & start the editor within the WebView
 *
 * The WebView loads the URL entered into the TextInput at the top
 * of the screen. Once loaded, we focus the editor.
 *
 * This function will leave you in the webview context so that you
 * can immediately interact with the editor bridge methods.
 *
 * @param useNextGen When true targets the Arch V3 release.
 */
export async function loadEditor(page: Page, params = '', useNextGen = false) {
  const filename = `editor${useNextGen ? 'archv3' : ''}.html`;
  const url = URL.resolve(
    `http://${BS_LOCAL_PROXY_DOMAIN}:${PORT}`,
    filename + '?' + params,
  );
  await page.loadUrl(url, SELECTORS_WEB.EDITOR);

  // Tap the webview to focus the editor and show the onscreen keyboard
  await page.tap(page.getAppWebviewSelector());

  // Leave the context set to web so that immediate editor bridge access is available.
  await page.switchToWeb();
}

/**
 * Configure Editor with flags
 */
export async function configureEditor(page: Page, config: string) {
  await page.switchToWeb();
  return page.execute(
    (_config, _bridgeKey) => {
      (window as any)[_bridgeKey].configureEditor(_config);
    },
    config,
    'bridge',
  );
}

/**
 * To set focus on the web view and to get the soft keyboard up
 */
export async function focusOnWebView(page: Page) {
  await page.switchToWeb();
  await page.tap(page.getAppWebviewSelector());
}

/**
 * Compare help text value of Action item to validate if action item is visible in the editor
 */
export async function isActionItemVisible(page: Page) {
  page.switchToWeb();
  return (
    (await page.getTextOfElement(EDITOR_CONTENT_AREA_ELEMENT)) ===
      ACTION_ITEM_HELP_TEXT && (await isActionItemNodeTypePresent(page))
  );
}

/**
 * Compare translated help text value of Action item to validate if localised action item is visible in the editor
 */
export async function isActionItemHelpTextTranslatedToZH(page: Page) {
  page.switchToWeb();
  return (
    (await page.getTextOfElement(EDITOR_CONTENT_AREA_ELEMENT)) ===
    ACTION_ITEM_HELP_TEXT_IN_ZH
  );
}

/**
 * Validate if @ symbol is shown in the editor when /mention is entered
 */
export async function isMentionSymbolVisible(page: Page) {
  page.switchToWeb();
  return (
    (await page.getTextOfElement(EDITOR_CONTENT_AREA_ELEMENT)) === AT_SYMBOL
  );
}

/**
 * Compare Aria Label value to validate if info panel is visible in the editor
 */
export async function isInfoPanelVisible(page: Page) {
  return (
    (await getInfoPanelAriaLabelValue(page)) === INFO_PANEL_ARIA_LABEL_VALUE &&
    (await getPanelType(page)) === INFO_PANEL_TYPE
  );
}

/**
 * Compare Aria Label value to validate if warning panel is visible in the editor
 */
export async function isWarningPanelVisible(page: Page) {
  return (
    (await getWarningPanelAriaLabelValue(page)) ===
      WARNING_PANEL_ARIA_LABEL_VALUE &&
    (await getPanelType(page)) === WARNING_PANEL_TYPE
  );
}

/**
 * Compare Aria Label value of error panel to validate if error panel is visible in the editor
 */
export async function isErrorPanelVisible(page: Page) {
  return (
    (await getErrorPanelAriaLabelValue(page)) ===
      ERROR_PANEL_ARIA_LABEL_VALUE &&
    (await getPanelType(page)) === ERROR_PANEL_TYPE
  );
}

/**
 * Compare help text value and verify panel type of the decision panel to validate if decision panel is visible in the editor
 */
export async function isDecisionPanelVisible(page: Page) {
  page.switchToWeb();
  return (
    (await page.getTextOfElement(EDITOR_CONTENT_AREA_ELEMENT)) ===
      DECISION_PANEL_HELP_TEXT &&
    (await getDecisionPanelType(page)) === DECISION_PANEL_TYPE
  );
}

/**
 * Compare the decision text sent with the decision text added/typed in the decision panel
 */
export async function isDecisionAdded(page: Page, decisionvalue: string) {
  page.switchToWeb();
  return (await getDecision(page)) === decisionvalue;
}
