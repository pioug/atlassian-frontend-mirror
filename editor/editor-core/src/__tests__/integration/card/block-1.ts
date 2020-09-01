import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, editable } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { ConfluenceCardProvider } from '../../../../examples/5-full-page-with-confluence-smart-cards';
import * as blockCardAdf from './_fixtures_/block-card.adf.json';
import { waitForBlockCardSelection } from '@atlaskit/media-integration-test-helpers';

type ClientType = Parameters<typeof goToEditorTestingExample>[0];

BrowserTestCase(
  'card: changing the link label of a block link should convert it to a "dumb" link',
  { skip: ['safari', 'edge'] },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingExample(client);

    const cardProviderPromise = Promise.resolve(
      new ConfluenceCardProvider('prod'),
    );

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(blockCardAdf),
      UNSAFE_cards: {
        provider: cardProviderPromise,
        allowBlockCards: true,
      },
    });

    await waitForBlockCardSelection(page);
    await page.click('button[aria-label="Edit link"]');
    // Clear the Link Label field before typing
    await page.clear('[data-testid="link-label"]');
    // Change the 'text to display' field to 'New heading' and press enter
    await page.type('[data-testid="link-label"]', 'New heading\n');

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
