import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
  linkUrlSelector,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDClipboardExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';

import { waitForInlineCardSelection } from '@atlaskit/media-integration-test-helpers';
import type Page from '@atlaskit/webdriver-runner/wd-wrapper';

// FIXME: This test was automatically skipped due to failure on 07/08/2023: https://product-fabric.atlassian.net/browse/ED-19388
BrowserTestCase(
  'card: changing the link URL of an inline link to another supported link should reresolve smart card',
  {
    skip: ['*'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    // Copy stuff to clipboard and go to editor
    const page = await goToEditorTestingWDClipboardExample(
      client,
      'https://www.atlassian.com',
    );
    await mountEditor(
      page,
      {
        appearance: fullpage.appearance,
        smartLinks: {
          allowEmbeds: true,
        },
      },
      {
        providers: {
          cards: true,
        },
      },
    );

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
