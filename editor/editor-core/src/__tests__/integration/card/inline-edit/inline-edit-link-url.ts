import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
  copyToClipboard,
  gotoEditor,
  linkUrlSelector,
} from '../../_helpers';

import { waitForInlineCardSelection } from '@atlaskit/media-integration-test-helpers';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

BrowserTestCase(
  'card: changing the link URL of an inline link should convert it to a "dumb" link',
  { skip: ['safari', 'edge'] },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    // Copy stuff to clipboard
    await copyToClipboard(page, 'https://www.atlassian.com');

    await gotoEditor(page);

    // Paste the link
    await page.paste();

    await waitForInlineCardSelection(page);

    await page.click('button[aria-label="Edit link"]');
    // Clear the Link Url field before typing
    await page.clear(linkUrlSelector);
    // Change the 'link address' field to another link and press enter
    await page.type(linkUrlSelector, [
      'https://onedrive.live.com/redir?resid=5D04B397F4A8ABE!1004&authkey=!AN4C7co5280OG_Y',
      'Return',
    ]);
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
