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

    // Initially, the sidebar is open
    expect(await testPage.getAttribute(resizeControl, 'aria-expanded')).toBe(
      'true',
    );

    // Tab to the "Skip to: Main Content" then go backwards…
    await testPage.keys('Tab');
    await testPage.keys('Tab');
    await testPage.keys('Tab');
    expect(await testPage.hasFocus("[href='#main-content']")).toBe(true);
    await testPage.keys('Enter'); // Go to the main content

    // Tab backwards into the ResizeControl
    await testPage.keys(['Shift', 'Tab', 'Shift'], true);
    expect(await testPage.hasFocus(resizeControl)).toBe(true);

    // We've tabbed around a lot, everything is expanded, as expected…
    expect(await testPage.getAttribute(resizeControl, 'aria-expanded')).toBe(
      'true',
    );

    // "Enter" on the ResizeControl
    await testPage.keys('Enter');

    // Left sidebar should now be collapsed:
    expect(
      await testPage.getAttribute(resizeControl, 'aria-expanded'),
    ).not.toEqual(
      'true', // sometimes this is `null`, other times it's `"false"`
    );
  },
);
