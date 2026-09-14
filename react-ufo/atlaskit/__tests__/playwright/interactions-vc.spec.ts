/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('ReactUFO: Interactions VC', () => {
	test.use({
		examplePage: 'interactions-simple-button',
	} satisfies {
		examplePage: 'interactions-simple-button';
		__exampleDependency?: typeof import('../../examples/23-interactions-simple-button.tsx');
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

	test('should capture and report a11y violations', async ({
		page,
		waitForReactUFOInteractionPayload,
	}) => {
		const mainDiv = page.locator('[id="app-main"]');
		await expect(mainDiv).toBeVisible();

		await expect(page).toBeAccessible();
	});
});
