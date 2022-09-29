import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];
import * as inlineCardAdf from '../_fixtures_/inline-card-selection.adf.json';
import { waitForInlineCardSelection } from '@atlaskit/media-integration-test-helpers';

// This test aims to cover a Chrome selection issue : ED-13066
BrowserTestCase(
  'card: press up key under a long smart link will select the link',
  { skip: ['safari', 'firefox'] },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(inlineCardAdf),
      smartLinks: {},
      featureFlags: {
        chromeCursorHandlerFixedVersion: '999',
      },
    });

    // Wait for the inline link.
    await waitForInlineCardSelection(page);

    await page.click('.inlineCardView-content-wrap');

    await page.keys(['ArrowRight']);

    //This make sure the cursor is place at right
    await page.keys(' right'.split(''));

    // should select media inline and override by text
    await page.keys(['ArrowUp']);
    await page.keys('inline card'.split(''));

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
