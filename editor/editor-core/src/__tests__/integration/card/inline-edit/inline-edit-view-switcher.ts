import {
  editable,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { waitForInlineCardSelection } from '@atlaskit/media-integration-test-helpers';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import * as inlineCardAdf from '../_fixtures_/inline-card.adf.json';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

BrowserTestCase(
  'card: should be able to switch views with view switcher with icons toolbar',
  {},
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
    await page.click('[data-testid="block-appearance"]');

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
