import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { ConfluenceCardProvider } from '../../../../examples/5-full-page-with-confluence-smart-cards';
import {
  waitForBlockCardSelection,
  waitForEmbedCardSelection,
} from '@atlaskit/media-integration-test-helpers';
import * as embedCardAdf from './_fixtures_/embed-card.adf.json';

type ClientType = Parameters<typeof goToEditorTestingExample>[0];

BrowserTestCase(
  'card: should set contentediable=true on blocks and embeds',
  { skip: ['safari', 'edge', 'firefox'] },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingExample(client);

    const cardProviderPromise = Promise.resolve(
      new ConfluenceCardProvider('prod'),
    );

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(embedCardAdf),
      UNSAFE_cards: {
        provider: cardProviderPromise,
        allowBlockCards: true,
        allowEmbeds: true,
      },
    });

    await waitForEmbedCardSelection(page);
    expect(
      await page.isExisting(
        '.embedCardView-content-wrap[contenteditable=true]',
      ),
    ).toBe(true);

    await page.waitForSelector('span[aria-label="Expand dropdown menu"]');
    await page.click('span[aria-label="Expand dropdown menu"]');
    await page.waitForSelector('[data-testid="block-appearance"]');
    await page.click('[data-testid="block-appearance"]');
    await waitForBlockCardSelection(page);
    expect(
      await page.isExisting(
        '.blockCardView-content-wrap[contenteditable=true]',
      ),
    ).toBe(true);
  },
);
