import { expect, test } from './fixtures';

test.describe('ReactUFO: UFOThirdPartySegment segment3pTimings', () => {
	test.use({
		examplePage: 'third-party-segment-timings',
		featureFlags: ['platform_ufo_3p_segment_timings', 'platform_ufo_ecosystem_data_in_payload'],
	});

	test('segment3pTimings from iframe analytics appear as label/data rows in interactionMetrics', async ({
		waitForReactUFOPayload,
		page,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		await expect(mainDiv).toBeVisible();

		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		const ufoProperties = reactUFOPayload!.attributes.properties;
		expect(typeof ufoProperties.interactionMetrics).toBe('object');

		const { interactionMetrics } = ufoProperties;

		const segment3pTimings = (interactionMetrics as { segment3pTimings?: Record<string, unknown> })
			.segment3pTimings;
		expect(segment3pTimings).toBeDefined();
		expect(typeof segment3pTimings).toBe('object');

		const segmentIds = Object.keys(segment3pTimings!);
		expect(segmentIds).toHaveLength(1);

		const [segmentId] = segmentIds;
		expect(typeof segmentId).toBe('string');
		expect(segmentId.length).toBeGreaterThan(0);

		const rows = segment3pTimings![segmentId] as Array<{
			label: string;
			data: Record<string, unknown>;
		}>;
		expect(Array.isArray(rows)).toBe(true);
		expect(rows.length).toBeGreaterThanOrEqual(2);

		const navigationTiming = rows.find((r) => r.label === 'navigation-timing');
		expect(navigationTiming).toBeDefined();
		// After shapeNavigationTimingData, the label is the last path segment of payload.name
		expect(navigationTiming!.data.label).toBe('iframe');
		// Timing fields come from payload.timing (rounded)
		expect(navigationTiming!.data.fetchStart).toBe(10);
		expect(navigationTiming!.data.responseStart).toBe(150);
		expect(navigationTiming!.data.responseEnd).toBe(300);
		expect(navigationTiming!.data.type).toBe('navigate');
		expect(navigationTiming!.data.redirectCount).toBe(0);

		const paintTiming = rows.find((r) => r.label === 'paint-timing');
		expect(paintTiming).toBeDefined();
		expect(paintTiming!.data.start).toBe(120);
		expect(paintTiming!.data.paintType).toBe('first-contentful-paint');
		expect(typeof paintTiming!.data.elapsed).toBe('number');
	});
});
