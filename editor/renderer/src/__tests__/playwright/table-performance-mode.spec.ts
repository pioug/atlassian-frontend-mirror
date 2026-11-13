import type { DocNode } from '@atlaskit/adf-schema/doc';

import { expect, rendererTestCase as test } from './not-libra';

const adf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: { width: 1000, layout: 'default' },
			content: Array.from({ length: 20 }, (_, row) => ({
				type: 'tableRow',
				content: Array.from({ length: 4 }, (_, column) => ({
					type: row === 0 ? 'tableHeader' : 'tableCell',
					attrs: { colwidth: [250] },
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: `Row ${row}, column ${column}` }],
						},
					],
				})),
			})),
		},
	],
};

test.use({
	exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
	adf,
	viewport: { width: 1200, height: 600 },
});

for (const active of [false, true]) {
	test.describe(`Performance Mode ${active ? 'active' : 'inactive'}`, () => {
		test.use({
			rendererProps: {
				appearance: 'full-page',
				UNSTABLE_allowTableResizing: true,
				stickyHeaders: true,
				isPerformanceModeActive: active,
			},
		});

		test('gates sticky headers and shadow tracking', async ({ renderer }) => {
			const { page } = renderer;
			await renderer.waitForRendererStable();
			await expect(page.locator('[data-testid="sticky-table-fixed"]')).toHaveCount(active ? 0 : 1);
			await expect(page.locator('.sentinel-left')).toHaveCount(active ? 0 : 1);
		});

		if (active) {
			test('keeps authored width and supports keyboard scrolling on narrow screens', async ({
				renderer,
			}) => {
				await renderer.waitForRendererStable();
				const table = renderer.page.locator('[data-vc="table-node-wrapper"] > table');
				const before = (await table.boundingBox())!.width;
				await renderer.page.setViewportSize({ width: 320, height: 600 });
				await expect.poll(async () => (await table.boundingBox())!.width).toBeCloseTo(before, 0);
				const wrapper = renderer.page.getByRole('region', { name: 'Table scroll region' });
				await wrapper.focus();
				await expect(wrapper).toBeFocused();
				await renderer.page.keyboard.press('ArrowRight');
				await expect
					.poll(() => wrapper.evaluate((element) => element.scrollLeft))
					.toBeGreaterThan(0);
				await expect(renderer.page.locator('.left-shadow, .right-shadow')).toHaveCount(0);
			});
		} else {
			test('continues resizing to the viewport outside Performance Mode', async ({ renderer }) => {
				await renderer.waitForRendererStable();
				const table = renderer.page.locator('[data-vc="table-node-wrapper"] > table');
				const before = (await table.boundingBox())!.width;
				await renderer.page.setViewportSize({ width: 320, height: 600 });
				await expect.poll(async () => (await table.boundingBox())!.width).toBeLessThan(before);
			});
		}
	});
}

for (const scenario of [
	{ name: 'numbered columns', width: 1000, columns: [250, 250, 250, 250], numbered: true },
	{ name: 'mismatched saved column widths', width: 700, columns: [600, 200], numbered: false },
]) {
	test.describe(scenario.name, () => {
		test.use({
			adf: {
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'table',
						attrs: { width: scenario.width, isNumberColumnEnabled: scenario.numbered },
						content: [
							{
								type: 'tableRow',
								content: scenario.columns.map((width) => ({
									type: 'tableCell',
									attrs: { colwidth: [width] },
									content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cell' }] }],
								})),
							},
						],
					},
				],
			},
			rendererProps: {
				appearance: 'full-page',
				UNSTABLE_allowTableResizing: true,
				isPerformanceModeActive: true,
			},
		});

		test('preserves the saved width across viewport sizes', async ({ renderer }) => {
			await renderer.waitForRendererStable();
			const table = renderer.page.getByRole('table');
			await expect
				.poll(async () => (await table.boundingBox())!.width)
				.toBeCloseTo(scenario.width, 0);
			await renderer.page.setViewportSize({ width: 320, height: 600 });
			await expect
				.poll(async () => (await table.boundingBox())!.width)
				.toBeCloseTo(scenario.width, 0);
		});
	});
}
