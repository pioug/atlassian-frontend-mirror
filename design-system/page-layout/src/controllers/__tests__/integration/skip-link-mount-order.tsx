import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const exampleUrl = getExampleUrl(
  'design-system',
  'page-layout',
  'customizable-page-layout',
);

/* Css selectors used for the test */

const slot = '[data-ds--page-layout--slot]';
const skipLink = "[data-skip-link-wrapper='true'] a";
const toggleBanner = '#toggle-banner';
const toggleTopNavigation = '#toggle-top-navigation';
const toggleLeftSidebar = '#toggle-left-sidebar';
const toggleMain = '#toggle-main';
const toggleRightSidebar = '#toggle-right-sidebar';
const toggleRightPanel = '#toggle-right-panel';

const expectedOrder = [
  'banner',
  'top-navigation',
  'left-panel',
  'left-sidebar',
  'main',
  'right-sidebar',
  'right-panel',
];

const hasExpectedOrder = async (page: Page) => {
  /**
   * Relying on $$ returning elements in DOM order.
   * Checking that the links appear in the same order
   * as they are defined in `expectedOrder` above.
   */

  const elems = await page.$$(skipLink);
  const hrefs = await Promise.all(
    elems.map((elem) => elem.getAttribute('href')),
  );

  return (
    hrefs.length === expectedOrder.length &&
    hrefs.every((href, i) => href.endsWith(`#${expectedOrder[i]}`))
  );
};

BrowserTestCase(
  'Links should have DOM order by default',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(exampleUrl);
    await page.waitForSelector(slot);

    expect(await hasExpectedOrder(page)).toBe(true);
  },
);

BrowserTestCase(
  'Remounting the first slot (banner) should maintain its order',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(exampleUrl);
    await page.waitForSelector(slot);
    await page.waitForSelector(toggleBanner);

    await page.click(toggleBanner);
    expect(await hasExpectedOrder(page)).toBe(false);

    await page.click(toggleBanner);
    expect(await hasExpectedOrder(page)).toBe(true);
  },
);

BrowserTestCase(
  'Remounting an arbitrary slot (left-sidebar) should maintain its order',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(exampleUrl);
    await page.waitForSelector(slot);
    await page.waitForSelector(toggleLeftSidebar);

    await page.click(toggleLeftSidebar);
    expect(await hasExpectedOrder(page)).toBe(false);

    await page.click(toggleLeftSidebar);
    expect(await hasExpectedOrder(page)).toBe(true);
  },
);

BrowserTestCase(
  'Remounting the last slot (right-panel) should maintain its order',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(exampleUrl);
    await page.waitForSelector(slot);
    await page.waitForSelector(toggleRightPanel);

    await page.click(toggleRightPanel);
    expect(await hasExpectedOrder(page)).toBe(false);

    await page.click(toggleRightPanel);
    expect(await hasExpectedOrder(page)).toBe(true);
  },
);

BrowserTestCase(
  'Remounting many items randomly should maintain order',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(exampleUrl);
    await page.waitForSelector(slot);

    /**
     * Test was flaky without these
     */
    await page.waitForSelector(toggleRightPanel);
    await page.waitForSelector(toggleTopNavigation);
    await page.waitForSelector(toggleMain);
    await page.waitForSelector(toggleRightSidebar);

    await page.click(toggleRightPanel);
    await page.click(toggleTopNavigation);
    await page.click(toggleMain);
    await page.click(toggleRightSidebar);
    expect(await hasExpectedOrder(page)).toBe(false);

    await page.click(toggleTopNavigation);
    await page.click(toggleRightPanel);
    await page.click(toggleRightSidebar);
    await page.click(toggleMain);
    expect(await hasExpectedOrder(page)).toBe(true);
  },
);
