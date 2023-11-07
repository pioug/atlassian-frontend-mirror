import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import type Page from '@atlaskit/webdriver-runner/wd-wrapper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { linkPickerSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getDocFromElement,
  editable,
  linkUrlSelector,
  linkLabelSelector,
  insertLongText,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';

const mockLinkSearchTitle = 'home opt-in';
const mockLinkUrlEndsWith = 'Home+opt-in+requests';

// FIXME: This test was automatically skipped due to failure on 27/06/2023: https://product-fabric.atlassian.net/browse/ED-18930
BrowserTestCase(
  'card: inserting a link with CMD + K with keyboard should retain display text and insert a blue link',
  {
    skip: ['*'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = await goToEditorTestingWDExample(client);
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

    // Open up the link toolbar from the Editor toolbar (top).
    await insertLongText(page);
    await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
    await page.waitForSelector(linkUrlSelector);
    await page.waitForSelector(linkLabelSelector);

    // Find the link we want to insert.
    await page.type(linkUrlSelector, [mockLinkSearchTitle, 'Tab']);
    // Give the link display text.
    await page.type(linkLabelSelector, [
      'Go hard or go home',
      'ArrowDown',
      'Return',
    ]);

    // Ensure a link has been inserted.
    await page.waitForSelector(`a[href$="${mockLinkUrlEndsWith}"]`);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

describe('with feature flag: lp-link-picker', () => {
  // FIXME: This test was automatically skipped due to failure on 27/06/2023: https://product-fabric.atlassian.net/browse/ED-18930
  BrowserTestCase(
    'card: inserting a link with CMD + K with keyboard should retain display text and insert a blue link',
    {
      skip: ['*'],
    },
    async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          smartLinks: {},
          featureFlags: {
            'lp-link-picker': true,
          },
        },
        {
          withLinkPickerOptions: true,
        },
      );

      // Open up the link toolbar from the Editor toolbar (top).
      await insertLongText(page);
      await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
      await page.waitForSelector(linkPickerSelectors.linkInput);
      await page.waitForSelector(linkPickerSelectors.linkDisplayTextInput);

      // Find the link we want to insert.
      await page.type(linkPickerSelectors.linkInput, [
        mockLinkSearchTitle,
        'Tab',
      ]);
      // Give the link display text.
      await page.type(linkPickerSelectors.linkDisplayTextInput, [
        'Go hard or go home',
      ]);

      await page.type(linkPickerSelectors.linkInput, ['ArrowDown', 'Return']);

      // Ensure a link has been inserted.
      await page.waitForSelector(`a[href$="${mockLinkUrlEndsWith}"]`);

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
