import {
  getExampleUrl,
  loadPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Breadcrumbs-basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'breadcrumbs',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector('[data-testid="MyBreadcrumbsTestId"]');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Breadcrumbs dark mode should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'breadcrumbs',
      'themed',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector('[data-testid="MyBreadcrumbsTestId"]');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Breadcrumbs number of items exceed maxItems', async () => {
    const url = getExampleUrl(
      'design-system',
      'breadcrumbs',
      'long',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector('[data-testid="MyBreadcrumbsTestId"]');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Breadcrumbs number of items exceed maxItems - expanded', async () => {
    const url = getExampleUrl(
      'design-system',
      'breadcrumbs',
      'long',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    const selector = '[data-testid="MyBreadcrumbsTestId--breadcrumb-ellipsis"]';

    await page.waitForSelector(selector);
    await page.click(selector);

    // Move the mouse away from the hidden button to avoid the hover effect
    await page.mouse.move(400, 0);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Breadcrumbs truncation', async () => {
    const url = getExampleUrl(
      'design-system',
      'breadcrumbs',
      'truncation',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector('[data-testid="MyBreadcrumbsTestId"]');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Breadcrumbs truncation - tooltip', async () => {
    const url = getExampleUrl(
      'design-system',
      'breadcrumbs',
      'truncation',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector('a[href="/long"]');

    await page.hover('a[href="/long"]');
    await waitForTooltip(page);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Breadcrumbs  - with icons', async () => {
    const url = getExampleUrl(
      'design-system',
      'breadcrumbs',
      'icons',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector('[data-testid="BreadcrumbsTestId"]');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Breadcrumbs  - with markup', async () => {
    const url = getExampleUrl(
      'design-system',
      'breadcrumbs',
      'with-markup',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector('[data-testid="BreadcrumbsTestId"]');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Breadcrumbs with many items, inside a container', async () => {
    const url = getExampleUrl(
      'design-system',
      'breadcrumbs',
      'many-in-container',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector('[data-testid="BreadcrumbsTestId"]');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
