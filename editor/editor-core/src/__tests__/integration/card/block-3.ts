import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { waitForBlockCardSelection } from '@atlaskit/media-integration-test-helpers';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import * as blockCardAdf from './_fixtures_/block-card.adf.json';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

BrowserTestCase(
  'card: copy paste of link should work as expected in editor',
  { skip: [] },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const cardProviderPromise = Promise.resolve(
      new ConfluenceCardProvider('prod'),
    );

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(blockCardAdf),
      smartLinks: {
        provider: cardProviderPromise,
        allowBlockCards: true,
      },
    });

    await waitForBlockCardSelection(page);
    // Copy the current link.
    await page.copy();
    // Type some text.
    await page.keys(['ArrowRight']);
    await page.type(editable, '\nhave another one\n');
    // Paste into same session - there should be two now.
    await page.paste();
    // Type some more text.
    await page.keys(['ArrowRight']);
    await page.type(editable, '\nnow you have two!');

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
