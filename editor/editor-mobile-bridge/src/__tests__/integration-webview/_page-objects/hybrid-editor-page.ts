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
  UNSUPPORTED_BLOCK_NODE_ERROR_MESSAGE,
  UNSUPPORTED_NODE_TOOLTIP,
} from '../_utils/constants';
import {
  DECISION_PANEL_TYPE,
  getDecisionPanelType,
  getDecision,
} from './fragments/decision-fragment';
import { isActionItemNodeTypePresent } from './fragments/action-item-fragment';
import {
  EMOJI_BACKGROUND_IMAGE_ELEMENT,
  isEmojiBackgroundImageLoaded,
  isEmojiShortNamePresent,
  isTextPresent as isEmojiTextPresent,
} from './fragments/emoji-fragment';
import {
  getLozengeText,
  clickLozengeDetailsIcon,
  getLozengeToolTipText,
  UNSUPPORTED_BLOCK_NODE,
  UNSUPPORTED_INLINE_NODE,
} from './fragments/lozenge-fragment';
import { INLINE_UNSUPPORTED_CONTENT_TEXT_ATTR_VALUE } from '../_utils/test-data';

export const SELECTORS_WEB = {
  EDITOR: '#editor .ProseMirror',
};
export const EDITOR_CONTENT_AREA_ELEMENT = '.ak-editor-content-area';
export const BLOCK_QUOTE_ELEMENT = 'blockquote';
export const CODE_BLOCK_ELEMENT = '.code-block .code-content code';
export const TABLE_HEADER_ELEMENT = '.pm-table-header-content-wrap p strong';
export const MENTION_VIEW_ELEMENT =
  '.inline-node--mobile.mentionView-content-wrap';

/**
 * Load & start the editor within the WebView
 *
 * The WebView loads the URL entered into the TextInput at the top
 * of the screen. Once loaded, we focus the editor.
 *
 * This function will leave you in the webview context so that you
 * can immediately interact with the editor bridge methods.
 */
export async function loadEditor(page: Page, params = '') {
  const filename = `editor.html`;
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
      (window as any)[_bridgeKey].configure(_config);
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
 * Verify the text added in block quote to validate the presence of block quote
 */
export async function isBlockQuoteAdded(page: Page, text: string) {
  page.switchToWeb();
  return (await page.getTextOfElement(BLOCK_QUOTE_ELEMENT)) === text;
}

/**
 * Verify the text added in Code block to validate the presence of code block
 */
export async function isCodeBlockAdded(page: Page, text: string) {
  page.switchToWeb();
  return (await page.getTextOfElement(CODE_BLOCK_ELEMENT)) === text;
}

/**
 * Verify the text added in table header to validate the presence of table
 */
export async function isTableAdded(page: Page, text: string) {
  page.switchToWeb();
  return (await page.getTextOfElement(TABLE_HEADER_ELEMENT)) === text;
}

/**
 * Verify the mention nickname and mention id added in the page to validate the bridge method: insertTypeAheadItem
 */
export async function isMentionTypeAheadItemAdded(
  page: Page,
  mentionName: string,
  mentionId: string,
) {
  page.switchToWeb();
  return (
    (await page.getAttributeValue(MENTION_VIEW_ELEMENT, 'text')) ===
      mentionName &&
    (await page.getAttributeValue(MENTION_VIEW_ELEMENT, 'id')) === mentionId
  );
}

/**
 * Compare the decision text sent with the decision text added/typed in the decision panel
 */
export async function isDecisionAdded(page: Page, decisionvalue: string) {
  page.switchToWeb();
  return (await getDecision(page)) === decisionvalue;
}

/**
 * Verify the presence of shortname, text, background image of emoji to validate if emoji is added in the editor
 */
export async function isEmojiAdded(
  page: Page,
  shortName: string,
  text: string,
) {
  page.switchToWeb();

  return (
    await Promise.all([
      await isEmojiShortNamePresent(page, shortName),
      await isEmojiTextPresent(page, text),
      await isEmojiBackgroundImageLoaded(page, EMOJI_BACKGROUND_IMAGE_ELEMENT),
    ])
  ).every((value) => value);
}

/**
 * Verify the block node lozenge error message shown in the editor to confirm the presence of Lozenge in the editor
 */
export async function isBlockLozengeVisible(page: Page) {
  page.switchToWeb();
  return (
    (await getLozengeText(page, UNSUPPORTED_BLOCK_NODE)) ===
    `${UNSUPPORTED_BLOCK_NODE_ERROR_MESSAGE}Broken-Type`
  );
}

/**
 * Verify the inline node lozenge text shown in the editor to confirm the presence of Lozenge in the editor
 */
export async function isInlineLozengeVisible(page: Page) {
  page.switchToWeb();
  return (
    (await getLozengeText(page, UNSUPPORTED_INLINE_NODE)) ===
    INLINE_UNSUPPORTED_CONTENT_TEXT_ATTR_VALUE
  );
}

/**
 * Verify the lozenge tooltip text shown in the editor to confirm the presence of Lozenge tooltip in the editor
 */
export async function isLozengeTooltipVisible(page: Page, nodeType: string) {
  page.switchToWeb();
  await clickLozengeDetailsIcon(page, nodeType);
  return (await getLozengeToolTipText(page)) === UNSUPPORTED_NODE_TOOLTIP;
}
