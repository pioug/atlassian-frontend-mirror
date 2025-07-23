/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('ReactUFO: Interactions Unknown Element name', () => {
	const requiredFeatureFlags = ['platform_ufo_enable_events_observer'];
	test.use({
		examplePage: 'interactions-simple-button',
		featureFlags: requiredFeatureFlags,
	});
	test('get interactions unknownElementName', async ({
		page,
		waitForReactUFOInteractionPayload,
	}) => {
		const mainDiv = page.locator('[id="app-main"]');
		await expect(mainDiv).toBeVisible();

		await page.getByText('unknown interaction button').click();

		const reactUFOPayload = await waitForReactUFOInteractionPayload();

		expect(reactUFOPayload).toBeDefined();

		expect(reactUFOPayload!.attributes.properties.interactionMetrics.unknownElementName).toBe(
			'button#test-button2 > span',
		);
		expect(reactUFOPayload!.attributes.properties.interactionMetrics.unknownElementHierarchy).toBe(
			'UFOSegment[name=buttons-container] > Button > Button > Content',
		);
	});
});
