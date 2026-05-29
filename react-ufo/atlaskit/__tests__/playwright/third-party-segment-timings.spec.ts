import { expect, test } from './fixtures';

test.describe('ReactUFO: UFOThirdPartySegment segment3pData', () => {
	test.use({
		examplePage: 'third-party-segment-timings',
		featureFlags: ['platform_ufo_3p_segment_timings', 'platform_ufo_ecosystem_data_in_payload'],
	});

	test('segment3pData from iframe analytics appear grouped by segmentId in interactionMetrics', async ({
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

		type Segment3pEntry = { meta: Record<string, string | undefined>; timings: Array<{ label: string; data: Record<string, unknown> }> };
		type Segment3pDataPayload = { segments: Record<string, Segment3pEntry>; trim?: true };

		const segment3pData = (
			interactionMetrics as { segment3pData?: Segment3pDataPayload }
		).segment3pData;
		expect(segment3pData).toBeDefined();
		expect(typeof segment3pData!.segments).toBe('object');

		// There should be exactly one segmentId key
		const segmentIds = Object.keys(segment3pData!.segments);
		expect(segmentIds.length).toBe(1);
		expect(typeof segmentIds[0]).toBe('string');

		const segmentEntry = segment3pData!.segments[segmentIds[0]];
		expect(segmentEntry).toBeDefined();
		expect(Array.isArray(segmentEntry.timings)).toBe(true);
		expect(segmentEntry.timings.length).toBeGreaterThanOrEqual(2);

		const navigationTiming = segmentEntry.timings.find((r) => r.label === 'navigation-timing');
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
		const paintTiming = segmentEntry.timings.find((r) => r.label === 'paint-timing');
		expect(paintTiming).toBeDefined();
		expect(paintTiming!.data.name).toBe('first-contentful-paint');
		expect(typeof paintTiming!.data.startTime).toBe('number');
		expect(paintTiming!.data.elapsed).toBeUndefined();
	});
});
