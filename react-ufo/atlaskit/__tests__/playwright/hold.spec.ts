import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: hold (basic)', () => {
	test.use({
		examplePage: 'basic',
		featureFlags: ['platform_ufo_vc_ttai_on_paint'],
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test('hold info should be present', async ({
				waitForReactUFOPayload,
				getSectionVisibleAt,
			}) => {
				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
				const ufoProperties = reactUFOPayload!.attributes.properties;

				expect(typeof ufoProperties.interactionMetrics).toBe('object');
				const { interactionMetrics } = ufoProperties;

				const sectionTenRenderedAt = await getSectionVisibleAt('sectionTen');
				expect(sectionTenRenderedAt).not.toBeNull();

				expect(interactionMetrics.holdActive.length).toBe(0);

				expect(Array.isArray(interactionMetrics.holdInfo)).toBe(true);
				expect(interactionMetrics.holdInfo.length).toBeGreaterThanOrEqual(10);

				const lastHoldInfo = interactionMetrics.holdInfo[interactionMetrics.holdInfo.length - 1];
				expect(typeof lastHoldInfo.labelStack).toBe('string');
				expect(lastHoldInfo.labelStack.includes('section-ten')).toBe(true);

				expect(lastHoldInfo.endTime as number).toMatchTimeInSeconds(interactionMetrics.end);
			});
		});
	}
});

test.describe('ReactUFO: hold (basic section below viewport)', () => {
	test.use({
		examplePage: 'basic-section-below-viewport',
		featureFlags: ['platform_ufo_vc_ttai_on_paint'],
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test('hold info should be present', async ({
				waitForReactUFOPayload,
				getSectionVisibleAt,
			}) => {
				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
				const ufoProperties = reactUFOPayload!.attributes.properties;

				expect(typeof ufoProperties.interactionMetrics).toBe('object');
				const { interactionMetrics } = ufoProperties;

				const sectionThreeRenderedAt = await getSectionVisibleAt('sectionThree');
				expect(sectionThreeRenderedAt).not.toBeNull();

				expect(interactionMetrics.holdActive.length).toBe(0);

				expect(Array.isArray(interactionMetrics.holdInfo)).toBe(true);
				expect(interactionMetrics.holdInfo.length).toBeGreaterThanOrEqual(3);

				const lastHoldInfo = interactionMetrics.holdInfo[interactionMetrics.holdInfo.length - 1];
				expect(typeof lastHoldInfo.labelStack).toBe('string');
				expect(lastHoldInfo.labelStack.includes('section-three')).toBe(true);

				expect(lastHoldInfo.endTime as number).toMatchTimeInSeconds(interactionMetrics.end);
			});
		});
	}
});
