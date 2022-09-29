import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import * as inlineCardAdf from '../_fixtures_/inline-card.adf.json';
import { waitForInlineCardSelection } from '@atlaskit/media-integration-test-helpers';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

BrowserTestCase(
  'card: should be able to switch views with view switcher',
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
    await page.click('span[aria-label="Expand dropdown menu"]');

    await page.waitForSelector('[data-testid="block-appearance"]');
    await page.click('[data-testid="block-appearance"]');

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'card: should be able to switch views with view switcher with viewChangingExperimentToolbarStyle set to `newDropdown`',
  {},
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      featureFlags: {
        'view-changing-experiment-toolbar-style': 'newDropdown',
      },
      allowTextAlignment: true,
      defaultValue: JSON.stringify(inlineCardAdf),
      smartLinks: {
        allowBlockCards: true,
      },
    });

    await waitForInlineCardSelection(page);
    await page.click('[data-testid="link-toolbar-appearance-button"]');

    await page.waitForSelector('[data-testid="block-appearance"]');
    await page.click('[data-testid="block-appearance"]');

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'card: should be able to switch views with view switcher with viewChangingExperimentToolbarStyle set to `toolbarIcons`',
  {},
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      featureFlags: {
        'view-changing-experiment-toolbar-style': 'toolbarIcons',
      },
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
