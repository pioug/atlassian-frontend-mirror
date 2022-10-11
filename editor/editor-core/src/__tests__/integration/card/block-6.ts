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
import * as blockCardCopyAdf from './_fixtures_/block-card-copy.adf.json';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

BrowserTestCase(
  'card: copy paste multiple block card should work as expected in editor',
  { skip: [] },
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

    const selector = '.ProseMirror';

    // get code block position
    let { left, top } = JSON.parse(
      await page.executeAsync((selector, done) => {
        const { left, top } = (document as any)
          .querySelector(selector)
          .getBoundingClientRect();

        done(
          JSON.stringify({
            left: left + 2,
            top: top + 2,
          }),
        );
      }, selector),
    );

    // simulate click at start of document
    await page.simulateUserDragAndDrop(left, top, left, top, 100);

    // Paste
    // macos chrome needs a workaround for pasting rich text.
    if (page.isBrowser('chrome') && page.isMacOSPlatform()) {
      await page.keys(['Mod', 'v']);
    } else {
      await page.paste();
    }

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
