import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import * as embedCardAdf from './_fixtures_/embed-card.adf.json';
import { waitForEmbedCardSelection } from '@atlaskit/media-integration-test-helpers';
import { linkPickerSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

describe('with feature flag: lp-link-picker', () => {
  // FIXME: This test was automatically skipped due to failure on 08/03/2023: https://product-fabric.atlassian.net/browse/ED-17095
  BrowserTestCase(
    'card: changing the link label of an embed link should convert it to a "dumb" link',
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
      await page.waitForSelector(linkPickerSelectors.linkDisplayTextInput, {
        timeout: 20000,
      });

      await page.clear(linkPickerSelectors.linkDisplayTextInput);
      // Change the 'text to display' field to 'New heading' and press enter
      await page.type(linkPickerSelectors.linkDisplayTextInput, 'New heading');
      await page.keys(['Enter']);

      expect(
        await page.$eval(editable, getDocFromElement),
      ).toMatchCustomDocSnapshot(testName);
    },
  );
});
