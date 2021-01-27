import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';

export const DECISION_PANEL_ARIA_LABEL_VALUE = 'Decision';
export const DECISION_PANEL_TYPE = 'decisionList';
export const DECISION_PANEL_TYPE_ELEMENT = '.ProseMirror ol';
export const DECISION_CLASS_ELEMENT = '.decision-item';

/**
 * Get data-panel-type value of panel
 */
export async function getDecisionPanelType(page: Page) {
  await page.switchToWeb();
  return await page.getAttributeValue(
    DECISION_PANEL_TYPE_ELEMENT,
    'data-node-type',
  );
}

/**
 * Get decision
 */
export async function getDecision(page: Page) {
  await page.switchToWeb();
  return await page.getTextOfElement(DECISION_CLASS_ELEMENT);
}
