import type { BrowserObject } from 'webdriverio';

import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const exampleUrl = getExampleUrl('design-system', 'blanket', 'variants');

/* Css selectors used for the test */
const toggleIsTinted = "[data-testid='is-tinted']";
const toggleClickThrough = "[data-testid='allow-click-through']";
const increment = "[data-testid='increment']";
const count = "[data-testid='count']";

/**
 * Default state in example is:
 *  - isTinted={false}
 *  - shouldAllowClickThrough={true}
 */

BrowserTestCase(
  'can click through un-tinted blanket when click through allowed',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(exampleUrl);

    await page.waitForSelector(count);
    expect(await page.getText(count)).toBe('0');

    await page.click(increment);
    expect(await page.getText(count)).toBe('1');
  },
);

BrowserTestCase(
  'can click through tinted blanket when click through allowed',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(exampleUrl);

    await page.waitForSelector(toggleIsTinted);
    await page.click(toggleIsTinted);

    await page.waitForSelector(count);
    expect(await page.getText(count)).toBe('0');

    await page.click(increment);
    expect(await page.getText(count)).toBe('1');
  },
);

BrowserTestCase(
  'cannot click through un-tinted blanket when click through disallowed',
  {},
  async (client: BrowserObject) => {
    const page = new Page(client);
    await page.goto(exampleUrl);

    await page.waitForSelector(toggleClickThrough);
    await page.click(toggleClickThrough);

    await page.waitForSelector(count);
    expect(await page.getText(count)).toBe('0');

    await expect(page.click(increment)).rejects.toThrow();
    expect(await page.getText(count)).toBe('0');
  },
);

BrowserTestCase(
  'cannot click through tinted blanket when click through disallowed',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(exampleUrl);

    await page.waitForSelector(toggleIsTinted);
    await page.click(toggleIsTinted);

    await page.waitForSelector(toggleClickThrough);
    await page.click(toggleClickThrough);

    await page.waitForSelector(count);
    expect(await page.getText(count)).toBe('0');

    await expect(page.click(increment)).rejects.toThrow();
    expect(await page.getText(count)).toBe('0');
  },
);
