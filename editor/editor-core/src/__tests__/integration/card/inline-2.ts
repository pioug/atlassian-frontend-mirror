import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  fullpage,
  editable,
  copyToClipboard,
} from '../_helpers';

BrowserTestCase(
  `inline-2.ts: pasting an link then typing still converts to inline card`,
  { skip: ['ie', 'safari', 'edge'] },
  async (client: any, testName: string) => {
    let browser = new Page(client);

    // copy stuff to clipboard
    await copyToClipboard(browser, 'https://www.atlassian.com');

    // open up editor
    await browser.goto(fullpage.path);
    await browser.waitForSelector(fullpage.placeholder);
    await browser.click(fullpage.placeholder);
    await browser.waitForSelector(editable);

    // type some text into the paragraph first
    await browser.type(editable, 'hello have a link ');

    // paste the link
    await browser.paste();

    // type some text after it
    await browser.type(editable, 'more typing');

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
