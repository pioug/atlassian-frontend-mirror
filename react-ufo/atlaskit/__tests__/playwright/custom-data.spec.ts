import { expect, test } from './fixtures';

test.describe('ReactUFO: Custom Data', () => {
	test.use({
		examplePage: 'basic-with-custom-data',
		featureFlags: [],
	});

	test('custom data should be present in the UFO payload', async ({
		page,
		waitForReactUFOPayload,
		getSectionVisibleAt,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		const sections = page.locator('[data-testid="main"] > div');

		await expect(mainDiv).toBeVisible();
		await expect(sections.nth(2)).toBeVisible();

		const sectionThreeVisibleAt = await getSectionVisibleAt('sectionThree');
		expect(sectionThreeVisibleAt).toBeDefined();

		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
		const ufoProperties = reactUFOPayload!.attributes.properties;

		expect(typeof ufoProperties.interactionMetrics).toBe('object');
		const { interactionMetrics } = ufoProperties;

		// Verify custom data is present
		expect(Array.isArray(interactionMetrics.customData)).toBe(true);
		expect(interactionMetrics.customData.length).toBeGreaterThanOrEqual(2);

		const fnData = interactionMetrics.customData[0];
		expect(fnData).toBeDefined();
		expect(fnData?.data.product).toBe('mock');

		const appMetrics = interactionMetrics.customData[1];
		expect(appMetrics).toBeDefined();
		expect(appMetrics?.data.appCreatedAt).toBeDefined();
		expect(typeof appMetrics?.data.appCreatedAt).toBe('number');
		expect(appMetrics?.data.screenWidth).toBeDefined();
		expect(typeof appMetrics?.data.screenWidth).toBe('number');
		expect(appMetrics?.data.screenHeight).toBeDefined();
		expect(typeof appMetrics?.data.screenHeight).toBe('number');
	});

	test('should capture and report a11y violations', async ({
		page,
		waitForReactUFOPayload,
		getSectionVisibleAt,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		await expect(mainDiv).toBeVisible();

		await expect(page).toBeAccessible();
	});
});
