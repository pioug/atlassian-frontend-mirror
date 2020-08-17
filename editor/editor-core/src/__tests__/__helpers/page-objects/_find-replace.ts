import { WebDriverPage, TestPage } from './_types';
import { searchMatchClass } from '../../../plugins/find-replace/styles';

export const findReplaceSelectors = {
  toolbarButton: '[aria-label="Find and replace"]',
  replaceInput: 'input[name="replace"]',
  replaceButton: '[data-testid="Replace"]',
  findInput: 'input[name="find"]',
  decorations: `.${searchMatchClass}`,
  matchCaseButton: 'button[label="Match case"]',
  matchCaseButtonPressed: `button[label="Match case"][aria-pressed="true"]`,
};

export const findText = async (page: WebDriverPage, text: string) => {
  await page.clear(findReplaceSelectors.findInput);
  await page.type(findReplaceSelectors.findInput, text);
  await page.keys('Enter');
  await page.waitForSelector(findReplaceSelectors.decorations);
};

export const toggleMatchCase = async (
  page: TestPage,
  waitForPressed: boolean,
) => {
  await page.click(findReplaceSelectors.matchCaseButton);
  waitForPressed &&
    (await page.waitForSelector(findReplaceSelectors.matchCaseButtonPressed));
};
