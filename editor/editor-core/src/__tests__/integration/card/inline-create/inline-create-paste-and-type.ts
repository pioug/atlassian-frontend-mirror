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
  `card: pasting an link then typing still converts to inline card`,
  { skip: ['safari'] },
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

    // Type some text into the paragraph first
    await page.type(editable, 'hello have a link ');

    // Paste the link
    await page.paste();

    // Type some text after it
    await page.type(editable, 'more typing');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
