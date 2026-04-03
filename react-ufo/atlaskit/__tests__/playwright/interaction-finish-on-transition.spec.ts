/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('ReactUFO: Finish on transition', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample<typeof import('../../examples/34-finish-interaction-transition.tsx')>('react-ufo', 'atlaskit', 'finish-interaction-transition');
	});
	test('interaction is successful on transition', async ({
		page,
		waitForReactUFOInteractionPayload,
	}) => {
		const mainDiv = page.locator('[id="app-main"]');
		await expect(mainDiv).toBeVisible();

		await page.getByText('new interaction button').click();

		const reactUFOPayload = await waitForReactUFOInteractionPayload();

		expect(reactUFOPayload).toBeDefined();

		// TODO assert actual value
		expect(reactUFOPayload!.attributes.properties.interactionMetrics.type).toBe('press');
		expect(reactUFOPayload!.attributes.properties.interactionMetrics.responsiveness).toBeDefined();
		expect(reactUFOPayload!.attributes.properties.interactionMetrics.abortReason).toBeFalsy();
	});
});
