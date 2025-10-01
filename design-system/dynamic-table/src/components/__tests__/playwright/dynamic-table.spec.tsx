import { expect, test } from '@af/integration-testing';

const table = `[data-testid$='table']`;
const tableHead = `[data-testid$='head']`;
const tableHeadCell = `[data-testid$='head--cell']`;
const tableHeadName = `${tableHeadCell}:nth-child(1)`;
const tableHeadNameSortButton = `${tableHeadName} > div > div > button`;
const tableHeadParty = `${tableHeadCell}:nth-child(2)`;
const tableHeadTerm = `${tableHeadCell}:nth-child(3)`;
const tableHeadComment = `${tableHeadCell}:nth-child(4)`;
const tableRowG = `[data-testid$='george-washington-1789-1797']`;
const tableRowJ = `[data-testid$='john-adams-1797-1801']`;
const tableRowT = `[data-testid$='thomas-jefferson-1801-1809']`;
const tableRowJa = `[data-testid$='james-madison-1809-1817']`;
const tableRowA = `[data-testid$='abraham-lincoln-1861-1865']`;
const tableCell0 = `[data-testid$='cell-0']`;
const tableCell1 = `[data-testid$='cell-1']`;
const tableCell2 = `[data-testid$='cell-2']`;
const tableCell3 = `[data-testid$='cell-3']`;

test('DynamicTable elements should be able to be identified, interacted and sorted by data-testid', async ({
	page,
}) => {
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
		{
			// The avatar has hidden text, so we use `useInnerText` to only return visible text
			useInnerText: true,
		},
	);
	await expect(page.locator(`${tableRowT} > ${tableCell1}`).first()).toHaveText(
		'Democratic-Republican',
	);
	await expect(page.locator(`${tableRowJa} > ${tableCell3}`).first()).toHaveText('3');

	// Sort by name.
	await page.locator(tableHeadNameSortButton).first().click();

	// Check for visibility & content after sorting.
	await expect(page.locator(tableRowA).first()).toBeVisible();
	await expect(page.locator(`${tableRowA} > ${tableCell0}`).first()).toHaveText('Abraham Lincoln', {
		// The avatar has hidden text, so we use `useInnerText` to only return visible text
		useInnerText: true,
	});
	await expect(page.locator(`${tableRowA} > ${tableCell1}`).first()).toHaveText('Republican');
	await expect(page.locator(`${tableRowA} > ${tableCell2}`).first()).toHaveText('1861-1865');
	await expect(page.locator(`${tableRowA} > ${tableCell3}`).first()).toHaveText('5');
});

test('the highlighted row stays consistent after sorting', async ({ page }) => {
	await page.visitExample('design-system', 'dynamic-table', 'highlighted-row-with-sorting');

	const highlightedRow = page.locator('[data-ts--dynamic-table--table-row--highlighted="true"]');

	// The highlighted row is Andrew Jackson
	await expect(highlightedRow.locator('td').nth(0)).toHaveText('Andrew Jackson', {
		// The avatar has hidden text, so we use `useInnerText` to only return visible text
		useInnerText: true,
	});
	// It is the 7th row (index 6)
	expect(highlightedRow.elementHandle).toBe(page.locator('tr').nth(6).elementHandle);

	// Sort by party
	await page.getByRole('button', { name: 'Party' }).click();

	// The highlighted row is still Andrew Jackson
	await expect(highlightedRow.locator('td').nth(0)).toHaveText('Andrew Jackson', {
		// The avatar has hidden text, so we use `useInnerText` to only return visible text
		useInnerText: true,
	});
	// It is now the 1st row (index 0)
	expect(highlightedRow.elementHandle).toBe(page.locator('tr').nth(0).elementHandle);
});
