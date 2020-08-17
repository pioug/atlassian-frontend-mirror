import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'pagination',
      'basic#',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    // Wait for next & prev buttons (and their inner icons)
    await page.waitForSelector('button[aria-label="previous"][disabled]');
    await page.waitForSelector('button[aria-label="next"]:not([disabled])');
    await page.waitForSelector('span[role="presentation"] > svg');

    const pageFive = 'button[page="5"]';
    // Wait for page 5
    await page.waitForSelector(pageFive);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();

    await page.click(pageFive);
    const pageFiveImage = await page.screenshot();
    expect(pageFiveImage).toMatchProdImageSnapshot();
  });
});
