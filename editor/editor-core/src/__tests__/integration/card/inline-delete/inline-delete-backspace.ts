import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import type Page from '@atlaskit/webdriver-runner/wd-wrapper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getDocFromElement,
  editable,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDClipboardExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';

BrowserTestCase(
  `card: pressing backspace with the cursor at the end of Inline link should delete it`,
  {
    skip: ['safari'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    // Copy stuff to clipboard and go to editor
    const page = await goToEditorTestingWDClipboardExample(
      client,
      'https://www.atlassian.com',
    );
    await mountEditor(
      page,
      {
        appearance: fullpage.appearance,
        smartLinks: {
          allowEmbeds: true,
        },
      },
      {
        providers: {
          cards: true,
        },
      },
    );

    // Paste the link
    await page.paste();

    await page.waitForSelector('.inlineCardView-content-wrap');

    // First backspace removes space at the end of Inline link
    await page.keys('Back space');
    // Second backspace removes the Inline link
    await page.keys('Back space');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
