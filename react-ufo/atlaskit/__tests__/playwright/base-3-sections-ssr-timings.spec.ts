/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: SSR Timings', () => {
	const requiredFeatureFlags = ['ufo_payload_use_idle_callback', 'platform_ufo_ssr_size_field'];
	const featureFlagsCombos = [[...requiredFeatureFlags]];
	for (const featureFlags of featureFlagsCombos) {
		test.describe(`with feature flags ${featureFlags.join(', ')}`, () => {
			test.use({
				examplePage: 'basic-ssr-timing-sections',
				featureFlags,
			});

			for (const viewport of viewports) {
				test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
					test.use({
						viewport,
					});

					test('ssrTimings should be present in the UFO payload', async ({
						page,
						waitForReactUFOPayload,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const sections = page.locator('[data-testid="main"] > div');

						await expect(mainDiv).toBeVisible();
						await expect(sections.nth(2)).toBeVisible();

						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
						const ufoProperties = reactUFOPayload!.attributes.properties;

						expect(typeof ufoProperties.interactionMetrics).toBe('object');
						const { interactionMetrics } = ufoProperties;

						expect(interactionMetrics.SSRTimings).toMatchObject([
							{
								label: 'ssr/test-timing-1',
								data: {
									startTime: 0,
									duration: 100,
									size: 50,
								},
							},
							{
								label: 'ssr/test-timing-2',
								data: {
									startTime: 0,
									duration: 200,
								},
							},
						]);
					});

					test('should capture and report a11y violations', async ({
						page,
						waitForReactUFOPayload,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const sections = page.locator('[data-testid="main"] > div');
						await expect(mainDiv).toBeVisible();
						await expect(sections.nth(2)).toBeVisible();
						await expect(page).toBeAccessible();
					});
				});
			}
		});
	}
});
