// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('css-reset', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await page.setViewport({ width: 500, height: 400 });
  });

  it('should match production heading styles', async () => {
    const url = getExampleUrl(
      'css-packs',
      'css-reset',
      'heading',
      global.__BASEURL__,
    );

    await loadPage(page, url);

    expect(
      await takeElementScreenShot(page, '[data-testid="css-reset"]'),
    ).toMatchProdImageSnapshot();
  });

  it('should match production link styles', async () => {
    const url = getExampleUrl(
      'css-packs',
      'css-reset',
      'links',
      global.__BASEURL__,
    );

    await loadPage(page, url);

    expect(
      await takeElementScreenShot(page, '[data-testid="css-reset"]'),
    ).toMatchProdImageSnapshot();
  });

  it('should match production list styles', async () => {
    const url = getExampleUrl(
      'css-packs',
      'css-reset',
      'lists-flat',
      global.__BASEURL__,
    );

    await loadPage(page, url);

    expect(
      await takeElementScreenShot(page, '[data-testid="css-reset"]'),
    ).toMatchProdImageSnapshot();
  });

  it('should match production table styles', async () => {
    const url = getExampleUrl(
      'css-packs',
      'css-reset',
      'tables-simple',
      global.__BASEURL__,
    );

    await loadPage(page, url);

    expect(
      await takeElementScreenShot(page, '[data-testid="css-reset"]'),
    ).toMatchProdImageSnapshot();
  });

  it('should match production misc styles', async () => {
    const url = getExampleUrl(
      'css-packs',
      'css-reset',
      'misc-elements',
      global.__BASEURL__,
    );

    await loadPage(page, url);

    expect(
      await takeElementScreenShot(page, '[data-testid="css-reset"]'),
    ).toMatchProdImageSnapshot();
  });
});
