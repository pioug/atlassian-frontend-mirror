import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  editable,
  copyToClipboard,
  gotoEditor,
} from '../../_helpers';

BrowserTestCase(
  `card: pressing backspace with the cursor at the end of Inline link should delete it`,
  {
    skip: ['safari', 'edge'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    // Copy stuff to clipboard
    await copyToClipboard(page, 'https://www.atlassian.com');

    await gotoEditor(page);

    // Paste the link
    await page.paste();

    await page.waitForSelector('.inlineCardView-content-wrap');

    // First backspace removes space at the end of Inline link
    await page.keys('Back space');
    // Second backspace removes the Inline link
    await page.keys('Back space');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
