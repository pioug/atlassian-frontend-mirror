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

// FIXME: This test was automatically skipped due to failure on 15/04/2023: https://product-fabric.atlassian.net/browse/ED-17497
BrowserTestCase(
  'card: should be able to switch views with view switcher with icons toolbar',
  {
    skip: ['*'],
  },
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
