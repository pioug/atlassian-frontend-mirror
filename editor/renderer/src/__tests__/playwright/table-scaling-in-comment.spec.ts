import { rendererTestCase as test, expect } from './not-libra';
import {
	tableWithoutWidthAdf,
	tableWithoutWidthColumnResizedADf,
	tableWithWidthColumnNotResizedAdf,
	tableWithWidthColumnResizedAdf,
} from './table-scaling-in-comment.spec.ts-fixtures';

test.describe('table scaling in comment renderer', () => {
	test.describe('table without width column not resized', () => {
		test.use({
			adf: tableWithoutWidthAdf,
			rendererProps: {
				appearance: 'comment',
				UNSTABLE_allowTableResizing: true,
			},
			viewport: { width: 760, height: 600 },
			editorExperiments: {
				support_table_in_comment: true,
			},
		});
		test('table should scale down when scale percent is bigger than 0.4', async ({ renderer }) => {
			const table = renderer.page.getByRole('table');
			const beforeWidth = (await table.boundingBox())?.width;
			expect(beforeWidth).toBe(760);
			await renderer.page.setViewportSize({ width: 200, height: 600 });
			const targetWidth = 200;
			await renderer.page.waitForFunction(
				(targetWidth) => {
					const tableWidth = document.querySelector('table')?.getBoundingClientRect()?.width;
					return tableWidth && tableWidth <= targetWidth;
				},
				targetWidth,
				{ timeout: 1000 },
			);
			const afterWidth = (await table.boundingBox())?.width;
			expect(afterWidth).toBeCloseTo(200, 0);
		});
	});

	test.describe('table without width column resized', () => {
		test.use({
			adf: tableWithoutWidthColumnResizedADf,
			rendererProps: {
				appearance: 'comment',
				UNSTABLE_allowTableResizing: true,
			},
			viewport: { width: 760, height: 600 },
			editorExperiments: {
				support_table_in_comment: true,
			},
		});

		test('table should scale down when scale percent is bigger than 0.4', async ({ renderer }) => {
			const table = renderer.page.getByRole('table');

			const beforeWidth = (await table.boundingBox())?.width;
			expect(beforeWidth).toBe(760);
			// scale percent from 760 -> 300 is 0.6
			await renderer.page.setViewportSize({ width: 300, height: 600 });
			const targetWidth = 300;

			await renderer.page.waitForFunction(
				(targetWidth) => {
					const tableWidth = document.querySelector('table')?.getBoundingClientRect()?.width;
					return tableWidth && tableWidth <= targetWidth;
				},
				targetWidth,
				{ timeout: 1000 },
			);

			const afterWidth = (await table.boundingBox())?.width;
			expect(afterWidth).toBeCloseTo(300, 0);
		});
	});

	test.describe('table with width column not resized', () => {
		test.use({
			adf: tableWithWidthColumnNotResizedAdf,
			rendererProps: {
				appearance: 'comment',
				UNSTABLE_allowTableResizing: true,
			},
			viewport: { width: 760, height: 600 },
			editorExperiments: {
				support_table_in_comment: true,
			},
		});

		test('table should not scale down when scale percent is bigger than 0.4', async ({
			renderer,
		}) => {
			const table = renderer.page.getByRole('table');

			const beforeWidth = (await table.boundingBox())?.width;
			expect(beforeWidth).toBe(760);
			// scale percent from 760 -> 300 is 0.6
			await renderer.page.setViewportSize({ width: 300, height: 600 });
			const targetWidth = 454;

			await renderer.page.waitForFunction(
				(targetWidth) => {
					const tableWidth = document.querySelector('table')?.getBoundingClientRect()?.width;
					return tableWidth && tableWidth <= targetWidth;
				},
				targetWidth,
				{ timeout: 1000 },
			);

			const afterWidth = (await table.boundingBox())?.width;
			expect(afterWidth).toBeCloseTo(454, 0);
		});

		test('table should scale down when scale percent is smaller than 0.4', async ({ renderer }) => {
			const table = renderer.page.getByRole('table');

			const beforeWidth = (await table.boundingBox())?.width;
			expect(beforeWidth).toBe(760);
			// scale percent from 760 -> 500 is 0.34
			await renderer.page.setViewportSize({ width: 500, height: 600 });
			const targetWidth = 500;

			await renderer.page.waitForFunction(
				(targetWidth) => {
					const tableWidth = document.querySelector('table')?.getBoundingClientRect()?.width;
					return tableWidth && tableWidth <= targetWidth;
				},
				targetWidth,
				{ timeout: 1000 },
			);

			const afterWidth = (await table.boundingBox())?.width;
			expect(afterWidth).toBeCloseTo(500, 0);
		});
	});

	test.describe('table with width column resized', () => {
		test.use({
			adf: tableWithWidthColumnResizedAdf,
			rendererProps: {
				appearance: 'comment',
				UNSTABLE_allowTableResizing: true,
			},
			viewport: { width: 760, height: 600 },
			editorExperiments: {
				support_table_in_comment: true,
			},
		});

		test('table should not scale down when scale percent is bigger than 0.4', async ({
			renderer,
		}) => {
			const table = renderer.page.getByRole('table');

			const beforeWidth = (await table.boundingBox())?.width;
			expect(beforeWidth).toBe(760);
			// scale percent from 760 -> 380 is 0.5
			await renderer.page.setViewportSize({ width: 380, height: 600 });
			const targetWidth = 457;

			await renderer.page.waitForFunction(
				(targetWidth) => {
					const tableWidth = document.querySelector('table')?.getBoundingClientRect()?.width;
					return tableWidth && tableWidth <= targetWidth;
				},
				targetWidth,
				{ timeout: 1000 },
			);

			const afterWidth = (await table.boundingBox())?.width;
			expect(afterWidth).toBeCloseTo(457, 0);
		});

		test('table should scale down when scale percent is smaller than 0.4', async ({ renderer }) => {
			const table = renderer.page.getByRole('table');

			const beforeWidth = (await table.boundingBox())?.width;
			expect(beforeWidth).toBe(760);
			// scale percent from 760 -> 500 is 0.34
			await renderer.page.setViewportSize({ width: 500, height: 600 });
			const targetWidth = 500;

			await renderer.page.waitForFunction(
				(targetWidth) => {
					const tableWidth = document.querySelector('table')?.getBoundingClientRect()?.width;
					return tableWidth && tableWidth <= targetWidth;
				},
				targetWidth,
				{ timeout: 1000 },
			);

			const afterWidth = (await table.boundingBox())?.width;
			expect(afterWidth).toBeCloseTo(500, 0);
		});
	});
});
