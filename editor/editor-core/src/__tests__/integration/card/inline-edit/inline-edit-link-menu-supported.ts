import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
  copyToClipboard,
  gotoEditor,
  linkUrlSelector,
  clearLinkToolbarUrl,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { waitForInlineCardSelection } from '@atlaskit/media-integration-test-helpers';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { linkPickerSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

BrowserTestCase(
  `card: selecting an inline card and choosing a new page from edit-link menu should update title and url for supported link`,
  {
    skip: ['safari', 'firefox'],
  },
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

    await clearLinkToolbarUrl(page);

    // Choosing a supported link
    await page.type(linkUrlSelector, 'home opt-in');
    await page.keys(['ArrowDown', 'Return']);

    await waitForInlineCardSelection(page);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

describe('with feature flag: lp-link-picker', () => {
  BrowserTestCase(
    `card: selecting an inline card and choosing a new page from edit-link menu should update title and url for supported link`,
    {
      skip: ['safari', 'firefox'],
    },
    async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
      let page = new Page(client);

      // Copy stuff to clipboard
      await copyToClipboard(page, 'https://www.atlassian.com');

      page = await goToEditorTestingWDExample(client);
      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          smartLinks: {
            allowEmbeds: true,
          },
          featureFlags: {
            'lp-link-picker': true,
          },
        },
        {
          withLinkPickerOptions: true,
        },
      );

      // Paste the link
      await page.paste();
      await page.keys('Enter');

      await waitForInlineCardSelection(page);
      await page.click('button[aria-label="Edit link"]');

      await page.clear(linkPickerSelectors.linkInput);

      // Choosing a supported link
      await page.type(linkPickerSelectors.linkInput, 'home opt-in');
      await page.keys(['ArrowDown', 'Return']);

      await waitForInlineCardSelection(page);

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
