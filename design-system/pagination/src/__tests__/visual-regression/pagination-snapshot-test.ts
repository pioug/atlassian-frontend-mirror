import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const getPageSelectorForPage = (pageNo: number) => `button[page="${pageNo}"]`;

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

    const paginationSelector = '[data-testid="pagination"]';
    const prevPageBtnSelector = 'button[aria-label="previous"]';
    const nextPageBtnSelector = 'button[aria-label="next"]';
    // Wait for next & prev buttons (and their inner icons)
    await page.waitForSelector(prevPageBtnSelector + '[disabled]');
    await page.waitForSelector(nextPageBtnSelector + ':not([disabled])');
    await page.waitForSelector('span[role="presentation"] > svg');

    // Wait for page 5
    await page.waitForSelector(getPageSelectorForPage(5));
    const image = await takeElementScreenShot(page, paginationSelector);
    expect(image).toMatchProdImageSnapshot();

    await page.click(getPageSelectorForPage(5));
    const imageAfterClickingFivePage = await takeElementScreenShot(
      page,
      paginationSelector,
    );
    expect(imageAfterClickingFivePage).toMatchProdImageSnapshot();

    await page.click(nextPageBtnSelector);
    const imageAfterClickingNextButton = await takeElementScreenShot(
      page,
      paginationSelector,
    );
    expect(imageAfterClickingNextButton).toMatchProdImageSnapshot();

    await page.click(getPageSelectorForPage(7));
    const imageAfterClickingPageSeven = await takeElementScreenShot(
      page,
      paginationSelector,
    );
    expect(imageAfterClickingPageSeven).toMatchProdImageSnapshot();

    await page.click(prevPageBtnSelector);
    const imageAfterClickingPrevButton = await takeElementScreenShot(
      page,
      paginationSelector,
    );
    expect(imageAfterClickingPrevButton).toMatchProdImageSnapshot();

    await page.click(prevPageBtnSelector);
    await page.click(getPageSelectorForPage(4));
    const imageAfterHoverPageFourButton = await takeElementScreenShot(
      page,
      paginationSelector,
    );
    expect(imageAfterHoverPageFourButton).toMatchProdImageSnapshot();

    await page.click(getPageSelectorForPage(4));
    const imageAfterClickPageFourButton = await takeElementScreenShot(
      page,
      paginationSelector,
    );
    expect(imageAfterClickPageFourButton).toMatchProdImageSnapshot();
  });

  it('Render custom ellipsis should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'pagination',
      'with-custom-ellipsis#',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    const paginationSelector = '[data-testid="pagination"]';

    const initialImage = await takeElementScreenShot(page, paginationSelector);
    expect(initialImage).toMatchProdImageSnapshot();

    const aboutPageSelector = 'button[aria-label="expand"]';
    await page.click(aboutPageSelector);
    await page.click(paginationSelector);
    const imageAfterClickingCustomExpandEllipsis = await takeElementScreenShot(
      page,
      paginationSelector,
    );
    expect(imageAfterClickingCustomExpandEllipsis).toMatchProdImageSnapshot();
  });
});
