import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, editable } from '../../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../__helpers/testing-example-helpers';
import * as inlineCardAdf from '../_fixtures_/inline-card.adf.json';
import { waitForInlineCardSelection } from '@atlaskit/media-integration-test-helpers';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

BrowserTestCase(
  'card: should be able to switch views with view switcher',
  { skip: ['safari', 'edge', 'chrome', 'firefox'] },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(inlineCardAdf),
      smartLinks: {
        allowBlockCards: true,
      },
    });

    await waitForInlineCardSelection(page);
    await page.click('span[aria-label="Expand dropdown menu"]');

    await page.waitForSelector('[data-testid="block-appearance"]');
    await page.click('[data-testid="block-appearance"]');

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
