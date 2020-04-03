import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  clipboardHelper as editorClipboardHelper,
  editable,
  getDocFromElement,
  clipboardInput,
  copyButton,
  skipBrowsers as skip,
} from '../_utils';

BrowserTestCase(
  `inline-1.ts: pasting an link converts to inline card`,
  {
    skip: skip.concat('safari'),
  },
  async (client: any, testCase: string) => {
    let browser = new Page(client);

    // open up editor
    await browser.goto(editorClipboardHelper.path);
    await browser.waitForSelector(editable);
    await browser.isVisible(clipboardInput);
    await browser.type(clipboardInput, 'https://www.atlassian.com');
    await browser.click(copyButton);
    await browser.waitForSelector(editorClipboardHelper.placeholder);
    await browser.click(editorClipboardHelper.placeholder);
    await browser.waitForSelector(editable);
    await browser.type(editable, 'here is a link ');

    // // paste the link
    await browser.paste();
    await browser.type(editable, ' hello ');

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testCase);
  },
);
