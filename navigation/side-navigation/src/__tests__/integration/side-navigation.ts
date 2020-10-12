import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const exampleUrl = getExampleUrl(
  'navigation',
  'side-navigation',
  'nested-side-navigation',
);

/* Css selectors used for the test */
const nestableNavigation = "[data-testid='nestable-navigation-content']";
const filterNestingItem = "[data-testid='filter-nesting-item--item']";

BrowserTestCase(
  'Focus should be on nested container while navigating via keyboard',
  {},
  async (client: any) => {
    const testPage = new Page(client);
    await testPage.goto(exampleUrl);
    await testPage.waitForSelector(filterNestingItem);
    expect(await testPage.hasFocus(nestableNavigation)).toBe(false);
    await testPage.click(nestableNavigation);
    await testPage.keys('\ue004');
    await testPage.keys('\ue007');
    expect(await testPage.hasFocus(nestableNavigation)).toBe(true);
  },
);

BrowserTestCase(
  'Nested container should not be focused while navigating via mouse',
  {},
  async (client: any) => {
    const testPage = new Page(client);
    await testPage.goto(exampleUrl);
    await testPage.waitForSelector(filterNestingItem);
    expect(await testPage.hasFocus(nestableNavigation)).toBe(false);
    await testPage.click(filterNestingItem);
    expect(await testPage.hasFocus(nestableNavigation)).toBe(false);
  },
);
