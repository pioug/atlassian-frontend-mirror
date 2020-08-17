import { BetaBrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';

import { gotoCardFilesMockedPage } from '../_pages/card-files-mocked-page';

const cardStandardSelector = '[data-testid="media-card-standard"]';
const cardWithContextIdSelector = '[data-testid="media-card-with-context-id"]';
// const cardStandardSelectorWithMediaViewer = `[data-testid="media-card-standard-with-media-viewer"]`;
const cardStandardLoading = '[data-testid="media-card-loading-card"]';
const cardHiddenWithCacheSelector =
  '[data-testid="media-card-hidden-card-with-cache"]';
const cardHiddenWithoutCacheSelector =
  '[data-testid="media-card-hidden-card-without-cache"]';
// Edge & Safari see https://product-fabric.atlassian.net/browse/BMPT-597
BetaBrowserTestCase(
  'MediaCard - load image',
  { skip: ['edge'] },
  async (client: BrowserObject) => {
    const page = await gotoCardFilesMockedPage(client);

    expect(await page.isCardLoadedSuccessful(cardStandardSelector)).toBe(true);
  },
);

BetaBrowserTestCase(
  'MediaCard - load image with contextId',
  { skip: ['edge'] },
  async (client: BrowserObject) => {
    const page = await gotoCardFilesMockedPage(client);

    expect(await page.isCardLoadedSuccessful(cardWithContextIdSelector)).toBe(
      true,
    );
  },
);

// BetaBrowserTestCase(
//   'MediaCard - load image and launch media viewer',
//   { skip: ['edge'] },
//   async (client: BrowserObject) => {
//     const page = await gotoCardFilesMockedPage(client);

//     expect(
//       await page.isCardLoadedSuccessful(cardStandardSelectorWithMediaViewer),
//     ).toBe(true);
//     await page.launchMediaViewer(cardStandardSelectorWithMediaViewer);
//     expect(await page.isMediaViewerLaunched()).toBe(true);
//   },
// );

BetaBrowserTestCase(
  'MediaCard - renders loading card',
  { skip: ['edge'] },
  async (client: BrowserObject) => {
    const page = await gotoCardFilesMockedPage(client);

    expect(await page.isCardVisible(cardStandardLoading)).toBe(true);
  },
);

BetaBrowserTestCase(
  'MediaCard - cards that is not in the viewport but is available in local cache',
  { skip: ['edge', 'safari'] },
  async (client: BrowserObject) => {
    const page = await gotoCardFilesMockedPage(client);

    expect(await page.isCardLoadedSuccessful(cardHiddenWithCacheSelector)).toBe(
      true,
    );
  },
);

BetaBrowserTestCase(
  'MediaCard - cards that is not in the viewport and no local cache available',
  { skip: ['edge', 'safari'] },
  async (client: BrowserObject) => {
    const page = await gotoCardFilesMockedPage(client);

    expect(
      await page.isShowingLoadingIcon(cardHiddenWithoutCacheSelector),
    ).toBe(true);
  },
);
