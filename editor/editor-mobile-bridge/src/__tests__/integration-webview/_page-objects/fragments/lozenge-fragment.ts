import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  BLOCK_UNSUPPORTED_CONTENT,
  INLINE_UNSUPPORTED_CONTENT,
} from '../../_utils/test-data';

export const UNSUPPORTED_BLOCK_NODE = '.unsupportedBlockView-content-wrap';
export const UNSUPPORTED_INLINE_NODE = '.unsupportedInlineView-content-wrap';
export const UNSUPPORTED_NODE_TOOLTIP =
  '.atlaskit-portal-container .atlaskit-portal .Tooltip';
export const BLOCK_LOZENGE_DETAILS_ICON = `${UNSUPPORTED_BLOCK_NODE} [aria-label="?"]`;
export const INLINE_LOZENGE_DETAILS_ICON = `${UNSUPPORTED_INLINE_NODE} [aria-label="?"]`;

export async function getLozengeText(page: Page, nodeType: string) {
  return await page.getTextOfElement(nodeType);
}

export async function getLozengeToolTipText(page: Page) {
  return await page.getTextOfElement(UNSUPPORTED_NODE_TOOLTIP);
}

export async function clickLozengeDetailsIcon(page: Page, nodeType: string) {
  if (nodeType === BLOCK_UNSUPPORTED_CONTENT) {
    await page.click(await page.$(BLOCK_LOZENGE_DETAILS_ICON));
  } else if (nodeType === INLINE_UNSUPPORTED_CONTENT) {
    await page.click(await page.$(INLINE_LOZENGE_DETAILS_ICON));
  } else {
    throw new Error('Invalid node type specified!');
  }
}
