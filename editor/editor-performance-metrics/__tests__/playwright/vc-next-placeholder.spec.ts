import { expect } from '@af/integration-testing';

import { test } from './fixtures';

test.describe('Editor Metrics - TTVC: Placeholder', () => {
	test.use({
		examplePage: 'vc-observer-placeholder',
	});

	test.describe('when measure the whole page', () => {
		test('it should have two timestamps marks at the VCTargets', async ({
			page,
			getMetrics,
			waitForTicks,
		}) => {
			const firstTickAt = await waitForTicks(1);
			const secondTickAt = await waitForTicks(2);

			const metrics = await getMetrics();
			const VCTargets = await metrics!.calculateVCTargets();

			const timestamps = new Set(Object.values(VCTargets!));
			// The data-testid="section-to-replace" takes the
			expect(timestamps.size).toBe(2);

			expect(VCTargets!['25']).toBeLessThanOrEqual(firstTickAt);
			expect(VCTargets!['50']).toBeGreaterThanOrEqual(firstTickAt);
			expect(VCTargets!['50']).toBeLessThanOrEqual(secondTickAt);
			expect(VCTargets!['50']).toEqual(VCTargets!['99']);
		});
	});

	test.describe('when an HTML node is replaced at the same mutation for a new one with the same dimensions', () => {
		test('it should mark it as "mutation:node-replacement"', async ({
			page,
			getMetrics,
			waitForTicks,
		}) => {
			await waitForTicks(2);

			const metrics = await getMetrics();
			const heatmap = await metrics!.calculateLastHeatmap(10);

			expect(heatmap?.map[1][1].head).toEqual(
				expect.objectContaining({
					elementName: `div[data-testid=\"section-to-replace\"]`,
					source: 'mutation:node-replacement',
				}),
			);
		});
	});

	test('should capture and report a11y violations', async ({ page }) => {
		await expect(page.getByTestId('section-to-replace')).toBeVisible();
		await expect(page).toBeAccessible();
	});
});
