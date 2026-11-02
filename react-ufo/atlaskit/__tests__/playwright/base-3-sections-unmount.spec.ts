/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: UFOSegment unmount', () => {
	test.use({
		examplePage: 'basic-section-unmount',
	} satisfies {
		examplePage: 'basic-section-unmount';
		__exampleDependency?: typeof import('../../examples/03-basic-section-unmount.tsx');
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test('unmountCount should be present in the UFO payload', async ({
				waitForReactUFOPayload,
			}) => {
				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
				const ufoProperties = reactUFOPayload!.attributes.properties;

				expect(typeof ufoProperties.interactionMetrics).toBe('object');
				const { interactionMetrics } = ufoProperties;

				const { reactProfilerTimings } = interactionMetrics;
				expect(reactProfilerTimings).toBeDefined();

				const unmountTimings = reactProfilerTimings.filter(
					(item) => typeof item.unmountCount === 'number' && item.unmountCount > 0,
				);
				// Check unmountCount for section-one-segment
				expect(unmountTimings).toHaveLength(1);
			});
		});
	}
});
