import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import constant from 'lodash/constant';
import times from 'lodash/times';

import {
  callNativeBridge,
  editor,
  editable,
  skipBrowsers as skip,
  getBridgeOutput,
} from '../_utils';

BrowserTestCase(
  'currentSelection when no selection',
  // Safari has issues with key events
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, 'Normal Text');
    await browser.keys('ArrowLeft');

    const currentSelection = await getBridgeOutput(
      browser,
      'linkBridge',
      'currentSelection',
    );
    expect(currentSelection).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'currentSelection when selection',
  // Safari has issues with key events
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, 'Normal Text');
    await browser.keys([
      ...times(4, constant('ArrowLeft')),
      'Shift',
      ...times(4, constant('ArrowRight')),
      'Shift',
    ]);

    const currentSelection = await getBridgeOutput(
      browser,
      'linkBridge',
      'currentSelection',
    );
    expect(currentSelection).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'currentSelection when cursor is on link',
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
    await browser.keys('ArrowLeft');

    const currentSelection = await getBridgeOutput(
      browser,
      'linkBridge',
      'currentSelection',
    );
    expect(currentSelection).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'currentSelection when cursor is selecting a link',
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

    await browser.keys([
      ...times(9, constant('ArrowLeft')),
      'Shift',
      ...times(9, constant('ArrowRight')),
      'Shift',
    ]);

    const currentSelection = await getBridgeOutput(
      browser,
      'linkBridge',
      'currentSelection',
    );
    expect(currentSelection).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'currentSelection when cursor is selecting text and link',
  // Safari has issues with key events
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, 'This is a ');
    await callNativeBridge(
      browser,
      'onLinkUpdate',
      'link',
      'https://www.google.com',
    );

    await browser.keys([
      ...times(10, constant('ArrowLeft')),
      'Shift',
      ...times(10, constant('ArrowRight')),
      'Shift',
    ]);

    const currentSelection = await getBridgeOutput(
      browser,
      'linkBridge',
      'currentSelection',
    );

    expect(currentSelection).toMatchCustomSnapshot(testName);
  },
);
