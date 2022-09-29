import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
  copyToClipboard,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';

import Page from '@atlaskit/webdriver-runner/wd-wrapper';

// See also:
// packages/editor/editor-core/src/__tests__/integration/card/inline-create/inline-insert-paste.ts
// for tests around pasting inline cards, and
// packages/editor/editor-core/src/plugins/paste/__tests__/unit/clipboard-text-serializer.ts for
// serialising nodes into plain text.

BrowserTestCase(
  `links.ts: pasting a link while holding shift creates plain (non-inline card) link when plainTextPasteLinkification FF enabled`,
  {
    // browser.performActions() (used for "chording" Ctrl & Shift) doesn't exist in chrome. See
    // .plainTextPaste().
    skip: ['safari', 'chrome'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    let page = new Page(client);

    // Copy stuff to clipboard
    await copyToClipboard(page, 'https://www.atlassian.com');

    page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
      featureFlags: {
        plainTextPasteLinkification: true,
      },
    });

    // Type some text into the paragraph first
    await page.type(editable, 'hello have a link ');

    // Paste the link
    await page.paste('plain');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `links.ts: pasting a link while holding shift doesn't create a link when plainTextPasteLinkification FF disabled`,
  {
    // browser.performActions() (used for "chording" Ctrl & Shift) doesn't exist in chrome.
    skip: ['safari', 'chrome'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    let page = new Page(client);

    // Copy stuff to clipboard
    await copyToClipboard(page, 'https://www.atlassian.com');

    page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
      featureFlags: {
        plainTextPasteLinkification: false,
      },
    });

    // Type some text into the paragraph first
    await page.type(editable, 'hello have a link ');

    // Paste the link
    await page.paste('plain');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `links.ts: pasting multiple links while holding shift creates non inline-card links when plainTextPasteLinkification FF enabled`,
  {
    // browser.performActions() (used for "chording" Ctrl & Shift) doesn't exist in chrome.
    skip: ['safari', 'chrome'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    let page = new Page(client);

    // Copy stuff to clipboard
    await copyToClipboard(
      page,
      'https://www.atlassian.com www.google.com abc.net.au/news/',
    );

    page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
      featureFlags: {
        plainTextPasteLinkification: true,
      },
    });

    // Type some text into the paragraph first
    await page.type(editable, 'hello have a link ');

    // Paste the link
    await page.paste('plain');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
