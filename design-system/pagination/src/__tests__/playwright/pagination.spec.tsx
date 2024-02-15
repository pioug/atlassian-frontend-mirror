import { expect, test } from '@af/integration-testing';

const pageBtnSelector = 'button[page]';

const pageTextSelector = '[data-testid=description]';

const previousPageBtnSelector = '[data-testid="pagination--left-navigator"]';

const nextPageBtnSelector = '[data-testid="pagination--right-navigator"]';

const ellipsisSelector = '[data-testid=pagination-ellipsis-text]';

test('A user will be able to change page by clicking page number button', async ({
  page,
}) => {
  await page.visitExample('design-system', 'pagination', 'basic');
  for (let index = 1; index < 10; index++) {
    const pageSelector = `button[data-testid=pagination--page-${index}]`;
    const button = page.locator(pageSelector).first();
    await button.click();
    const elm = page.locator(pageTextSelector).first();
    const pageNo = String(index + 1);
    // await expect(button).toHaveAttribute('page', pageNo); // TODO: fix attribute assertion
    await expect(elm).toHaveText(`selected page from onChange hook: ${pageNo}`);
  }
});

test('A user will be able to navigate to next page by clicking Next button', async ({
  page,
}) => {
  await page.visitExample('design-system', 'pagination', 'basic');
  const nextButton = page.locator(nextPageBtnSelector).first();
  await nextButton.click();
  const elm = page.locator(pageTextSelector).first();
  const pageText = await elm.textContent();
  expect(pageText).toBe('selected page from onChange hook: 2');
});

test('A user will be able to navigate to previous page by clicking Previous button', async ({
  page,
}) => {
  await page.visitExample('design-system', 'pagination', 'basic');
  const page3 = page.locator('button[page="3"]').first();
  await page3.click();
  const prevButton = page.locator(previousPageBtnSelector).first();
  await prevButton.click();
  const elm = page.locator(pageTextSelector).first();
  const pageText = await elm.textContent();
  expect(pageText).toBe('selected page from onChange hook: 2');
});

test('A user will be able to see page buttons along with both ellipsis', async ({
  page,
}) => {
  await page.visitExample('design-system', 'pagination', 'basic');
  const page5 = page.locator('button[page="5"]').first();
  await page5.click();

  const pageButtons = await page.locator(pageBtnSelector).all();
  expect(pageButtons.length).toBe(5);

  const ellipsis = await page.locator(ellipsisSelector).all();
  expect(ellipsis.length).toBe(2);
  await expect(ellipsis[0]).toHaveText('\u2026');
  await expect(ellipsis[1]).toHaveText('\u2026');
});
