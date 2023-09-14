import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getDocFromElement,
  editable,
  linkUrlSelector,
  clearLinkToolbarUrl,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDClipboardExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { waitForInlineCardSelection } from '@atlaskit/media-integration-test-helpers';
import type Page from '@atlaskit/webdriver-runner/wd-wrapper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { linkPickerSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

BrowserTestCase(
  `card: selecting an inline card and choosing a new page from edit-link menu should update title and url for supported link`,
  {
    skip: ['safari', 'firefox'],
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
