import { expect } from '@af/integration-testing';

import { test } from './fixtures';

test.describe('Editor Metrics - TTVC: React remounting', () => {
	test.use({
		examplePage: 'vc-observer-react-remount',
	});

	test.describe('when measure the whole page', () => {
		test('it should have two timestamps (first rendering and DOM remounting) marks at the VCTargets', async ({
			page,
			getMetrics,
			waitForTicks,
		}) => {
			const firstTickAt = await waitForTicks(1);

			const metrics = await getMetrics();
			const VCTargets = await metrics!.calculateVCTargets();

			const timestamps = new Set(Object.values(VCTargets!));
			expect(timestamps.size).toBe(2);

			expect(VCTargets!['25']).toBeLessThanOrEqual(firstTickAt);
		});
	});

	test.describe('when an HTML node is replaced at the same mutation for a new one with the same dimensions', () => {
		test('it should mark the only square as "mutation:re-mounted"', async ({
			page,
			getMetrics,
			waitForTicks,
		}) => {
			await waitForTicks(1);

			const metrics = await getMetrics();
			const heatmap = await metrics!.calculateLastHeatmap(10);

			expect(heatmap?.map[1][1].head).toEqual(
				expect.objectContaining({
					elementName: `div[data-testid="inside-content"]`,
					source: 'mutation:re-mounted',
				}),
			);
		});
	});
});
