import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, editable } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { ConfluenceCardProvider } from '../../../../examples/5-full-page-with-confluence-smart-cards';
import * as inlineCardAdf from './_fixtures_/inline-card.adf.json';
import { waitForInlineCardSelection } from '../../__helpers/page-objects/_cards';

type ClientType = Parameters<typeof goToEditorTestingExample>[0];

BrowserTestCase(
  'card: copy-paste within editor should work',
  { skip: ['safari', 'ie', 'edge'] },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingExample(client);

    const cardProviderPromise = Promise.resolve(
      new ConfluenceCardProvider('prod'),
    );

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(inlineCardAdf),
      UNSAFE_cards: {
        provider: cardProviderPromise,
      },
    });

    // Wait for the inline link.
    await waitForInlineCardSelection(page);

    // Copy the link.
    await page.copy();
    await page.keys(['ArrowRight']);

    // Type some text.
    await page.type(editable, ' have another one ');
    await page.paste();

    // Type some more text.
    await page.type(editable, 'now you have two!');

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
