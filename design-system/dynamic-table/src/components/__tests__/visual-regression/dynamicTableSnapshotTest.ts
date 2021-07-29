import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const table = "[data-testid='the-table--table']";
const tableHeadCell = "[data-testid='the-table--head--cell']";
const tableHeadParty = `${tableHeadCell}:nth-child(2)`;
const pagination = "[page='3']";
const selectRowsButtonSelector = "[data-testid='button-toggle-selected-rows']";

describe('Snapshot Test', () => {
  // You can't use other example as they create dynamic content and will fail the test
  it('Empty view example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'dynamic-table',
      'empty-view-with-body',
      global.__BASEURL__,
    );
    const { page } = global;
    // Move the mouse away from the top left corner to prevent the selected state
    // of the first heading cell from triggering.
    await page.mouse.move(0, 100);
    await loadPage(page, url);
    await page.waitForSelector('table');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Testing example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'dynamic-table',
      'testing',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(table);
    await page.waitForSelector(selectRowsButtonSelector);
    await page.click(selectRowsButtonSelector);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Testing example should match production example before and after sorting', async () => {
    const url = getExampleUrl(
      'design-system',
      'dynamic-table',
      'testing',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(table);
    // Take screenshot before sorting
    const tableBefore = await takeElementScreenShot(page, table);
    expect(tableBefore).toMatchProdImageSnapshot();
    // Take screenshot after going to page 3 and sorting
    await page.waitForSelector(pagination);
    await page.click(pagination);
    // We need to wait for the animation to finish.
    await page.waitForTimeout(1000);
    await page.waitForSelector(tableHeadCell);
    await page.click(tableHeadParty);
    const tableAfter = await takeElementScreenShot(page, table);
    expect(tableAfter).toMatchProdImageSnapshot();
  });
});
