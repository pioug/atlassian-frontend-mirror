import { tableADF, tableWithCustomWidthADF } from './width-provider.spec.ts-fixtures';
import { rendererTestCase as test, expect } from './not-libra';

test.describe('width-provider when table resizing is disabled', () => {
	test.use({
		adf: tableADF,
		rendererProps: {
			appearance: 'comment',
		},
		viewport: { width: 960, height: 600 },
	});

	test('should resize table on page width change', async ({ renderer }) => {
		const table = renderer.page.getByRole('table');

		const beforeWidth = (await table.boundingBox())?.width;
		expect(beforeWidth).toBe(960);
		await renderer.page.setViewportSize({ width: 600, height: 600 });
		const targetWidth = 600;

		await renderer.page.waitForFunction(
			(targetWidth) => {
				const tableWidth = document.querySelector('table')?.getBoundingClientRect()?.width;
				return tableWidth && tableWidth <= targetWidth;
			},
			targetWidth,
			{ timeout: 1000 },
		);

		const afterWidth = (await table.boundingBox())?.width;
		expect(afterWidth).toBeCloseTo(600, 0);
	});
});

test.describe('width-provider when table resizing is enabled', () => {
	test.use({
		adf: tableADF,
		rendererProps: {
			appearance: 'comment',
			UNSTABLE_allowTableResizing: true,
		},
		viewport: { width: 960, height: 600 },
	});

	test.describe('table without width', () => {
		test('should be resized on page width change', async ({ renderer }) => {
			const table = renderer.page.getByRole('table');

			const beforeWidth = (await table.boundingBox())?.width;
			expect(beforeWidth).toBe(960);
			await renderer.page.setViewportSize({ width: 600, height: 600 });
			const targetWidth = 600;

			await renderer.page.waitForFunction(
				(targetWidth) => {
					const tableWidth = document.querySelector('table')?.getBoundingClientRect()?.width;
					return tableWidth && tableWidth <= targetWidth;
				},
				targetWidth,
				{ timeout: 1000 },
			);

			const afterWidth = (await table.boundingBox())?.width;
			expect(afterWidth).toBeCloseTo(600, 0);
		});
	});

	test.describe('table with custom width', () => {
		test.use({
			adf: tableWithCustomWidthADF,
			rendererProps: {
				appearance: 'comment',
				UNSTABLE_allowTableResizing: true,
			},
			viewport: { width: 960, height: 600 },
		});

		test('should not be resized on page width change', async ({ renderer }) => {
			const table = renderer.page.getByRole('table');
			const ADFTableWidth = 880;
			const newViwportWidth = 500;

			const beforeWidth = (await table.boundingBox())?.width;
			expect(beforeWidth).toBe(ADFTableWidth);
			await renderer.page.setViewportSize({ width: newViwportWidth, height: 600 });

			// NOTE: this tests uses 30% as MAX_SCALING_PERCENT because our Renderer Playwright tests
			// do not support feature flags yet. When tablePreserveWidth is enabled,
			// Comment Renderer should use 40% scaling.

			// tableWidthDiff = (ADFTableWidth - newViwportWidth) / ADFTableWidth =
			// 				  = (880 - 600) / 880 = 0.318;
			// Scale table by = tableWidthDiff > MAX_SCALING_PERCENT ? MAX_SCALING_PERCENT : tableWidthDiff;
			// New table width will be using max scaling percent (30%). So new target width is equal:
			const targetWidth = 0.7 * ADFTableWidth;

			await renderer.page.waitForFunction(
				(targetWidth) => {
					const tableWidth = document.querySelector('table')?.getBoundingClientRect()?.width;
					return tableWidth && tableWidth <= targetWidth;
				},
				targetWidth,
				{ timeout: 1000 },
			);

			const afterWidth = (await table.boundingBox())?.width;
			expect(afterWidth).toBeCloseTo(targetWidth, 0);
		});
	});
});

test('should capture and report a11y violations', async ({ renderer }) => {
	renderer.page.getByRole('table');

	await expect(renderer.page).toBeAccessible({ violationCount: 2 });
});
