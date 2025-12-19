import type { Page } from '@playwright/test';

import { expect, rendererTestCase as test } from './not-libra';
import {
	tableSortingAdf,
	tableWithMergedCellsAdf,
	tableWithHeaderColumnButWithoutHeaderRow,
	tableWithHeaderColumnButWithoutHeaderRowWithoutNumberColumn,
} from './table-sorting.fixture';

class TableSortModel {
	constructor(private page: Page) {}

	public sortButton(
		type: 'no-sort' | 'asc' | 'desc' | 'not-allowed',
		columnName: string = 'Numbers',
	) {
		switch (type) {
			case 'no-sort':
				return this.page
					.getByRole('columnheader', { name: columnName })
					.getByLabel('No sort applied to the column');

			case 'asc':
				return this.page
					.getByRole('columnheader', { name: columnName })
					.getByLabel('Ascending sort applied');

			case 'desc':
				return this.page
					.getByRole('columnheader', { name: columnName })
					.getByLabel('Descending sort applied');

			case 'not-allowed':
				return this.page
					.getByRole('columnheader', { name: columnName })
					.getByLabel(" You can't sort a table with");
		}
	}

	public async getTableContents() {
		const contents = [];
		const rows = await this.page.getByRole('table').locator('tr').all();
		for (const row of rows) {
			const cells = await row.locator('td, th').all();
			const content = await Promise.all(cells.map(async (cell) => await cell.textContent()));
			contents.push(content);
		}
		return contents;
	}
}

test.describe('table sorting', () => {
	test.use({
		adf: tableSortingAdf,
		rendererProps: {
			appearance: 'full-page',
			allowColumnSorting: true,
		},
	});

	test('should sort table in asc on the first click', async ({ renderer }) => {
		const tableSortModel = new TableSortModel(renderer.page);

		await tableSortModel.sortButton('no-sort').click();
		await renderer.waitForRendererStable();

		const contents = await tableSortModel.getTableContents();

		await expect(tableSortModel.sortButton('asc')).toBeVisible();
		expect(contents).toStrictEqual([
			['Names', 'NumbersSort column Z to A', 'Dates'],
			['Rodrigo', '2', 'Aug 20, 2019 '],
			['Alex', '3', 'Aug 14, 2019 '],
			['Jesus', '3.5', 'Aug 23, 2019 '],
			['Stan', '4', 'Aug 15, 2019 '],
			['Ed', '5', 'Aug 29, 2019 '],
		]);
	});

	test('should sort table in desc in the second click', async ({ renderer }) => {
		const tableSortModel = new TableSortModel(renderer.page);

		await tableSortModel.sortButton('no-sort').click();
		await renderer.waitForRendererStable();

		await tableSortModel.sortButton('asc').click();
		await renderer.waitForRendererStable();

		const contents = await tableSortModel.getTableContents();

		await expect(tableSortModel.sortButton('desc')).toBeVisible();
		expect(contents).toStrictEqual([
			['Names', 'NumbersClear sorting', 'Dates'],
			['Ed', '5', 'Aug 29, 2019 '],
			['Stan', '4', 'Aug 15, 2019 '],
			['Jesus', '3.5', 'Aug 23, 2019 '],
			['Alex', '3', 'Aug 14, 2019 '],
			['Rodrigo', '2', 'Aug 20, 2019 '],
		]);
	});

	test('should return table to original on third click', async ({ renderer }) => {
		const tableSortModel = new TableSortModel(renderer.page);

		await tableSortModel.sortButton('no-sort').click();
		await renderer.waitForRendererStable();

		await tableSortModel.sortButton('asc').click();
		await renderer.waitForRendererStable();

		await tableSortModel.sortButton('desc').click();
		await renderer.waitForRendererStable();

		const contents = await tableSortModel.getTableContents();

		await expect(tableSortModel.sortButton('no-sort')).toBeVisible();
		expect(contents).toStrictEqual([
			['Names', 'NumbersSort column A to Z', 'Dates'],
			['Rodrigo', '2', 'Aug 20, 2019 '],
			['Alex', '3', 'Aug 14, 2019 '],
			['Stan', '4', 'Aug 15, 2019 '],
			['Ed', '5', 'Aug 29, 2019 '],
			['Jesus', '3.5', 'Aug 23, 2019 '],
		]);
	});

	test('should sort by dates', async ({ renderer }) => {
		const tableSortModel = new TableSortModel(renderer.page);

		await tableSortModel.sortButton('no-sort', 'Dates').click();
		await renderer.waitForRendererStable();

		const contents = await tableSortModel.getTableContents();

		await expect(tableSortModel.sortButton('asc', 'Dates')).toBeVisible();
		expect(contents).toStrictEqual([
			['Names', 'Numbers', 'DatesSort column Z to A'],
			['Alex', '3', 'Aug 14, 2019 '],
			['Stan', '4', 'Aug 15, 2019 '],
			['Rodrigo', '2', 'Aug 20, 2019 '],
			['Jesus', '3.5', 'Aug 23, 2019 '],
			['Ed', '5', 'Aug 29, 2019 '],
		]);
	});

	test.describe('without merged cells', () => {
		test('should have aria-hidden set to false', async ({ renderer }) => {
			const tableSortModel = new TableSortModel(renderer.page);
			await expect(tableSortModel.sortButton('no-sort')).toBeVisible();
			await expect(tableSortModel.sortButton('no-sort')).toHaveAttribute('aria-hidden', 'false');
		});

		test('should capture and report a11y violations', async ({ renderer }) => {
			const tableSortModel = new TableSortModel(renderer.page);
			await expect(tableSortModel.sortButton('no-sort')).toBeVisible();

			await expect(renderer.page).toBeAccessible();
		});
	});

	test.describe('with merged cells', () => {
		test.use({
			adf: tableWithMergedCellsAdf,
		});

		test('should display not allowed message', async ({ renderer }) => {
			const tableSortModel = new TableSortModel(renderer.page);
			await expect(tableSortModel.sortButton('not-allowed')).toBeVisible();
			await expect(tableSortModel.sortButton('not-allowed')).toBeDisabled();
		});

		test('should have aria-hidden set to true', async ({ renderer }) => {
			const tableSortModel = new TableSortModel(renderer.page);
			await expect(tableSortModel.sortButton('not-allowed')).toBeVisible();
			await expect(tableSortModel.sortButton('not-allowed')).toHaveAttribute('aria-hidden', 'true');
		});

		test('should capture and report a11y violations', async ({ renderer }) => {
			const tableSortModel = new TableSortModel(renderer.page);
			await expect(tableSortModel.sortButton('not-allowed')).toBeVisible();

			await expect(renderer.page).toBeAccessible();
		});
	});

	test.describe('when there is no header row', () => {
		test.describe('when the table has a number column', () => {
			test.use({
				adf: tableWithHeaderColumnButWithoutHeaderRow,
			});

			test('should not display sort button', async ({ renderer }) => {
				await expect(renderer.page.getByRole('button')).toBeHidden();
			});

			test('should capture and report a11y violations', async ({ renderer }) => {
				await expect(renderer.page.getByRole('button')).toBeHidden();

				await expect(renderer.page).toBeAccessible({ violationCount: 1 });
			});
		});

		test.describe('when the table does not have a number column', () => {
			test.use({
				adf: tableWithHeaderColumnButWithoutHeaderRowWithoutNumberColumn,
			});

			test('should not display sort button', async ({ renderer }) => {
				await expect(renderer.page.getByRole('button')).toBeHidden();
			});
		});
	});
});
