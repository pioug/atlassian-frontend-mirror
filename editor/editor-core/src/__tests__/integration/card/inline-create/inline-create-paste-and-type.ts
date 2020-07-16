import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  editable,
  copyToClipboard,
  gotoEditor,
} from '../../_helpers';

BrowserTestCase(
  `card: pasting an link then typing still converts to inline card`,
  { skip: ['safari', 'edge'] },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    // Copy stuff to clipboard
    await copyToClipboard(page, 'https://www.atlassian.com');

    await gotoEditor(page);

    // Type some text into the paragraph first
    await page.type(editable, 'hello have a link ');

    // Paste the link
    await page.paste();

    // Type some text after it
    await page.type(editable, 'more typing');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
