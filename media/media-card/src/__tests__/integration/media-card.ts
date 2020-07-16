import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';

import { gotoCardFilesMockedPage } from '../_pages/card-files-mocked-page';

const cardStandardSelector = '[data-testid="media-card-standard"]';
const cardWithContextIdSelector = '[data-testid="media-card-with-context-id"]';
const cardStandardSelectorWithMediaViewer = `[data-testid="media-card-standard-with-media-viewer"]`;
const cardStandardLoading = '[data-testid="media-card-loading-card"]';

BrowserTestCase('MediaCard - load image', {}, async (client: BrowserObject) => {
  const page = await gotoCardFilesMockedPage(client);

  expect(await page.isCardLoadedSuccessful(cardStandardSelector)).toBe(true);
});

BrowserTestCase(
  'MediaCard - load image with contextId',
  {},
  async (client: BrowserObject) => {
    const page = await gotoCardFilesMockedPage(client);

    expect(await page.isCardLoadedSuccessful(cardWithContextIdSelector)).toBe(
      true,
    );
  },
);

BrowserTestCase(
  'MediaCard - load image and launch media viewer',
  {},
  async (client: BrowserObject) => {
    const page = await gotoCardFilesMockedPage(client);

    expect(
      await page.isCardLoadedSuccessful(cardStandardSelectorWithMediaViewer),
    ).toBe(true);
    await page.launchMediaViewer(cardStandardSelectorWithMediaViewer);
    expect(await page.isMediaViewerLaunched()).toBe(true);
  },
);

BrowserTestCase(
  'MediaCard - renders loading card',
  {},
  async (client: BrowserObject) => {
    const page = await gotoCardFilesMockedPage(client);

    expect(await page.isCardVisible(cardStandardLoading)).toBe(true);
  },
);
