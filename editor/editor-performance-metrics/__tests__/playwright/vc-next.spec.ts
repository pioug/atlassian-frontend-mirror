/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect } from '@af/integration-testing';

import { test } from './fixtures';

test.describe('Editor Metrics - TTVC: basic operations', () => {
	test('it should setup and render the example page', async ({ page }) => {
		await expect(page.getByText('My content go here')).toBeVisible();
	});

	test('it should record the must-have timeline events', async ({
		page,
		getTimelineEvents,
		waitForTicks,
	}) => {
		await waitForTicks(5);

		const timeline = await getTimelineEvents();

		await test.step('check performance paint events', () => {
			expect(timeline).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						type: 'performance:first-paint',
					}),
				]),
			);
		});

		await test.step('check DOMMutation events', () => {
			expect(timeline).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						type: 'DOMMutation:finished',
					}),
				]),
			);
		});

		await test.step('check heatmap events', () => {
			expect(timeline).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						type: 'element:changed',
					}),
				]),
			);
		});

		await test.step('check idle events', () => {
			expect(timeline).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						type: 'idle-time',
					}),
				]),
			);
		});
	});
});

test.describe('Editor Metrics - TTVC: user first interaction', () => {
	test('it should record keyboard event', async ({ page, getTimelineEvents }) => {
		await page.keyboard.type('lol');
		const timeline = await getTimelineEvents();

		const abortEvents = timeline.filter((e) => e.type.startsWith('abort:user-interaction'));
		expect(abortEvents).toHaveLength(1);
		expect(abortEvents[0].data).toEqual({
			source: 'keydown',
		});
	});

	test('it should record scroll event', async ({ page, getTimelineEvents, waitForTicks }) => {
		await waitForTicks(12);

		const lastContent = page.getByTestId('content-99');
		await expect(lastContent).toBeAttached();

		await lastContent.scrollIntoViewIfNeeded();
		await expect(lastContent).toBeVisible();

		const timeline = await getTimelineEvents();

		const abortEvents = timeline.filter((e) => e.type.startsWith('abort:user-interaction'));
		expect(abortEvents).toHaveLength(1);
		expect(abortEvents[0].data).toEqual({
			source: 'scroll',
		});
	});

	test('it should record wheel event', async ({ page, getTimelineEvents, waitForTicks }) => {
		await waitForTicks(12);

		await page.mouse.wheel(0, 100);

		const timeline = await getTimelineEvents();

		const abortEvents = timeline.filter((e) => e.type.startsWith('abort:user-interaction'));
		expect(abortEvents).toHaveLength(1);
		expect(abortEvents[0].data).toEqual({
			source: 'wheel',
		});
	});

	test('it should record window resize event', async ({ page, getTimelineEvents }) => {
		await page.setViewportSize({
			width: 500,
			height: 601,
		});

		const waitIdle = await page.evaluate(() => {
			let resolve = () => {};
			const promise = new Promise<void>((_resolve) => {
				resolve = _resolve;
			});
			const later = window.requestIdleCallback || window.requestAnimationFrame;

			later(() => {
				resolve();
			});

			return promise;
		});

		await waitIdle;

		const timeline = await getTimelineEvents();

		const abortEvents = timeline.filter((e) => e.type.startsWith('abort:user-interaction'));
		expect(abortEvents).toHaveLength(1);
		expect(abortEvents[0].data).toEqual({
			source: 'resize',
		});
	});
});

test.describe('Editor Metrics - TTVC: clean up', () => {
	test.describe('when stop is called', () => {
		test('it should not record an user-interaction event', async ({ page, getTimelineEvents }) => {
			await page.evaluate(() => {
				const vcObserver = (window as any).__editor_performance_metrics_observer;

				vcObserver.stop();
			});

			await page.keyboard.type('lol');

			const timeline = await getTimelineEvents();

			const abortEvents = timeline.filter((e) => e.type.startsWith('abort:user-interaction'));
			expect(abortEvents).toHaveLength(0);
		});
	});
});

