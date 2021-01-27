import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

export type Event = {
  readonly name: string;
  readonly payload: any;
};

export type RecentUploadCard = {
  readonly filename: string;
};

/**
 * Popup Simple Example Page Object
 * @see https://www.seleniumhq.org/docs/06_test_design_considerations.jsp#page-object-design-pattern
 */
export class CardFilesMockedPage {
  constructor(private readonly page: Page) {}

  async isCardLoadedSuccessful(selector: string): Promise<boolean> {
    const imgSelector = `${selector} .img-wrapper img`;
    await this.page.waitForSelector(imgSelector);
    const innerImg = await this.page.$(imgSelector);

    return this.canImageBeLoaded(await innerImg.getAttribute('src'));
  }

  private canImageBeLoaded(source: string): Promise<boolean> {
    /**
     * This is going to load the source into another <img> and
     * see if it can be loaded successfully
     */
    return this.page.executeAsync(
      (src: string, done: (result: boolean) => void) => {
        const img = new Image();
        img.onload = function () {
          done(true);
        };
        img.onerror = function () {
          done(false);
        };
        img.setAttribute('src', src);
      },
      source,
    );
  }

  async isShowingLoadingIcon(selector: string): Promise<boolean> {
    const iconSelector = `${selector} .img-wrapper [data-testid="media-card-loading"]`;
    return this.page.isExisting(iconSelector);
  }

  async launchMediaViewer(selector: string) {
    return this.page.click(selector);
  }

  async isMediaViewerLaunched() {
    return this.page.waitForVisible('[data-testid="media-viewer-image"]');
  }

  async isCardVisible(selector: string) {
    return this.page.waitForVisible(selector);
  }

  async isPlayPauseBlanket() {
    return this.page.waitForVisible('[data-testid="play-pause-blanket"]');
  }
}

export async function gotoCardFilesMockedPage(
  client: any,
): Promise<CardFilesMockedPage> {
  const page = new Page(client);
  const url = getExampleUrl('media', 'media-card', 'test-card-files-mocked');
  await page.goto(url);
  return new CardFilesMockedPage(page);
}
