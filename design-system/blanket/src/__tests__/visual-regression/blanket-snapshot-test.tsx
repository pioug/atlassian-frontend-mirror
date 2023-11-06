import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

const showButtonSelector = "[data-testid='show-button']";
const blanketSelector = "[data-testid='basic-blanket']";
const blanketWithChildrenSelector = "[data-testid='blanket-with-children']";

describe('Snapshot Test', () => {
  it(`should match tinted blanket example with production`, async () => {
    const url = getExampleUrl(
      'design-system',
      'blanket',
      'basic-usage',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector(showButtonSelector);
    const showBlanketButton = await page.$(showButtonSelector);
    await showBlanketButton?.click();

    await page.waitForSelector(blanketSelector);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should match tinted blanket example with production for blanket with children', async () => {
    const url = getExampleUrl(
      'design-system',
      'blanket',
      'blanket-with-children',

      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector(showButtonSelector);
    const showBlanketButton = await page.$(showButtonSelector);
    await showBlanketButton?.click();

    await page.waitForSelector(blanketWithChildrenSelector);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should show children even when not tinted', async () => {
    const url = getExampleUrl(
      'design-system',
      'blanket',
      'blanket-with-children',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector(blanketWithChildrenSelector);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
