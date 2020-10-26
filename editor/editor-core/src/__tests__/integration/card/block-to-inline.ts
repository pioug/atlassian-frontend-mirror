import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { ConfluenceCardProvider } from '../../../../examples/5-full-page-with-confluence-smart-cards';
import * as blockCardAdf from './_fixtures_/block-card-with-empty-p-at-bottom.adf.json';
import { waitForBlockCardSelection } from '@atlaskit/media-integration-test-helpers';
import { getDocFromElement, editable, getProseMirrorPos } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

BrowserTestCase(
  `card: should switch to inline mode with proper cursor position`,
  { skip: [] },
  async (client: any, testName: string) => {
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
    await page.click('div[aria-label="Floating Toolbar"] button');
    // Click the "Display inline" to switch to inline card
    await page.click('[data-testid="inline-appearance"]');

    expect(await getProseMirrorPos(page)).toEqual(4);
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
