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

BrowserTestCase(
  `type-ahead.ts: Replaces typeahead mark on insert`,
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await navigateOrClear(browser, editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, '@Fre');

    const typeAheadItem = {
      id: '123',
      name: 'Fred',
      nickname: 'Freddy',
      userType: 'DEFAULT',
      accessLevel: '',
    };

    await callNativeBridge(
      browser,
      'insertTypeAheadItem',
      'mention',
      JSON.stringify(typeAheadItem),
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
