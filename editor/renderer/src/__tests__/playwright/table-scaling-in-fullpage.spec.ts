import { rendererTestCase as test, expect } from './not-libra';

import { numberedColumnTableWithWidthAdf } from './table-scaling-fullpage.spec.ts-fixtures';

test.describe('numbered column table scaling in full page renderer', () => {
	test.use({
		adf: numberedColumnTableWithWidthAdf,
		rendererProps: {
			appearance: 'full-page',
			UNSTABLE_allowTableResizing: true,
		},
		viewport: { width: 900, height: 600 },
		platformFeatureFlags: { tablePreserveWidth: true },
	});

	test('table should not scale down when scale percent is bigger than 0.3', async ({
		renderer,
	}) => {
		const table = renderer.page.getByRole('table');

		const beforeWidth = (await table.boundingBox())?.width;
		expect(beforeWidth).toBe(760);
		// scale percent from 760 -> 300 is 0.6
		await renderer.page.setViewportSize({ width: 300, height: 600 });
		const targetWidth = 544;

		await renderer.page.waitForFunction(
			(targetWidth) => {
				const tableWidth = document.querySelector('table')?.getBoundingClientRect()?.width;
				return tableWidth && tableWidth <= targetWidth;
			},
			targetWidth,
			{ timeout: 1000 },
		);

		const afterWidth = (await table.boundingBox())?.width;
		expect(afterWidth).toBeCloseTo(544, 0);
	});

	test('table should scale down when scale percent is smaller than 0.3', async ({ renderer }) => {
		const table = renderer.page.getByRole('table');

		const beforeWidth = (await table.boundingBox())?.width;
		expect(beforeWidth).toBe(760);
		await renderer.page.setViewportSize({ width: 660, height: 600 });
		const targetWidth = 596;

		await renderer.page.waitForFunction(
			(targetWidth) => {
				const tableWidth = document.querySelector('table')?.getBoundingClientRect()?.width;
				return tableWidth && tableWidth <= targetWidth;
			},
			targetWidth,
			{ timeout: 1000 },
		);

		const afterWidth = (await table.boundingBox())?.width;
		expect(afterWidth).toBeCloseTo(596, 0);
	});
});
