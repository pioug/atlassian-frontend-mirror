import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, editable } from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import * as mediaCardLazyAdf from './_fixtures_/media-card-lazy.adf.json';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

BrowserTestCase(
  'media-card: should lazy render media cards after scrolling down',
  { skip: ['safari', 'edge'] },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    const lazySelector = '[data-testid="media-card-loading"]';
    const cardSelector =
      '[data-testid="media-file-card-view"][data-test-status="complete"]';
    const editorScrollParentSelector = '.fabric-editor-popup-scroll-parent';

    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowTextAlignment: true,
        defaultValue: JSON.stringify(mediaCardLazyAdf),
        media: {
          allowMediaSingle: true,
        },
        allowTables: {
          advanced: true,
        },
      },
      undefined,
      { clickInEditor: false },
    );

    // First, we expect cards to be in loading state
    await page.waitForSelector(lazySelector);
    // All of them should be off the viewport.
    await page.waitForElementCount(lazySelector, 6);

    // Now, scroll to the bottom.
    await page.execute((editorScrollParentSelector: any) => {
      const editor = document.querySelector(editorScrollParentSelector);
      editor && editor.scrollBy(0, window.innerHeight * 100);
    }, editorScrollParentSelector);

    // Wait for card to finish resolving.
    await page.waitForSelector(cardSelector, { timeout: 4000000 });
    // All of them should in the viewport now.
    await page.waitForElementCount(cardSelector, 7);
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
