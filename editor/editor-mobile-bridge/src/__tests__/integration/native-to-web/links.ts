import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import constant from 'lodash/constant';
import times from 'lodash/times';

import {
  callNativeBridge,
  editor,
  editable,
  getDocFromElement,
  skipBrowsers as skip,
} from '../_utils';

BrowserTestCase(
  `links.ts: Insert link on empty content`,
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, '');
    await callNativeBridge(
      browser,
      'onLinkUpdate',
      'Atlassian',
      'https://www.google.com',
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `links.ts: Insert link on existing text node`,
  // Safari has issues with key events
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, 'This is a text');
    await browser.keys([...times(4, constant('ArrowLeft'))]);

    await callNativeBridge(
      browser,
      'onLinkUpdate',
      'link',
      'https://www.google.com',
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `links.ts: Insert link with text selection`,
  // Safari has issues with key events
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, 'This is a link with trailing text');
    await browser.keys([
      ...times(23, constant('ArrowLeft')),
      'Shift',
      ...times(4, constant('ArrowRight')),
      'Shift',
    ]);

    await callNativeBridge(
      browser,
      'onLinkUpdate',
      'link',
      'https://www.google.com',
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `links.ts: change link text`,
  // Safari has issues with key events
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, '');
    await callNativeBridge(
      browser,
      'onLinkUpdate',
      'Atlassian',
      'https://www.google.com',
    );

    await browser.keys([...times(4, constant('ArrowLeft'))]);

    await callNativeBridge(
      browser,
      'onLinkUpdate',
      'This is Atlassian',
      'https://www.google.com',
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `links.ts: change link href`,
  // Safari has issues with key events
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, '');
    await callNativeBridge(
      browser,
      'onLinkUpdate',
      'Google',
      'https://www.google.com',
    );

    await browser.keys([...times(4, constant('ArrowLeft'))]);

    await callNativeBridge(
      browser,
      'onLinkUpdate',
      'Google',
      'https://www.google2.com',
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `links.ts: Remove link`,
  // Safari has issues with key events
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, 'This is a link');
    await browser.keys([
      ...times(4, constant('ArrowLeft')),
      'Shift',
      ...times(4, constant('ArrowRight')),
      'Shift',
    ]);

    await callNativeBridge(
      browser,
      'onLinkUpdate',
      'link',
      'https://www.google.com',
    );

    await browser.keys([
      ...times(4, constant('ArrowLeft')),
      'Shift',
      ...times(4, constant('ArrowRight')),
      'Shift',
    ]);

    await callNativeBridge(browser, 'onLinkUpdate', 'text', '');

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
