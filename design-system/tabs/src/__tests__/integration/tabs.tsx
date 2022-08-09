import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const url = getExampleUrl('design-system', 'tabs', 'testing');

/* Css selectors used for the test */
const tabsContainer = "[data-testid='tabs']";
const tab1 = "[data-testid='tab-1']";
const tab2 = "[data-testid='tab-2']";
const tab3 = "[data-testid='tab-3']";
const tab4 = "[data-testid='tab-4']";
const tabPanel = '[role="tabpanel"]';
const tabPanel1 = "[data-testid='tab-panel-1']";
const tabPanel2 = "[data-testid='tab-panel-2']";
const tabPanel3 = "[data-testid='tab-panel-3']";
const tabPanel4 = "[data-testid='tab-panel-4']";

BrowserTestCase(
  'Tabs should be able to be identified and navigated by data-testid',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(url);
    await page.waitFor(tabsContainer, 5000);
    // Check for tab visibility.
    expect(await page.isVisible(tab1)).toBe(true);
    expect(await page.isVisible(tab2)).toBe(true);
    expect(await page.isVisible(tab3)).toBe(true);
    expect(await page.isVisible(tab4)).toBe(true);

    // Check for tab name.
    expect(await page.getText(tab1)).toContain('Tab 1');
    expect(await page.getText(tab2)).toContain('Tab 2');
    expect(await page.getText(tab3)).toContain('Tab 3');
    expect(await page.getText(tab4)).toContain('Tab 4');

    // Check by default the first tab is selected and has other attributes.
    expect(await page.getAttribute(tab1, 'aria-selected')).toBe('true');
    expect(await page.getAttribute(tab1, 'aria-setsize')).toBe('4');
    expect(await page.getAttribute(tab1, 'aria-posinset')).toBe('1');
    expect(await page.getAttribute(tab1, 'aria-controls')).toBe(
      'testing-0-tab',
    );

    // Check by default the first tab content and is labelled correctly.
    expect(await page.getText(tabPanel)).toContain('One');
    expect(await page.getAttribute(tabPanel, 'aria-labelledby')).toBe(
      'testing-0',
    );

    // Click
    await page.click(tab3);
    expect(await page.getAttribute(tab3, 'aria-selected')).toBe('true');
    expect(await page.getText(tabPanel3)).toContain('Three');
  },
);

BrowserTestCase(
  'Content should be visible only on the focused tab',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(url);
    await page.waitFor(tabsContainer, 5000);

    // Navigate between tab and check the selection, content and focus.
    // Tab then use arrow right to navigate.
    await page.keys(['\uE004', '\uE014', '\uE014', '\uE014']);

    // Tab 4 is in focus and it's content should be visible
    expect(await page.hasFocus(tab4)).toBe(true);
    expect(await (await page.$(tabPanel4)).isDisplayed()).toBe(true);

    // Content of rest of the three tab should not be visible
    expect(await (await page.$(tabPanel1)).isDisplayed()).toBe(false);
    expect(await (await page.$(tabPanel2)).isDisplayed()).toBe(false);
    expect(await (await page.$(tabPanel3)).isDisplayed()).toBe(false);
  },
);
