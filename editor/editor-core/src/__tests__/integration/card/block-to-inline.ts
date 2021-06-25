import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import * as blockCardAdf from './_fixtures_/block-card-with-empty-p-at-bottom.adf.json';
import { waitForBlockCardSelection } from '@atlaskit/media-integration-test-helpers';
import { getDocFromElement, editable, getProseMirrorPos } from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

BrowserTestCase(
  `card: should switch to inline mode with proper cursor position`,
  { skip: [] },
  async (client: any, testName: string) => {
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
    await page.click('div[aria-label="Floating Toolbar"] button');
    // Click the "Display inline" to switch to inline card
    await page.click('[data-testid="inline-appearance"]');

    expect(await getProseMirrorPos(page)).toEqual(4);
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
