import { expect } from '@af/integration-testing';

import { test } from './fixtures';

test.describe('Editor Metrics - TTVC: Element moving', () => {
	test.use({
		examplePage: 'vc-observer-moving-node',
	});

	test.describe('when measure the whole page', () => {
		test('it should have three timestamps marks at the VCTargets', async ({
			page,
			getMetrics,
			waitForTicks,
		}) => {
			await waitForTicks(1);

			const metrics = await getMetrics();
			const VCTargets = await metrics?.calculateVCTargets();

			const timestamps = new Set(Object.values(VCTargets!));
			expect(timestamps.size).toBe(3);
		});
	});

	test.describe('when ignoreLayoutShifts and ignoreElementMoved are enabled', () => {
		test('it should ignore changes from layout shifts and return a single timestamp for the VCTargets', async ({
			page,
			getMetrics,
			waitForTicks,
		}) => {
			await waitForTicks(1);

			const metrics = await getMetrics();
			const VCTargets = await metrics?.calculateVCTargets({
				ignoreElementMoved: true,
				ignoreLayoutShifts: true,
			});

			const timestamps = new Set(Object.values(VCTargets!));
			expect(timestamps.size).toBe(1);
		});
	});

	test.describe('when ignoreLayoutShifts is enabled', () => {
		test('it should ignore changes from layout shifts and return a two timestamp for the VCTargets', async ({
			page,
			getMetrics,
			waitForTicks,
		}) => {
			await waitForTicks(1);

			const metrics = await getMetrics();
			const VCTargets = await metrics?.calculateVCTargets({
				ignoreLayoutShifts: true,
			});

			const timestamps = new Set(Object.values(VCTargets!));
			expect(timestamps.size).toBe(2);
		});
	});

	test.describe('when ignoreElementMoved is enabled', () => {
		test('it should ignore changes from layout shifts and return a two timestamp for the VCTargets', async ({
			page,
			getMetrics,
			waitForTicks,
		}) => {
			await waitForTicks(1);

			const metrics = await getMetrics();
			const VCTargets = await metrics?.calculateVCTargets({
				ignoreElementMoved: true,
			});

			const timestamps = new Set(Object.values(VCTargets!));
			expect(timestamps.size).toBe(2);
		});
	});
});
