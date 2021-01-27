import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';

export const ACTION_ITEM_NODE_TYPE = 'actionList';

/**
 * Is action item node type present in the DOM
 */
export async function isActionItemNodeTypePresent(page: Page) {
  await page.switchToWeb();
  return page.isExisting('[data-node-type=' + ACTION_ITEM_NODE_TYPE + ']');
}
