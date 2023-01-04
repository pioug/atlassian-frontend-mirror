import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlPagination = getExampleUrl('design-system', 'pagination', 'basic');

const pageBtnSelector = 'button[page]';
const pageTextSelector = '[data-testid=description]';
const nextPageBtnSelector = 'button[aria-label="next"]';
const previousPageBtnSelector = 'button[aria-label="previous"]';
const ellipsisSelector = '[data-testid=pagination-ellipsis-text]';

BrowserTestCase(
  'A user will be able to change page by clicking page number button',
  {},
  async (client: any) => {
    const paginationPage = new Page(client);
    await paginationPage.goto(urlPagination);

    for (let index = 1; index < 10; index++) {
      const pageSelector = `button[data-testid=pagination--page-${index}]`;
      const button = await paginationPage.$(pageSelector);
      await button.click();

      const elm = await paginationPage.$(pageTextSelector);
      const pageText = await elm.getText();
      const pageNo = await button.getAttribute('page');

      expect(pageText).toBe(`selected page from onChange hook: ${pageNo}`);
    }
  },
);

BrowserTestCase(
  'A user will be able to navigate to next page by clicking Next button',
  {},
  async (client: any) => {
    const paginationPage = new Page(client);
    await paginationPage.goto(urlPagination);
    const nextButton = await paginationPage.$(nextPageBtnSelector);
    await nextButton.click();
    const elm = await paginationPage.$(pageTextSelector);
    const pageText = await elm.getText();

    expect(pageText).toBe('selected page from onChange hook: 2');
  },
);

BrowserTestCase(
  'A user will be able to navigate to previous page by clicking Previous button',
  {},
  async (client: any) => {
    const paginationPage = new Page(client);
    await paginationPage.goto(urlPagination);
    const page3 = await paginationPage.$('button[page="3"]');
    await page3.click();
    const prevButton = await paginationPage.$(previousPageBtnSelector);
    await prevButton.click();
    const elm = await paginationPage.$(pageTextSelector);
    const pageText = await elm.getText();

    expect(pageText).toBe('selected page from onChange hook: 2');
  },
);

BrowserTestCase(
  'A user will be able to see page buttons along with both ellipsis',
  {},
  async (client: any) => {
    const paginationPage = new Page(client);
    await paginationPage.goto(urlPagination);
    const page5 = await paginationPage.$('button[page="5"]');
    await page5.click();
    const pageButtons = await paginationPage.$$(pageBtnSelector);

    expect(pageButtons.length).toBe(5);

    const ellipsis = await paginationPage.$$(ellipsisSelector);

    expect(ellipsis.length).toBe(2);

    const startingEllipsisText = await ellipsis[0].getText();

    expect(startingEllipsisText).toEqual('\u2026');

    const endingEllipsisText = await ellipsis[1].getText();

    expect(endingEllipsisText).toEqual('\u2026');
  },
);
