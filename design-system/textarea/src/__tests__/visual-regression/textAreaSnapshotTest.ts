import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('TextArea', () => {
  let page: any;
  let url: string;

  beforeAll(async () => {
    page = global.page;
    url = getExampleUrl(
      'design-system',
      'textarea',
      'basic',
      global.__BASEURL__,
    );
    await loadPage(page, url);
    await page.waitForSelector('#smart textarea');
  });

  it('basic example should match production', async () => {
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should become blue and white onFocus', async () => {
    await page.waitForSelector('button');
    await page.click('button');

    const image = await takeElementScreenShot(page, 'div#smart');
    expect(image).toMatchProdImageSnapshot();
  });
});