test.describe('Editor Metrics - TTVC: heatmap', () => {
	test('it should properly map the side nav mutation:attribute time', async ({
		page,
		getMetrics,
		waitForTicks,
	}) => {
		const firstTickAt = await waitForTicks(1);
		const secondTickAt = await waitForTicks(2);
		const thirdTickAt = await waitForTicks(3);

		await waitForTicks(4);

		const metrics = await getMetrics();
		const heatmap = await metrics!.calculateLastHeatmap(100);

		expect(heatmap?.map[14][1].head?.source).toEqual('mutation:attribute');
		expect(heatmap?.map[14][1].head?.time).toBeLessThanOrEqual(firstTickAt);

		expect(heatmap?.map[25][1].head?.source).toEqual('mutation:attribute');
		expect(heatmap?.map[25][1].head?.time).toBeLessThanOrEqual(secondTickAt);

		expect(heatmap?.map[42][1].head?.source).toEqual('mutation:attribute');
		expect(heatmap?.map[42][1].head?.time).toBeLessThanOrEqual(thirdTickAt);
	});

	test('it should properly map the side nav buttons', async ({
		page,
		getMetrics,
		waitForTicks,
	}) => {
		await waitForTicks(12);

		const metrics = await getMetrics();
		const heatmap = await metrics!.calculateLastHeatmap(100);

		expect(heatmap?.map[10][1].head).toEqual(
			expect.objectContaining({
				elementName: `button[data-testid="side-button-0"]`,
				source: 'mutation:children-element',
			}),
		);

		expect(heatmap?.map[14][1].head).toEqual(
			expect.objectContaining({
				elementName: `button[data-testid="side-button-1"]`,
				source: 'mutation:attribute',
			}),
		);

		expect(heatmap?.map[20][1].head).toEqual(
			expect.objectContaining({
				elementName: `button[data-testid="side-button-2"]`,
				source: 'layout-shift:element-moved',
			}),
		);

		expect(heatmap?.map[25][1].head).toEqual(
			expect.objectContaining({
				elementName: `button[data-testid="side-button-3"]`,
				source: 'mutation:attribute',
			}),
		);

		expect(heatmap?.map[31][1].head).toEqual(
			expect.objectContaining({
				elementName: `button[data-testid="side-button-4"]`,
				source: 'layout-shift:element-moved',
			}),
		);

		expect(heatmap?.map[37][1].head).toEqual(
			expect.objectContaining({
				elementName: `button[data-testid="side-button-5"]`,
				source: 'layout-shift:element-moved',
			}),
		);

		expect(heatmap?.map[37][1].head).toEqual(
			expect.objectContaining({
				elementName: `button[data-testid="side-button-5"]`,
				source: 'layout-shift:element-moved',
			}),
		);

		expect(heatmap?.map[42][1].head).toEqual(
			expect.objectContaining({
				elementName: `button[data-testid="side-button-6"]`,
				source: 'mutation:attribute',
			}),
		);

		expect(heatmap?.map[50][1].head).toEqual(
			expect.objectContaining({
				elementName: `button[data-testid="side-button-7"]`,
				source: 'layout-shift:element-moved',
			}),
		);

		expect(heatmap?.map[55][1].head).toEqual(
			expect.objectContaining({
				elementName: `button[data-testid="side-button-8"]`,
				source: 'layout-shift:element-moved',
			}),
		);

		expect(heatmap?.map[61][1].head).toEqual(
			expect.objectContaining({
				elementName: `button[data-testid="side-button-9"]`,
				source: 'layout-shift:element-moved',
			}),
		);
	});

	test('it should contain the timestamp for the DOM mutations and Layout Shifts', async ({
		page,
		getMetrics,
		waitForTicks,
	}) => {
		await waitForTicks(3);

		const metrics = await getMetrics();
		const heatmap = await metrics!.calculateLastHeatmap(10);

		const uniqueTimestamp = new Set(heatmap?.map.flat());

		expect(uniqueTimestamp.size).toBeGreaterThanOrEqual(5);
	});
});

test.describe('Editor Metrics - TTVC: EditorPerformanceObserver.calculateVCTargets', () => {
	test('it should calculate the VCPercent based on the timeline', async ({
		page,
		getMetrics,
		waitForTicks,
	}) => {
		// Side nav is stable after the third tick
		const thirdTickAt = await waitForTicks(3);

		// Two batch of SectionContent should be rendered already
		const sixthTickAt = await waitForTicks(6);

		// Most of the visible content is already rendered
		const seventhTickAt = await waitForTicks(7);

		await waitForTicks(12);

		const metrics = await getMetrics();
		const VCTargets = await metrics!.calculateVCTargets();

		expect(VCTargets!['50']).toBeLessThanOrEqual(thirdTickAt);
		expect(VCTargets!['75']).toBeLessThanOrEqual(sixthTickAt);
		expect(VCTargets!['80']).toBeLessThanOrEqual(sixthTickAt);
		expect(VCTargets!['85']).toBeLessThanOrEqual(sixthTickAt);
		expect(VCTargets!['95']).toBeLessThanOrEqual(sixthTickAt);
		expect(VCTargets!['98']).toBeLessThanOrEqual(seventhTickAt);
		expect(VCTargets!['99']).toBeLessThanOrEqual(seventhTickAt);
	});
});
