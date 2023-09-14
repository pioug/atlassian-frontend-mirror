import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getDocFromElement,
  editable,
  linkLabelSelector,
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
  'card: changing the link label of an inline link should convert it to a "dumb" link',
  { skip: ['safari', 'firefox'] },
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
    // Clear the Link Label field before typing
    await page.clear(linkLabelSelector);
    // Change the 'text to display' field to 'New heading' and press enter
    await page.type(linkLabelSelector, 'New heading\n');

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);

describe('with feature flag: lp-link-picker', () => {
  BrowserTestCase(
    'card: changing the link label of an inline link should convert it to a "dumb" link',
    { skip: ['safari', 'firefox'] },
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
      // Clear the Link Label field before typing
      await page.clear(linkPickerSelectors.linkDisplayTextInput);
      // Change the 'text to display' field to 'New heading' and press enter
      await page.type(
        linkPickerSelectors.linkDisplayTextInput,
        'New heading\n',
      );

      expect(
        await page.$eval(editable, getDocFromElement),
      ).toMatchCustomDocSnapshot(testName);
    },
  );
});
