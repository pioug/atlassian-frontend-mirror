import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import { testId } from '../../../examples/98-testing-ddm-keyboard-navigation';

/* Urls to test the example */
const urlDropdown = getExampleUrl(
  'design-system',
  'dropdown-menu',
  'testing-ddm-keyboard-navigation',
);
const urlDropdownDisabled = getExampleUrl(
  'design-system',
  'dropdown-menu',
  'testing-ddm-keyboard-navigation-disabled',
);

/* Css selectors used for the test */
const getNthButtonSelector = (n: number) => {
  let selector = 'button[role="menuitem"]';
  let result = selector;

  for (let i = 1; i < n; i++) {
    result += ` + ${selector}`;
  }

  return result;
};

const trigger = `[data-testid="${testId}--trigger"]`;
const dropdownMenu = `[data-testid="${testId}--content"]`;
const firstButton = getNthButtonSelector(1);
const secondButton = getNthButtonSelector(2);
const thirdButton = getNthButtonSelector(3);
const fourthButton = getNthButtonSelector(4);
const fifthButton = getNthButtonSelector(5);
const sixthButton = getNthButtonSelector(6);

const setFocusOnTrigger = async (page: any) => {
  // Not a native way to just set focus, so I am tabbing to only element, the
  // trigger.
  await page.keys('Tab');
};

BrowserTestCase(
  'should NOT open the menu when DOWN arrow is pressed while the trigger is NOT focused',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlDropdown);

    await page.waitForSelector(trigger);
    await page.keys('Down arrow');

    expect(await page.isExisting(dropdownMenu)).toBe(false);
  },
);

BrowserTestCase(
  'should open the menu when DOWN arrow is pressed while the trigger is focused',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlDropdown);

    await page.waitForSelector(trigger);

    await setFocusOnTrigger(page);
    await page.keys('Down arrow');

    expect(await page.isExisting(dropdownMenu)).toBe(true);
  },
);

BrowserTestCase(
  'should focus the first element by default when accessed using a keyboard',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlDropdown);

    await page.waitForSelector(trigger);

    await setFocusOnTrigger(page);
    await page.keys('Down arrow');

    await page.waitForSelector(dropdownMenu);
    await page.waitForSelector(firstButton);

    expect(await page.hasFocus(firstButton)).toBe(true);
  },
);

BrowserTestCase(
  'should focus the content wrapper when clicked with a mouse',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlDropdown);

    await page.waitForSelector(trigger);

    await page.click(trigger);

    await page.waitForSelector(dropdownMenu);

    expect(await page.hasFocus(dropdownMenu)).toBe(true);
  },
);

BrowserTestCase(
  'should focus the next element on pressing the DOWN arrow',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlDropdown);

    await page.waitForSelector(trigger);

    await page.click(trigger);

    await page.waitForSelector(dropdownMenu);
    await page.waitForSelector(firstButton);
    await page.waitForSelector(secondButton);
    await page.waitForSelector(thirdButton);

    await page.keys('Down arrow'); // First button
    await page.keys('Down arrow'); // Second button

    expect(await page.hasFocus(secondButton)).toBe(true);
  },
);

BrowserTestCase(
  'should focus the previous element on pressing the UP arrow',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlDropdown);

    await page.waitForSelector(trigger);

    await page.click(trigger);

    await page.waitForSelector(dropdownMenu);
    await page.waitForSelector(firstButton);

    await page.keys('Down arrow'); // First button
    await page.keys('Down arrow'); // Second button
    expect(await page.hasFocus(secondButton)).toBe(true);

    await page.keys('Up arrow');
    expect(await page.hasFocus(firstButton)).toBe(true);
  },
);

BrowserTestCase(
  'should focus the first element on pressing HOME',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlDropdown);

    await page.waitForSelector(trigger);

    await page.click(trigger);

    await page.waitForSelector(dropdownMenu);
    await page.waitForSelector(firstButton);

    await page.keys('Down arrow'); // First button
    await page.keys('Down arrow'); // Second button
    expect(await page.hasFocus(secondButton)).toBe(true);

    await page.keys('Home');
    expect(await page.hasFocus(firstButton)).toBe(true);
  },
);

BrowserTestCase(
  'should focus the last element on pressing END',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlDropdown);

    await page.waitForSelector(trigger);

    await page.click(trigger);

    await page.waitForSelector(dropdownMenu);
    await page.waitForSelector(firstButton);

    expect(await page.hasFocus(dropdownMenu)).toBe(true);

    await page.keys('End'); // three total buttons in example
    expect(await page.hasFocus(thirdButton)).toBe(true);
  },
);

BrowserTestCase(
  'should not let the focus loop to the last element',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlDropdown);

    await page.waitForSelector(trigger);

    await page.click(trigger);

    await page.waitForSelector(dropdownMenu);
    await page.waitForSelector(firstButton);

    await page.keys('Down arrow');
    expect(await page.hasFocus(firstButton)).toBe(true);

    await page.keys('Up arrow');
    expect(await page.hasFocus(firstButton)).toBe(true);
  },
);

BrowserTestCase(
  'should not let the focus loop to the first element',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlDropdown);

    await page.waitForSelector(trigger);

    await page.click(trigger);

    await page.waitForSelector(dropdownMenu);
    await page.waitForSelector(firstButton);

    await page.keys('End'); // three total buttons in example
    expect(await page.hasFocus(thirdButton)).toBe(true);

    await page.keys('Down arrow');
    expect(await page.hasFocus(thirdButton)).toBe(true);
  },
);

BrowserTestCase(
  'should skip over disabled items while keyboard navigating',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(urlDropdownDisabled);

    await page.waitForSelector(trigger);

    await page.click(trigger);

    await page.waitForSelector(dropdownMenu);
    await page.waitForSelector(firstButton);

    await page.keys('Down arrow'); // Second button, first is disabled
    await page.keys('Down arrow'); // Fourth button, third is disabled
    expect(await page.hasFocus(secondButton)).toBe(false);
    expect(await page.hasFocus(fourthButton)).toBe(true);

    await page.keys('Up arrow'); // Second button, third is disabled
    expect(await page.hasFocus(thirdButton)).toBe(false);
    expect(await page.hasFocus(secondButton)).toBe(true);

    await page.keys('End'); // Fifth button, sixth is disabled
    expect(await page.hasFocus(sixthButton)).toBe(false);
    expect(await page.hasFocus(fifthButton)).toBe(true);

    await page.keys('Home'); // Second button, first is disabled
    expect(await page.hasFocus(firstButton)).toBe(false);
    expect(await page.hasFocus(secondButton)).toBe(true);
  },
);
