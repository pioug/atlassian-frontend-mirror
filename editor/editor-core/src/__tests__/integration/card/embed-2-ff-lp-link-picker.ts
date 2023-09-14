import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getDocFromElement,
  editable,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import * as embedCardAdf from './_fixtures_/embed-card.adf.json';
import { waitForEmbedCardSelection } from '@atlaskit/media-integration-test-helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { linkPickerSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

describe('with feature flag: lp-link-picker', () => {
  // FIXME: This test was automatically skipped due to failure on 25/06/2023: https://product-fabric.atlassian.net/browse/ED-18921
  BrowserTestCase(
    'card: changing the link URL of an embed link to an unsupported url should convert it to a "dumb" link',
    {
      skip: ['*'],
    },
    async (client: ClientType, testName: string) => {
      const page = await goToEditorTestingWDExample(client);

      const cardProviderPromise = Promise.resolve(
        new ConfluenceCardProvider('prod'),
      );

      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          allowTextAlignment: true,
          defaultValue: JSON.stringify(embedCardAdf),
          smartLinks: {
            provider: cardProviderPromise,
            allowBlockCards: true,
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

      await waitForEmbedCardSelection(page);

      const editLinkButtonSelector = 'button[aria-label="Edit link"]';
      await page.waitForSelector(editLinkButtonSelector);
      await page.click(editLinkButtonSelector);

      // Clear the Link Label field before typing
      await page.waitForSelector(linkPickerSelectors.linkInput, {
        timeout: 20000,
      });
      await page.clear(linkPickerSelectors.linkInput);

      // Change the 'link address' field to another link and press enter
      await page.type(linkPickerSelectors.linkInput, [
        'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
        'Return',
      ]);

      expect(
        await page.$eval(editable, getDocFromElement),
      ).toMatchCustomDocSnapshot(testName);
    },
  );
});
