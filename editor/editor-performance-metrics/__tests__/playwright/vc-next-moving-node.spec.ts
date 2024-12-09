import { expect } from '@af/integration-testing';

import { test } from './fixtures';

test.describe('Editor Metrics - TTVC: Moving node', () => {
	test.use({
		examplePage: 'vc-observer-moving-node',
	});

	test.describe('when measure the whole page', () => {
		test('it should have three timestamps (first rendering, attribute mutation and layout shifts) marks at the VCTargets', async ({
			page,
			getMetrics,
			waitForTicks,
		}) => {
			const firstTickAt = await waitForTicks(1);

			const metrics = await getMetrics();
			const VCTargets = await metrics!.calculateVCTargets();

			const timestamps = new Set(Object.values(VCTargets!));
			expect(timestamps.size).toBe(3);

			expect(VCTargets!['25']).toBeLessThanOrEqual(firstTickAt);
		});
	});

	test.describe('when an HTML node is replaced at the same mutation for a new one with the same dimensions', () => {
		test('it should mark the elements as "layout-shift" and "layout-shit:element-moved"', async ({
			page,
			getMetrics,
			waitForTicks,
		}) => {
			await waitForTicks(1);

			const metrics = await getMetrics();
			const heatmap = await metrics!.calculateLastHeatmap(10);

			expect(heatmap?.map[1][1].head).toEqual(
				expect.objectContaining({
					elementName: `div[data-testid="content-to-mutate"]`,
					source: 'layout-shift',
				}),
			);

			expect(heatmap?.map[5][1].head).toEqual(
				expect.objectContaining({
					elementName: `div[data-testid="content-to-be-moved"]`,
					source: 'layout-shift:element-moved',
				}),
			);
		});
	});
});
