import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const url = getExampleUrl('core', 'tabs', 'testing');

/* Css selectors used for the test */
const tabsContainer = "[data-testid='the-tabs']";
const tab1 = "[data-testid='tab-1']";
const tab2 = "[data-testid='tab-2']";
const tab3 = "[data-testid='tab-3']";
const tab4 = "[data-testid='tab-4']";
const tabPanel = '[role="tabpanel"]';

BrowserTestCase(
  'Tabs should be able to be identified and navigated by data-testid',
  {} as any,
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

    // Check by default the first tab is selected.
    expect(await page.getAttribute(tab1, 'aria-selected')).toBe('true');

    // Check by default the first tab content.
    expect(await page.getText(tabPanel)).toContain('One');

    // Navigate between tab and check the selection, content and focus.
    // Tab then use arrow right to navigate.
    await page.keys(['\uE004', '\uE014', '\uE014', '\uE014']);
    expect(await page.getAttribute(tab4, 'aria-selected')).toBe('true');
    expect(await page.getText(tabPanel)).toContain('Four');
    expect(await page.hasFocus(tab4)).toBe(true);
    // Click
    await page.click(tab3);
    expect(await page.getAttribute(tab3, 'aria-selected')).toBe('true');
    expect(await page.getText(tabPanel)).toContain('Three');
    expect(await page.hasFocus(tab4)).toBe(true);
  },
);
