/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('ReactUFO: Interactions VC', () => {
	const requiredFeatureFlags = ['platform_ufo_enable_interactions_vc'];
	test.use({
		examplePage: 'interactions-simple-button',
		featureFlags: requiredFeatureFlags,
	});
	test('get interactions vc', async ({ page, waitForReactUFOInteractionPayload }) => {
		const mainDiv = page.locator('[id="app-main"]');
		await expect(mainDiv).toBeVisible();

		await page.getByText('new interaction button').click();

		const reactUFOPayload = await waitForReactUFOInteractionPayload();

		expect(reactUFOPayload).toBeDefined();

		// TODO assert actual value
		expect(reactUFOPayload!.attributes.properties.interactionMetrics.type).toBe('press');
		expect(reactUFOPayload!.attributes.properties['metric:vc90']).toBeDefined();
		expect(reactUFOPayload!.attributes.properties['ufo:vc:rev']).toBeDefined();
		expect(reactUFOPayload!.attributes.properties['ufo:vc:ratios']).toBeDefined();
	});
});
