import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const exampleUrl = getExampleUrl(
  'design-system',
  'page-layout',
  'integration-example',
);

/* Css selectors used for the test */

const content = "[data-testid='content']";
const resizeControl = "[data-resize-button='true']";
const leftSidebar = "[data-testid='left-sidebar']";
const collapsedSidebar = '[aria-expanded="false"]';

/**
 * This test was originally marked as flakey. The problem has been found with
 * safari as previous keys not working with safari any more, change the code,
 * fixed the issue. See https://product-fabric.atlassian.net/browse/DSP-3548
 */
BrowserTestCase(
  'Left sidebar should be collapsed on click of grab area via keyboard',
  {},
  async (client: any) => {
    const testPage = new Page(client);
    await testPage.goto(exampleUrl);
    await testPage.waitForSelector(content);

    await testPage.click(leftSidebar);
    expect(await testPage.getAttribute(resizeControl, 'aria-expanded')).toBe(
      'true',
    );
    await testPage.keys('Tab');
    await testPage.keys('Tab');
    expect(await testPage.getAttribute(resizeControl, 'aria-expanded')).toBe(
      'true',
    );
    await testPage.keys('Enter');
    await testPage.waitForSelector(collapsedSidebar);
    expect(await testPage.getAttribute(resizeControl, 'aria-expanded')).toBe(
      'false',
    );
  },
);
