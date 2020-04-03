import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, editable } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { ConfluenceCardProvider } from '../../../../examples/5-full-page-with-confluence-smart-cards';
import * as inlineCardAdf from './_fixtures_/inline-card.adf.json';

BrowserTestCase(
  'card: should be able to switch views with view switcher',
  { skip: ['safari', 'ie'] },
  async (client: any, testName: string) => {
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
        allowBlockCards: true,
      },
    });

    await page.waitForSelector('.inlineCardView-content-wrap');
    await page.click('.inlineCardView-content-wrap');
    await page.waitForSelector('div[aria-label="Floating Toolbar"]');
    await page.click('span[aria-label="Expand dropdown menu"]');
    await page.click('div[data-role="droplistContent"] [role="button"]');

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
