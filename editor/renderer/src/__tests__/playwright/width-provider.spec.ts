import { tableADF } from './width-provider.spec.ts-fixtures';
import { rendererTestCase as test, expect } from './not-libra';

test.describe('width-provider when table resizing is disabled', () => {
	test.use({
		adf: tableADF,
		rendererProps: {
			appearance: 'comment',
		},
		viewport: { width: 960, height: 600 },
		platformFeatureFlags: {
			platform_editor_table_support_in_comment: false,
		},
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

/*

Feature gate is always 'false' in Playwright test at the moment, so these test fail.
If feature gate removed, the tests work as expected.

import { tableWithCustomWidthADF } from './width-provider.spec.ts-fixtures';

test.describe('width-provider when table resizing is enabled', () => {
	test.use({
		adf: tableADF,
		rendererProps: {
			appearance: 'comment',
		},
		viewport: { width: 960, height: 600 },
		platformFeatureFlags: {
			platform_editor_table_support_in_comment: true,
		},
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
				// featureFlags: {
				// 	platform_editor_table_support_in_comment: true,
				// },
			},
			viewport: { width: 960, height: 600 },
		});

		test.only('should not be resized on page width change', async ({ renderer }) => {
			const table = renderer.page.getByRole('table');
			const ADFTableWidth = 880;

			await renderer.page.pause();
			const beforeWidth = (await table.boundingBox())?.width;
			expect(beforeWidth).toBe(ADFTableWidth);
			await renderer.page.setViewportSize({ width: 600, height: 600 });

			// Comment Renderer doesn't support Preserve Table Widths yet
			// Historically (before PTW), renderer has always scaled the table by up to 30%
			// when the viewport is smaller than the table's width.
			const targetWidth = 0.7 * ADFTableWidth;

			await renderer.page.pause();
			await renderer.page.waitForFunction(
				(targetWidth) => {
					const tableWidth = document.querySelector('table')?.getBoundingClientRect()?.width;
					return tableWidth && tableWidth <= targetWidth;
				},
				targetWidth,
				{ timeout: 1000 },
			);

			const afterWidth = (await table.boundingBox())?.width;
			expect(afterWidth).toBeCloseTo(ADFTableWidth, 0);
		});
	});
});
*/
