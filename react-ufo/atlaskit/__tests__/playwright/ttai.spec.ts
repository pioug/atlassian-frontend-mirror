import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: TTAI (basic)', () => {
	test.use({
		examplePage: 'basic',
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test('TTAI should be close to the timestamp when the last section is rendered', async ({
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

				expect(interactionMetrics.end).toMatchTimestamp(sectionTenRenderedAt);
			});
		});
	}
});

test.describe('ReactUFO: TTAI (basic section below viewport)', () => {
	test.use({
		examplePage: 'basic-section-below-viewport',
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test('TTAI should be close to the timestamp when the last section is rendered', async ({
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

				expect(interactionMetrics.end).toMatchTimestamp(sectionThreeRenderedAt);
			});
		});
	}
});
