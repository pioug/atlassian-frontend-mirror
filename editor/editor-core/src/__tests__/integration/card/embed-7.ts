import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import * as twoEmbedsAdf from './_fixtures_/two-embeds.adf.json';
import {
  waitForEmbedCardSelection,
  waitForResolvedEmbedCard,
} from '@atlaskit/media-integration-test-helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

BrowserTestCase(
  'embed: React shall not apply the same state to two different cards',
  { skip: [] },
  async (client: ClientType) => {
    const page = await goToEditorTestingWDExample(client);
    const cardProviderPromise = Promise.resolve(
      new ConfluenceCardProvider('prod'),
    );

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(twoEmbedsAdf),
      smartLinks: {
        provider: cardProviderPromise,
        allowBlockCards: true,
        allowEmbeds: true,
      },
    });

    // make sure that two embed are resolved
    await waitForResolvedEmbedCard(
      page,
      'resolved',
      'https://product-fabric.atlassian.net/wiki/1',
    );
    await waitForResolvedEmbedCard(
      page,
      'resolved',
      'https://product-fabric.atlassian.net/wiki/2',
    );

    // select and remove the first embed
    await waitForEmbedCardSelection(page);
    await page.keys('Backspace');

    // second embed should still be there
    await waitForResolvedEmbedCard(
      page,
      'resolved',
      'https://product-fabric.atlassian.net/wiki/2',
    );
  },
);
