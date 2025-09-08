import { expect, test } from './fixtures';

test.describe('ReactUFO: minor interactions', () => {
	test.use({
		examplePage: 'basic-with-3-sections-button-minor-interactions-override',
		featureFlags: ['platform_ufo_enable_minor_interactions'],
	});

	test('interactionMetrics.minorInteractions should be `test-new-interaction` when the user clicks a button', async ({
		waitForReactUFOPayload,
		page,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		const button = page.getByText('new interaction button');
		await expect(mainDiv).toBeVisible();
		await expect(button).toBeVisible();

		await button.click();

		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
		const ufoProperties = reactUFOPayload!.attributes.properties;

		expect(typeof ufoProperties.interactionMetrics).toBe('object');
		const { interactionMetrics } = ufoProperties;
		expect(interactionMetrics.minorInteractions).toBeDefined();
		expect(interactionMetrics.minorInteractions).toEqual([
			{
				name: 'test-new-interaction',
				startTime: expect.any(Number),
			},
		]);
	});
});
