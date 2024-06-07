import { expect, test } from '@af/integration-testing';
test.describe('DatasourceTableView', () => {
	test('persists column picker when new column added', async ({ page }) => {
		await page.visitExample('linking-platform', 'link-datasource', 'basic-jira-issues-table');
		await page.getByTestId('column-picker-trigger-button').click();
		await page.getByText('Due Date0').click();

		await expect(page.locator('#react-select-2-option-10')).toBeVisible();
	});

	test('can search in column picker', async ({ page }) => {
		await page.visitExample('linking-platform', 'link-datasource', 'basic-jira-issues-table');
		await page.getByTestId('column-picker-trigger-button').click();
		page.keyboard.type('Due');

		await expect(page.locator('#react-select-2-option-10')).toContainText('Due');
		await expect(page.locator('#react-select-2-option-11')).toContainText('Due');
		await expect(page.locator('#react-select-2-option-12')).toContainText('Due');
	});

	test('persists column order after loading next page', async ({ page }) => {
		await page.visitExample('linking-platform', 'link-datasource', 'issue-like-table');

		const header = page.getByTestId('link-datasource--head');

		const headerContentBeforeNextPageCall = await header.textContent();

		// confirming first page has loaded
		const totalRowsAfterInitialLoad = await page
			.locator('[data-testid="link-datasource--body"] tr')
			.all();
		expect(totalRowsAfterInitialLoad.length).toEqual(21);

		const lastRow = page.locator('[data-testid="link-datasource--body"] tr:last-child');
		lastRow.scrollIntoViewIfNeeded();

		// waiting for loading to be complete
		const tableLastRow = await page.getByTestId('link-datasource--row-DONUT-11921').elementHandle();
		await tableLastRow?.waitForElementState('stable');

		// confirming second page has loaded
		const totalRowsAfterSecondPageLoad = await page
			.locator('[data-testid="link-datasource--body"] tr')
			.all();
		expect(totalRowsAfterSecondPageLoad.length).toEqual(42);

		const headerContentAfterNextPageCall = await header.textContent();

		expect(headerContentBeforeNextPageCall).toEqual(headerContentAfterNextPageCall);
	});

	test('datasource table reload after auth connection action', async ({ page }) => {
		await page.visitExample('linking-platform', 'link-datasource', 'issue-like-table-3p-unauth');

		await expect(page.getByTestId('datasource--access-required-with-auth')).toBeVisible();

		// Start waiting for new page before clicking.
		const pageContext = page.context();
		const authPagePromise = pageContext.waitForEvent('page');

		await page.getByRole('button').click();

		const authPage = await authPagePromise;
		await authPage.close();

		await expect(page.getByRole('table')).toBeVisible();
		await expect(page.getByTestId('datasource--access-required-with-auth')).toBeHidden();
	});
});
