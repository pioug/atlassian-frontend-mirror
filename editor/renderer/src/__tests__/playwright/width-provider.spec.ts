import { skipAutoA11yFile } from '@atlassian/a11y-playwright-testing';

import { rendererTestCase as test, expect } from './not-libra';
import { tableADF, tableWithCustomWidthADF } from './width-provider.spec.ts-fixtures';

test.use({ exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx') });
// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:playwright
skipAutoA11yFile({
	exceptTests: [
		'should be resized on page width change',
		'should resize table on page width change',
	],
});

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

			// NOTE: Comment Renderer uses 40% as MAX_SCALING_PERCENT
			// (MAX_SCALING_PERCENT_TABLES_WITH_FIXED_COLUMN_WIDTHS_OPTION) because
			// isTableScalingEnabled is always true for comment appearance, which would cap the
			// rendered width at 526px (floor(880/3) = 293 per column, 293 * 3 = 879,
			// 879 * 0.6 = 527.4 → 526px).
			//
			// The table has an explicit `width` attribute, so the comment renderer's container
			// query resolves its width to min(tableWidth, 100cqw). The 100cqw clamp is the tighter
			// of the two, so the table tracks the 500px renderer width rather than stopping at the
			// 40% maximum column scale down.
			const targetWidth = newViwportWidth;

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
	await expect(renderer.page).toBeAccessible({ violationCount: 1 });
});
