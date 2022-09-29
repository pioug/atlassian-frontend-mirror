import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import * as mediaCardLazyAdf from './_fixtures_/media-card-lazy.adf.json';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

// Tests is timing out and skipped for now: https://product-fabric.atlassian.net/browse/MEX-1287
BrowserTestCase(
  'media-card: should lazy render media cards after scrolling down',
  { skip: ['*'] },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    const lazySelector = '[data-testid="media-card-loading"]';
    const cardSelector =
      '[data-testid="media-file-card-view"][data-test-status="complete"]';
    const cardViewportAnchor = '.media-card-viewport-anchor';

    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowTextAlignment: true,
        defaultValue: JSON.stringify(mediaCardLazyAdf),
        media: {
          allowMediaSingle: true,
        },
      },
      undefined,
      { clickInEditor: false },
    );

    // First, we expect media card to be in loading state
    await page.waitForSelector(lazySelector);

    // Card should be off the viewport
    await page.waitForElementCount(lazySelector, 1);

    // Now, scroll to viewport anchor
    await page.execute((mediaCardViewportAnchor: any) => {
      const anchor = document.querySelector(mediaCardViewportAnchor);
      anchor && anchor.scrollIntoView();
    }, cardViewportAnchor);

    // Wait for card to finish resolving
    await page.waitForSelector(cardSelector, { timeout: 4000000 });

    // Card should be loaded by now
    await page.waitForElementCount(cardSelector, 1);

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
