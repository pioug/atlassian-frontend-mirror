import type { DocNode } from '@atlaskit/adf-schema/doc';

import { expect, rendererTestCase as test } from './not-libra';

const tableAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
				width: 680,
			},
			content: Array.from({ length: 4 }, (_, rowIndex) => ({
				type: 'tableRow',
				content: Array.from({ length: 4 }, (_, columnIndex) => ({
					type: 'tableCell',
					attrs: { colwidth: [170] },
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: `row ${rowIndex + 1}, column ${columnIndex + 1}` }],
						},
					],
				})),
			})),
		},
	],
};

test.use({
	exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
	adf: tableAdf,
	rendererProps: { appearance: 'full-page' },
	viewport: { width: 420, height: 600 },
	deviceScaleFactor: 2,
});

const experimentCohorts = [
	{
		name: 'fix enabled under Q4',
		q4Enabled: true,
		fixEnabled: true,
		expectPseudoTop: '0px',
	},
	{
		name: 'fix disabled under Q4',
		q4Enabled: true,
		fixEnabled: false,
		expectPseudoTop: '-0.5px',
	},
	{
		name: 'Q4 disabled with fix enabled',
		q4Enabled: false,
		fixEnabled: true,
		expectPseudoTop: 'auto',
	},
] as const;

for (const cohort of experimentCohorts) {
	test.describe(cohort.name, () => {
		test.use({
			editorExperiments: {
				platform_editor_table_q4_loveability: cohort.q4Enabled,
			},
		});

		test.beforeEach(async ({ page }) => {
			await page.addInitScript((fixEnabled) => {
				const url = new URL(window.location.href);
				url.searchParams.set(
					'platformExperimentOverrides',
					JSON.stringify({
						platform_editor_table_border_overflow_fix: { isEnabled: fixEnabled },
					}),
				);
				window.history.replaceState(null, '', url);
			}, cohort.fixEnabled);
		});

		test('keeps border bounds gated and table scrolling usable', async ({ renderer }) => {
			await renderer.waitForRendererStable();
			await renderer.page.evaluate(() => {
				// Exercise fractional layout dimensions at 125% CSS zoom.
				document.documentElement.style.zoom = '125%';
			});
			await renderer.waitForRendererStable();

			const wrapper = renderer.page.locator('[data-vc="table-node-wrapper"]');
			const table = renderer.page.getByRole('table');
			await expect(wrapper).toHaveCount(1);
			await expect(table).toHaveCount(1);

			const verticalScrollTop = await wrapper.evaluate((element) => {
				element.scrollTop = 9999;
				return element.scrollTop;
			});
			expect(verticalScrollTop).toBe(0);
			await wrapper.evaluate((element) => {
				element.scrollTop = 0;
			});
			const pseudoTop = await table.evaluate((element) => getComputedStyle(element, '::after').top);
			expect(pseudoTop).toBe(cohort.expectPseudoTop);

			const horizontalScrollWidth = await wrapper.evaluate((element) => element.scrollWidth);
			const horizontalClientWidth = await wrapper.evaluate((element) => element.clientWidth);
			expect(horizontalScrollWidth).toBeGreaterThan(horizontalClientWidth);

			await wrapper.evaluate((element) => {
				element.scrollLeft = 9999;
			});
			await expect.poll(() => wrapper.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

			const lastCellVisibility = await wrapper.evaluate((element) => {
				const cells = element.querySelectorAll('td');
				const lastCell = cells.item(cells.length - 1);
				if (!lastCell) {
					return false;
				}
				return lastCell.getBoundingClientRect().right <= element.getBoundingClientRect().right + 1;
			});
			expect(lastCellVisibility).toBe(true);
		});
	});
}
