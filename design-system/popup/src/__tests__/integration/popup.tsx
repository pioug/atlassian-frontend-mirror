import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  popupButton1Radio,
  popupContent,
  popupLinkContent,
  popupTextContent,
  popupTrigger,
} from '../../../examples/utils/selectors';

const urlPopupFocusIsNotOpen = getExampleUrl(
  'design-system',
  'popup',
  'setting-focus',
);

const urlPopupFocusIsOpen = getExampleUrl(
  'design-system',
  'popup',
  'setting-focus-isopen',
);

const urlPopupAutoFocus = getExampleUrl(
  'design-system',
  'popup',
  'popup-disable-autofocus-vr',
);

/* CSS Selectors */
const trigger = `#${popupTrigger}`;
const content = `#${popupContent}`;
const linkContent = `#${popupLinkContent}`;
const textContent = `#${popupTextContent}`;
const button1 = '#button-1';
const button1Radio = `#${popupButton1Radio}`;

// These test cases were moved from the unit tests because `focus-trap` doesn't
// work well with JSDom and any focus tests should be done within an actual
// browser. If this ever gets resolved and is consistent, these should
// definitely just be unit tests.

BrowserTestCase(
  'it does not focus the content when the popup is open',
  {},
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlPopupFocusIsOpen);

    await page.waitForSelector(content);

    expect(await page.hasFocus(textContent)).toBe(false);
  },
);

BrowserTestCase(
  'it does not focus the content when the popup is opened',
  {},
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlPopupFocusIsNotOpen);
    await page.click(trigger);

    await page.waitForSelector(content);

    expect(await page.hasFocus(textContent)).toBe(false);
  },
);

BrowserTestCase(
  'it focuses the specified element inside of the content when the popup is open',
  {},
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlPopupFocusIsOpen);

    await page.waitForSelector(content);

    expect(await page.hasFocus(button1)).toBe(true);
  },
);

BrowserTestCase(
  'it focuses the specified element inside of the content when the popup is opened',
  {},
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlPopupFocusIsNotOpen);
    await page.click(trigger);
    await page.waitForSelector(content);

    expect(await page.hasFocus(button1)).toBe(false);

    // Escape to close the popup
    await page.keys('\uE007');

    await page.click(button1Radio);
    await page.click(trigger);

    await page.waitForSelector(content);

    expect(await page.hasFocus(button1)).toBe(true);
  },
);

BrowserTestCase(
  'it does not focus on the popup when autoFocus is false',
  {},
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlPopupAutoFocus);
    await page.click(trigger);
    await page.waitForSelector(content);
    await page.waitForSelector(linkContent);

    expect(await page.hasFocus(content)).toBe(false);
    expect(await page.hasFocus(linkContent)).toBe(false);
  },
);
