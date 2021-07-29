import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Spinner snapshot test', () => {
  it('Default Spinner should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'spinner',
      'vr-basic',
      global.__BASEURL__,
    );
    const { page } = global;
    // We need animation set to true or the Spinner isn't visible, but we're
    // using `animation-timing-function: step-end` to skip to the end of the animation.
    await loadPage(page, url, { disabledSideEffects: { animation: true } });
    const element = await page.waitForSelector(
      '[data-testid="spinner-wrapper"]',
    );
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Each spinner size should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'spinner',
      'vr-sizes',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url, { disabledSideEffects: { animation: true } });
    const element = await page.waitForSelector(
      '[data-testid="spinner-sizes-container"]',
    );
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Spinner text alignment should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'spinner',
      'vr-text-alignment',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url, { disabledSideEffects: { animation: true } });
    const element = await page.waitForSelector(
      '[data-testid="spinner-text-container"]',
    );
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Spinner table cell alignment should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'spinner',
      'vr-table-cell-alignment',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url, { disabledSideEffects: { animation: true } });
    const element = await page.waitForSelector('[data-testid="spinner-table"]');
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Spinner in loading button usages should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'spinner',
      'vr-loading-buttons',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url, { disabledSideEffects: { animation: true } });
    const element = await page.waitForSelector(
      '[data-testid="spinner-buttons-container"]',
    );
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
