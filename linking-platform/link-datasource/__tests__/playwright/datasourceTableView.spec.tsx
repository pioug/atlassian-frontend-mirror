import { expect, test } from '@af/integration-testing';
test.describe('DatasourceTableView', () => {
  test('persists column picker when new column added', async ({ page }) => {
    await page.visitExample(
      'linking-platform',
      'link-datasource',
      'jira-issues-table',
    );
    await page.getByTestId('column-picker-trigger-button').click();
    await page.getByText('Due Date0').click();

    expect(await page.isVisible('#react-select-2-option-10')).toEqual(true);
  });

  test('persists column order after loading next page', async ({ page }) => {
    await page.visitExample(
      'linking-platform',
      'link-datasource',
      'issue-like-table',
    );

    const header = await page.getByTestId('link-datasource--head');

    const headerContentBeforeNextPageCall = await header.textContent();

    // confirming first page has loaded
    const totalRowsAfterInitialLoad = await page
      .locator('[data-testid="link-datasource--body"] tr')
      .all();
    expect(totalRowsAfterInitialLoad.length).toEqual(21);

    const lastRow = await page.locator(
      '[data-testid="link-datasource--body"] tr:last-child',
    );
    lastRow.scrollIntoViewIfNeeded();

    // waiting for loading to be complete
    const tableLastRow = await page
      .getByTestId('link-datasource--row-DONUT-11921')
      .elementHandle();
    await tableLastRow?.waitForElementState('stable');

    // confirming second page has loaded
    const totalRowsAfterSecondPageLoad = await page
      .locator('[data-testid="link-datasource--body"] tr')
      .all();
    expect(totalRowsAfterSecondPageLoad.length).toEqual(42);

    const headerContentAfterNextPageCall = await header.textContent();

    expect(headerContentBeforeNextPageCall).toEqual(
      headerContentAfterNextPageCall,
    );
  });
});
