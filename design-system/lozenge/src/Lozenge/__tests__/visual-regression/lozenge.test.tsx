import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Lozenge basic example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'lozenge',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector('span[data-testid="lozenge-subtle"]');
    await page.waitForSelector('span[data-testid="lozenge-bold"]');
    await page.waitForSelector('span[data-testid="lozenge-truncated"]');
    await page.waitForSelector(
      'span[data-testid="lozenge-truncated-custom-width"]',
    );
    await page.waitForSelector('span[data-testid="lozenge-defaults"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Lozenge inside overflow container example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'lozenge',
      'inside-overflow-container',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(
      'span[data-testid="lozenge-truncated-by-maxWidth"]',
    );
    await page.waitForSelector(
      'span[data-testid="lozenge-truncated-by-container-size"]',
    );
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
