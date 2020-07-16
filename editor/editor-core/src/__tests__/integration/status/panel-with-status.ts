import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
} from '../_helpers';

// TODO: safari keys do not work after upgrade
BrowserTestCase(
  'status.ts: Insert status into panel, move cursor to right before status, and add text',
  { skip: ['edge', 'safari'] },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);
    await browser.click(editable);

    await quickInsert(browser, 'Info panel');

    await quickInsert(browser, 'Status');

    await browser.waitForSelector(`[aria-label="Popup"] input`);
    await browser.type(`[aria-label="Popup"] input`, 'DONE');
    await browser.click(editable);
    await browser.keys([
      'Backspace',
      'ArrowLeft',
      'ArrowLeft',
      'S',
      'o',
      'm',
      'e',
      ' ',
      't',
      'e',
      'x',
      't',
    ]);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'status.ts: Insert status into panel, move cursor to right before panel, move right, and add text',
  { skip: ['edge', 'safari'] },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);
    await browser.click(editable);

    await quickInsert(browser, 'Info panel');

    await quickInsert(browser, 'Status');

    await browser.waitForSelector(`[aria-label="Popup"] input`);
    await browser.type(`[aria-label="Popup"] input`, 'DONE');
    await browser.click(editable);
    await browser.keys([
      'Backspace',
      'ArrowLeft',
      'ArrowLeft',
      'ArrowLeft',
      'ArrowRight',
      'S',
      'o',
      'm',
      'e',
      ' ',
      't',
      'e',
      'x',
      't',
    ]);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
