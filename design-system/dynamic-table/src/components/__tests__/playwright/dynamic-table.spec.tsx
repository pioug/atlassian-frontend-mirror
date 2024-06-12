import { expect, fixTest, test } from '@af/integration-testing';

const table = `[data-testid$='table']`;
const tableHead = `[data-testid$='head']`;
const tableHeadCell = `[data-testid$='head--cell']`;
const tableHeadName = `${tableHeadCell}:nth-child(1)`;
const tableHeadNameSortButton = `${tableHeadName} > button`;
const tableHeadParty = `${tableHeadCell}:nth-child(2)`;
const tableHeadTerm = `${tableHeadCell}:nth-child(3)`;
const tableHeadComment = `${tableHeadCell}:nth-child(4)`;
const tableRowG = `[data-testid$='George Washington']`;
const tableRowJ = `[data-testid$='John Adams']`;
const tableRowT = `[data-testid$='Thomas Jefferson']`;
const tableRowJa = `[data-testid$='James Madison']`;
const tableRowA = `[data-testid$='Abraham Lincoln']`;
const tableCell0 = `[data-testid$='cell-0']`;
const tableCell1 = `[data-testid$='cell-1']`;
const tableCell2 = `[data-testid$='cell-2']`;
const tableCell3 = `[data-testid$='cell-3']`;

test('DynamicTable elements should be able to be identified, interacted and sorted by data-testid', async ({
	page,
}) => {
	fixTest({
		jiraIssueId: 'DSP-15916',
		reason: 'tableRowG text assertion failing on master',
	});

	await page.visitExample('design-system', 'dynamic-table', 'testing');

	// Check for visibility.
	await expect(page.locator(table).first()).toBeVisible();
	await expect(page.locator(tableHead).first()).toBeVisible();
	await expect(page.locator(tableHeadCell).first()).toBeVisible();
	await expect(page.locator(tableRowG).first()).toBeVisible();
	await expect(page.locator(tableRowJ).first()).toBeVisible();
	await expect(page.locator(tableRowT).first()).toBeVisible();
	await expect(page.locator(tableRowJa).first()).toBeVisible();

	// Check for content without sorting.
	await expect(page.locator(tableHeadName).first()).toHaveText('Name');
	await expect(page.locator(tableHeadParty).first()).toHaveText('Party');
	await expect(page.locator(tableHeadTerm).first()).toHaveText('Term');
	await expect(page.locator(tableHeadComment).first()).toHaveText('Comment');
	await expect(page.locator(`${tableRowG} > ${tableCell0}`).first()).toHaveText(
		'George Washington',
	);
	await expect(page.locator(`${tableRowT} > ${tableCell1}`).first()).toHaveText(
		'Democratic-Republican',
	);
	await expect(page.locator(`${tableRowJa} > ${tableCell3}`).first()).toHaveText('3');

	// Sort by name.
	await page.locator(tableHeadNameSortButton).first().click();

	// Check for visibility & content after sorting.
	await expect(page.locator(tableRowA).first()).toBeVisible();
	await expect(page.locator(`${tableRowA} > ${tableCell0}`).first()).toHaveText('Abraham Lincoln');
	await expect(page.locator(`${tableRowA} > ${tableCell1}`).first()).toHaveText('Republican');
	await expect(page.locator(`${tableRowA} > ${tableCell2}`).first()).toHaveText('1861-1865');
	await expect(page.locator(`${tableRowA} > ${tableCell3}`).first()).toHaveText('5');
});
