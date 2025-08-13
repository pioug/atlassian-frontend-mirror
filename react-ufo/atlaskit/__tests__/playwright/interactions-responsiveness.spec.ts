/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('ReactUFO: Responsiveness', () => {
	test.use({
		examplePage: 'interactions-simple-button',
	});
	test('get interactions responsiveness', async ({ page, waitForReactUFOInteractionPayload }) => {
		const mainDiv = page.locator('[id="app-main"]');
		await expect(mainDiv).toBeVisible();

		await page.getByText('new interaction button').click();

		const reactUFOPayload = await waitForReactUFOInteractionPayload();

		expect(reactUFOPayload).toBeDefined();

		// TODO assert actual value
		expect(reactUFOPayload!.attributes.properties.interactionMetrics.type).toBe('press');
		expect(reactUFOPayload!.attributes.properties.interactionMetrics.responsiveness).toBeDefined();
		expect(
			reactUFOPayload!.attributes.properties.interactionMetrics.responsiveness?.inputDelay,
		).toBeDefined();
		expect(
			reactUFOPayload!.attributes.properties.interactionMetrics.responsiveness
				?.experimentalInputToNextPaint,
		).toBeDefined();
	});

	test('should capture and report a11y violations', async ({
		page,
		waitForReactUFOInteractionPayload,
	}) => {
		const mainDiv = page.locator('[id="app-main"]');
		await expect(mainDiv).toBeVisible();

		await expect(page).toBeAccessible();
	});
});
