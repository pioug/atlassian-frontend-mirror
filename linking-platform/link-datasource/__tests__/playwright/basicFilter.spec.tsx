import { expect, type Page, test } from '@af/integration-testing';

const basicFilterContainerTestId = 'jlol-basic-filter-container';

const loadExample = (page: Page) =>
	page.visitExample('linking-platform', 'link-datasource', 'with-issues-modal', {
		'react-18-mode': 'legacy',
	});

test.describe('JiraIssuesModal: Basic Filters', () => {
	test('should not be visible when in JQL search mode', async ({ page }) => {
		await loadExample(page);

		await page.getByTestId('mode-toggle-jql').click();

		const basicFilterContainer = page.getByTestId(basicFilterContainerTestId);

		await expect(basicFilterContainer).toBeHidden();
	});

	test('should be visible when switching to basic search mode', async ({ page }) => {
		await loadExample(page);

		const basicFilterContainer = page.getByTestId(basicFilterContainerTestId);

		await expect(basicFilterContainer).toBeVisible();
	});

	test('should open the popup when clicking on the trigger button', async ({ page }) => {
		await loadExample(page);

		await page.getByTestId('mode-toggle-basic').click();
		await page.getByTestId('jlol-basic-filter-project-trigger').click();

		const popupMenu = page.getByTestId('jlol-basic-filter-project-popup-select--menu');
		const popupSearchInput = page.locator('#jlol-basic-filter-project-popup-select--input');
		const popupFooter = page.getByTestId('jlol-basic-filter-project--footer');

		await expect(popupMenu).toBeVisible();
		await expect(popupSearchInput).toBeVisible();
		await expect(popupFooter).toBeVisible();
	});

	test('should show more options when scrolling to the bottom of the popup for projects and clicking showMore button', async ({
		page,
	}) => {
		await loadExample(page);

		await page.getByTestId('jlol-basic-filter-project-trigger').click();

		const showMoreButton = page.locator(
			'[data-testid="jlol-basic-filter-project--show-more-button"]',
		);

		await showMoreButton.scrollIntoViewIfNeeded();

		await showMoreButton.click();

		await expect(page.getByText('Test10', { exact: true })).toBeVisible();
		await expect(page.getByTestId('jlol-basic-filter-project--show-more-button')).toBeHidden();
	});

	test('should reload the datasource table when a filter is selected', async ({ page }) => {
		await loadExample(page);

		const initialDatasourceTable = page.getByTestId('datasource-modal--initial-state-view');

		await page.getByTestId('jlol-basic-filter-project-trigger').click();
		await page.locator('#react-select-2-option-0 span').first().click();

		// expect that the initial state view will no longer be visible
		await expect(initialDatasourceTable).toBeHidden();
		// expect that the datasource table will be visible
		await expect(page.getByTestId('jlol-basic-filter-project-trigger')).toBeVisible();
	});

	test('should not show selected values when search term is present', async ({ page }) => {
		await loadExample(page);

		await page.getByTestId('jlol-basic-filter-assignee-trigger').click();
		await page.locator('#react-select-2-option-0').click();

		await expect(page.locator('#react-select-2-option-0')).toHaveText('Unassigned');

		await page.fill('#jlol-basic-filter-assignee-popup-select--input', `empty-message`);

		await expect(page.getByTestId('jlol-basic-filter-assignee--no-options-message')).toBeVisible();

		await page.type('#jlol-basic-filter-assignee-popup-select--input', ``);
		await page.keyboard.press('Backspace');
		await page.waitForSelector('#react-select-2-option-0');

		await expect(page.locator('#react-select-2-option-0')).toHaveText('administrators');
	});
});
