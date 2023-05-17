import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const modeSwitcherSelector = '[data-testid="mode-toggle-container"]';
const containerSelector = '[data-testid="mode-switcher-example-container"]';
const jqlOptionSelector = '[data-testid="mode-toggle-jql"]';

describe('Mode Switcher', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    const url = getExampleUrl(
      'linking-platform',
      'link-datasource',
      'mode-switcher',
      __BASEURL__,
    );

    await page.setViewport({
      width: 1100,
      height: 1000,
    });

    await loadPage(page, url);
    await page.waitForSelector(modeSwitcherSelector);
  });

  it('should match snapshot', async () => {
    const image = await takeElementScreenShot(page, containerSelector);

    expect(image).toMatchProdImageSnapshot();
  });

  it('should change the selected option on click', async () => {
    await page.evaluate(selector => {
      document.querySelector(selector).click();
    }, jqlOptionSelector);

    const image = await takeElementScreenShot(page, containerSelector);
    expect(image).toMatchProdImageSnapshot();
  });
});
