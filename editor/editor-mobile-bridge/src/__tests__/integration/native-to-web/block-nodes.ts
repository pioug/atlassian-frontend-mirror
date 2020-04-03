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

['action', 'decision', 'blockquote', 'codeblock', 'panel', 'table'].forEach(
  node => {
    BrowserTestCase(
      `block-nodes.ts: Inserts ${node} and results in valid ADF`,
      { skip },
      async (client: any, testName: string) => {
        const browser = new Page(client);

        await navigateOrClear(browser, editor.path);
        await browser.waitForSelector(`${editable} > p`);
        await callNativeBridge(browser, 'insertBlockType', node);

        const doc = await browser.$eval(editable, getDocFromElement);
        expect(doc).toMatchCustomDocSnapshot(testName);
      },
    );
  },
);
