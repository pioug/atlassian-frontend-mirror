import { expect, test } from './fixtures';

test.describe('ReactUFO: abort by timeout', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample<typeof import('../../examples/16-basic-with-changed-timeout.tsx')>(
			'react-ufo',
			'atlaskit',
			'basic-with-changed-timeout',
		);
	});

	test('interactionMetrics.abortReason should be `timeout` when the page takes too long to load', async ({
		waitForReactUFOPayload,
	}) => {
		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
		const ufoProperties = reactUFOPayload!.attributes.properties;

		expect(typeof ufoProperties.interactionMetrics).toBe('object');
		const { interactionMetrics } = ufoProperties;
		expect(interactionMetrics.abortReason).toBe('timeout');
	});

	test('should capture and report a11y violations', async ({ waitForReactUFOPayload, page }) => {
		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		await expect(page).toBeAccessible();
	});
});
