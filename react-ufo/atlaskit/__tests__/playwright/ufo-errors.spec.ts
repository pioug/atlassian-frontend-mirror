/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('ReactUFO: Error Reporting', () => {
	test.use({
		examplePage: 'basic-with-error',
	});

	test('errors reported to UFO is handled correctly', async ({ waitForReactUFOPayload }) => {
		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
		const ufoProperties = reactUFOPayload!.attributes.properties;

		expect(typeof ufoProperties.interactionMetrics).toBe('object');
		const { interactionMetrics } = ufoProperties;

		expect(interactionMetrics.errors?.length).toBe(1);
		expect(interactionMetrics.errors?.[0]).toMatchObject({
			name: 'test',
			errorMessage: 'test error',
		});
	});

	test('should capture and report a11y violations', async ({ waitForReactUFOPayload, page }) => {
		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		await expect(page).toBeAccessible();
	});
});
