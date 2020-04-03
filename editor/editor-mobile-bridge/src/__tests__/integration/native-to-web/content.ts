import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  callNativeBridge,
  editor,
  editable,
  getDocFromElement,
  navigateOrClear,
  skipBrowsers as skip,
} from '../_utils';

import { invalidAdf } from './__fixtures__/invalid-adf';

BrowserTestCase(
  `Can properly set content when given invalid nodes`,
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await navigateOrClear(browser, editor.path);
    await browser.waitForSelector(`${editable} > p`);
    await callNativeBridge(browser, 'setContent', JSON.stringify(invalidAdf));

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
