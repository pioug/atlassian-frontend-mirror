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
  'card: changing the link URL of an inline link to another supported link should reresolve smart card',
  { skip: ['safari', 'edge', 'firefox'] },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    // Copy stuff to clipboard
    await copyToClipboard(page, 'https://www.atlassian.com');

    await gotoEditor(page);

    // Paste the link
    await page.paste();
    await page.keys('Enter');

    await waitForInlineCardSelection(page);

    await page.click('button[aria-label="Edit link"]');
    // Clear the Link Url field before typing
    await page.clear(linkUrlSelector);

    // Change the 'link address' field to another supported link and press enter
    await page.type(linkUrlSelector, [
      'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
    ]);
    await page.keys('Enter');

    // Ensure smart card still exists
    await waitForInlineCardSelection(page);
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
