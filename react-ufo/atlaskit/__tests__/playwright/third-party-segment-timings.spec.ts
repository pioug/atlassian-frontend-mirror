import { expect, test } from './fixtures';

test.describe('ReactUFO: UFOThirdPartySegment segment3pTimings', () => {
	test.use({
		examplePage: 'third-party-segment-timings',
		featureFlags: ['platform_ufo_3p_segment_timings', 'platform_ufo_ecosystem_data_in_payload'],
	});

	test('segment3pTimings from iframe analytics appear as a flat array of label/data rows in interactionMetrics', async ({
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

		// segment3pTimings is now a flat array of { segmentId, label, data } rows
		const segment3pTimings = (
			interactionMetrics as {
				segment3pTimings?: Array<{ segmentId: string; label: string; data: Record<string, unknown> }>;
			}
		).segment3pTimings;
		expect(segment3pTimings).toBeDefined();
		expect(Array.isArray(segment3pTimings)).toBe(true);
		expect(segment3pTimings!.length).toBeGreaterThanOrEqual(2);

		// All rows must have a segmentId string
		const segmentIds = new Set(segment3pTimings!.map((r) => r.segmentId));
		expect(segmentIds.size).toBe(1);
		expect(typeof [...segmentIds][0]).toBe('string');

		const navigationTiming = segment3pTimings!.find((r) => r.label === 'navigation-timing');
		expect(navigationTiming).toBeDefined();
		// After shapeNavigationTimingData, the label is the last path segment of payload.name
		expect(navigationTiming!.data.label).toBe('iframe');
		// Timing fields come from payload.timing (rounded)
		expect(navigationTiming!.data.fetchStart).toBe(10);
		expect(navigationTiming!.data.responseStart).toBe(150);
		expect(navigationTiming!.data.responseEnd).toBe(300);
		expect(navigationTiming!.data.type).toBe('navigate');
		expect(navigationTiming!.data.redirectCount).toBe(0);

		// After shapePaintTimingData: { name, startTime } — no elapsed, no paintType
		const paintTiming = segment3pTimings!.find((r) => r.label === 'paint-timing');
		expect(paintTiming).toBeDefined();
		expect(paintTiming!.data.name).toBe('first-contentful-paint');
		expect(typeof paintTiming!.data.startTime).toBe('number');
		expect(paintTiming!.data.elapsed).toBeUndefined();
	});
});
