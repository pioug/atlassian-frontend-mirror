import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: hold (basic)', () => {
	test.use({
		examplePage: 'basic',
		featureFlags: [],
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

				const sectionNames = [
					'sectionOne',
					'sectionTwo',
					'sectionThree',
					'sectionFour',
					'sectionFive',
					'sectionSix',
					'sectionSeven',
					'sectionEight',
					'sectionNine',
					'sectionTen',
				];

				interactionMetrics.holdInfo.forEach((hold, index) => {
					expect(hold.labelStack.endsWith(sectionNames[index])).toBe(true);
					expect(typeof hold.startTime).toBe('number');
					expect(typeof hold.endTime).toBe('number');
				});
			});
		});
	}
});

test.describe('ReactUFO: hold (basic section below viewport)', () => {
	test.use({
		examplePage: 'basic-section-below-viewport',
		featureFlags: [],
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

				interactionMetrics.holdInfo.forEach((hold, index) => {
					expect(hold.labelStack.endsWith(`section-${index + 1}`)).toBe(true);
					expect(typeof hold.startTime).toBe('number');
					expect(typeof hold.endTime).toBe('number');
				});
			});
		});
	}
});
