/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */

import { expect, test } from './fixtures';

test.describe('ReactUFO: Interactions VC', () => {
	test.use({
		examplePage: 'interactions-simple-button',
	} satisfies {
		examplePage: 'interactions-simple-button';
		__exampleDependency?: typeof import('../../examples/23-interactions-simple-button.tsx');
	});

	for (const enabled of [false, true]) {
		test.describe(`press custom data gate ${enabled ? 'on' : 'off'}`, () => {
			test.use({ featureFlags: enabled ? ['platform_ufo_press_custom_data'] : [] });

			test('reports VC and attaches metadata only when enabled', async ({
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
				expect(reactUFOPayload!.attributes.properties['metric:vc90']).toBeDefined();
				expect(reactUFOPayload!.attributes.properties['ufo:vc:rev']).toBeDefined();
				expect(reactUFOPayload!.attributes.properties['ufo:vc:ratios']).toBeDefined();

				const { customData } = reactUFOPayload!.attributes.properties.interactionMetrics;
				const sourceData = customData.filter(({ data }) => data.source === 'example-button');
				expect(sourceData).toEqual(
					enabled ? [{ labelStack: [], data: { source: 'example-button' } }] : [],
				);
			});
		});
	}

	test('should capture and report a11y violations', async ({
		page,
		waitForReactUFOInteractionPayload,
	}) => {
		const mainDiv = page.locator('[id="app-main"]');
		await expect(mainDiv).toBeVisible();

		await expect(page).toBeAccessible();
	});
});
