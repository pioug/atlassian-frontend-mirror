import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
  copyToClipboard,
  gotoEditor,
  linkLabelSelector,
} from '../../_helpers';
import { waitForInlineCardSelection } from '@atlaskit/media-integration-test-helpers';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

BrowserTestCase(
  'card: changing the link label of an inline link should convert it to a "dumb" link',
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
    // Clear the Link Label field before typing
    await page.clear(linkLabelSelector);
    // Change the 'text to display' field to 'New heading' and press enter
    await page.type(linkLabelSelector, 'New heading\n');

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
