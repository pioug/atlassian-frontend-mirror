import { TestPage } from './_types';

export const decisionSelectors = {
  decisionList: 'ol[data-node-type=decisionList]',
  decisionItem: '.decisionItemView-content-wrap',
  decisionIcon: 'span[aria-label="Decision"]',
};

export const waitForDecisionList = async (page: TestPage) => {
  await page.waitForSelector(decisionSelectors.decisionList);
};

export const clickNthDecision = async (page: TestPage, nth: number) => {
  await waitForDecisionList(page);
  await page.click(`${decisionSelectors.decisionItem}:nth-of-type(${nth})`);
};
