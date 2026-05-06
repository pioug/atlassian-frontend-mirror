import { expect, test } from './fixtures';

test.describe('ReactUFO: metric variants', () => {
	test.use({
		examplePage: 'basic-three-sections',
		featureFlags: ['platform_ufo_metric_variants'],
	});

	test('custom.interaction-metrics includes standard metric window when enabled', async ({
		page,
		waitForReactUFOPayload,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		await expect(mainDiv).toBeVisible();

		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		const properties = reactUFOPayload!.attributes.properties;
		expect(properties['experience:key']).toBe('custom.interaction-metrics');
		expect(typeof properties.interactionMetrics).toBe('object');

		const interactionMetrics =
			properties.interactionMetrics as typeof properties.interactionMetrics & {
				metricWindows: Record<string, unknown>;
			};
		expect(interactionMetrics.metricWindows).toBeDefined();
		expect(interactionMetrics.metricWindows.standard).toEqual({
			start: interactionMetrics.start,
			end: interactionMetrics.end,
			includeCategories: [],
			excludeCategories: ['third-party'],
		});

		const includeThirdPartyWindow = interactionMetrics.metricWindows['include-third-party'];
		expect(includeThirdPartyWindow).toEqual({
			start: interactionMetrics.start,
			end: expect.any(Number),
			includeCategories: ['third-party'],
			excludeCategories: [],
		});
		expect((includeThirdPartyWindow as { end: number }).end).toBeGreaterThanOrEqual(
			interactionMetrics.end,
		);
	});
});
