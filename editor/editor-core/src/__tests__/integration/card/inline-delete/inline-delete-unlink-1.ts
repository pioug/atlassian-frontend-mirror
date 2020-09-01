import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  editable,
  copyToClipboard,
  gotoEditor,
} from '../../_helpers';
import { waitForInlineCardSelection } from '@atlaskit/media-integration-test-helpers';

BrowserTestCase(
  `card: unlinking an Inline Link should replace it with text corresponding to the title of the previously linked page`,
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

    await waitForInlineCardSelection(page);
    await page.click('button[aria-label="Unlink"]');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
