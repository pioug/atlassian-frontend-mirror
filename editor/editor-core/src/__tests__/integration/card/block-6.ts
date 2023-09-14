import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getDocFromElement,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { waitForBlockCardSelection } from '@atlaskit/media-integration-test-helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import * as blockCardCopyAdf from './_fixtures_/block-card-copy.adf.json';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

// FIXME: This test was automatically skipped due to failure on 28/07/2023: https://product-fabric.atlassian.net/browse/ED-19290
BrowserTestCase(
  'card: copy paste multiple block card should work as expected in editor',
  {
    skip: ['*'],
  },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const cardProviderPromise = Promise.resolve(
      new ConfluenceCardProvider('prod'),
    );

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(blockCardCopyAdf),
      smartLinks: {
        provider: cardProviderPromise,
        allowBlockCards: true,
      },
    });

    await waitForBlockCardSelection(page);

    // Select all
    await page.selectAll();

    // Copy and move cursor to start of doc
    await page.copy();

    await page.keys(['ArrowLeft']);

    // Paste
    await page.paste();

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
