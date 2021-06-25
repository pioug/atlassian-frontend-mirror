import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

async function waitForBannerVisible(page: PuppeteerPage) {
  await page.waitForSelector('div[aria-hidden="false"][role="alert"]', {
    visible: true,
  });
}

async function waitForAnnouncementBannerVisible(page: PuppeteerPage) {
  await page.waitForSelector('div[aria-hidden="false"][role="region"]', {
    visible: true,
  });
}

describe('Snapshot Test', () => {
  it('Announcement banner example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'banner',
      'announcement-banner',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForAnnouncementBannerVisible(page);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
  it('basic-usage example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'banner',
      'basic-usage',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForBannerVisible(page);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
