import { expect, test } from './fixtures';

test.describe('ReactUFO: abort by transition', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample<typeof import('../../examples/17-basic-with-transition.tsx')>(
			'react-ufo',
			'atlaskit',
			'basic-with-transition',
		);
	});

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

	test('should capture and report a11y violations', async ({ waitForReactUFOPayload, page }) => {
		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		await expect(page).toBeAccessible();
	});
});
