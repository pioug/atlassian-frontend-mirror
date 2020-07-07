import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

const toggleButtonSelector = 'button[aria-label="Toggle navigation"]';

describe('Snapshot Test', () => {
  it('Basic global navigation should match prod', async () => {
    const url = getExampleUrl(
      'design-system',
      'global-navigation',
      'basic-global-navigation',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(toggleButtonSelector);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('with-notification-integration should match prod', async () => {
    const url = getExampleUrl(
      'design-system',
      'global-navigation',
      'with-notification-integration',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(toggleButtonSelector);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('dropdown example should match prod', async () => {
    const url = getExampleUrl(
      'design-system',
      'global-navigation',
      'with-dropdowns',
      global.__BASEURL__,
    );
    const { page } = global;
    const button = '#profileGlobalItem';
    await loadPage(page, url);
    await page.waitForSelector(toggleButtonSelector);
    await page.waitForSelector(button);

    await page.click(button);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('drawer example should match prod', async () => {
    const url = getExampleUrl(
      'design-system',
      'global-navigation',
      'with-drawers-and-modal',
      global.__BASEURL__,
    );
    const { page } = global;
    const button = '#starDrawerGlobalItem';
    await loadPage(page, url);
    await page.waitForSelector(button);

    await page.click(button);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
  // TODO: https://ecosystem.atlassian.net/browse/AK-6093
  it.skip('changeboarding example should match prod', async () => {
    const url = getExampleUrl(
      'design-system',
      'global-navigation',
      'with-changeboarding',
      global.__BASEURL__,
    );
    const { page } = global;
    const button = '[data-testid="Navigation"] + div button';
    await loadPage(page, url);
    await page.waitForSelector(button);

    await page.click(button);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
