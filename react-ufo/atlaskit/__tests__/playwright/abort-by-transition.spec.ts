import { expect, test } from './fixtures';

test.describe('ReactUFO: abort by transition', () => {
	test.use({ examplePage: 'basic-with-transition' });

	test('interactionMetrics.abortReason should be `transition` when a transition occurs', async ({
		waitForReactUFOPayload,
	}) => {
		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
		const ufoProperties = reactUFOPayload!.attributes.properties;

		expect(typeof ufoProperties.interactionMetrics).toBe('object');
		const { interactionMetrics } = ufoProperties;
		expect(interactionMetrics.abortReason).toBe('transition');
	});
});
