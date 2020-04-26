import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
  copyToClipboard,
  selectInlineLink,
  gotoEditor,
} from '../_helpers';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

BrowserTestCase(
  'card: changing the link URL of an inline link should convert it to a "dumb" link',
  { skip: ['safari', 'ie', 'edge'] },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    // Copy stuff to clipboard
    await copyToClipboard(page, 'https://www.atlassian.com');

    await gotoEditor(page);

    // Paste the link
    await page.paste();

    await selectInlineLink(page);

    await page.click('button[aria-label="Edit link"]');
    // Clear the Link Label field before typing
    await page.clear('[data-testid="link-url"]');
    // Change the 'link address' field to another link and press enter
    await page.type(
      '[data-testid="link-url"]',
      'https://onedrive.live.com/redir?resid=5D04B397F4A8ABE!1004&authkey=!AN4C7co5280OG_Y\n',
    );
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
