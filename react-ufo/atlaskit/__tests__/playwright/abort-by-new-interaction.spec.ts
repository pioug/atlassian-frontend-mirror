import { expect, test } from './fixtures';

test.describe('ReactUFO: abort by new interaction', () => {
	test.use({ examplePage: 'basic-three-sections-with-button' });

	test('interactionMetrics.abortReason should be `new_interaction` when the user clicks a button', async ({
		waitForReactUFOPayload,
		page,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		await expect(mainDiv).toBeVisible();

		await page.getByText('new interaction button').click();

		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
		const ufoProperties = reactUFOPayload!.attributes.properties;

		expect(typeof ufoProperties.interactionMetrics).toBe('object');
		const { interactionMetrics } = ufoProperties;
		expect(interactionMetrics.abortReason).toBe('new_interaction');
		expect(interactionMetrics.abortedByInteractionName).toBe('test-new-interaction');
	});

	test('should capture and report a11y violations', async ({ waitForReactUFOPayload, page }) => {
		const mainDiv = page.locator('[data-testid="main"]');
		await expect(mainDiv).toBeVisible();

		await expect(page).toBeAccessible();
	});
});
