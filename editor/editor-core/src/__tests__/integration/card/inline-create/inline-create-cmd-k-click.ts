import {
  editable,
  fullpage,
  getDocFromElement,
  insertLongText,
  linkUrlSelector,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { linkPickerSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { messages } from '../../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';

// FIXME: This test was automatically skipped due to failure on 27/03/2023: https://product-fabric.atlassian.net/browse/ED-17304
BrowserTestCase(
  `card: selecting a link from CMD + K menu should create an inline card with click`,
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

    await insertLongText(page);
    await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
    await page.waitForSelector(linkUrlSelector);

    await page.type(linkUrlSelector, 'home opt-in');
    await page.remoteDOMClick('[data-testid="link-search-list-item"]');
    await page.waitForSelector('[data-testid="inline-card-resolved-view"]');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

describe('with feature flag: lp-link-picker', () => {
  // FIXME: This test was automatically skipped due to failure on 27/03/2023: https://product-fabric.atlassian.net/browse/ED-17304
  BrowserTestCase(
    `card: selecting a link from CMD + K menu should create an inline card with click`,
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
          featureFlags: {
            'lp-link-picker': true,
          },
        },
        {
          providers: {
            cards: true,
          },
          withLinkPickerOptions: true,
        },
      );

      await insertLongText(page);
      await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
      await page.waitForSelector(linkPickerSelectors.linkInput);

      await page.type(linkPickerSelectors.linkInput, 'home opt-in');
      await page.remoteDOMClick('[data-testid="link-search-list-item"]');
      await page.waitForSelector('[data-testid="inline-card-resolved-view"]');

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
