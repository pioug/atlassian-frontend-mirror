import type { ReactUFOPayload } from '../../src/common/react-ufo-payload-schema';

import { expect, test, viewports } from './fixtures';
import type { WindowWithReactUFOTestGlobals } from './window-type';

const requiredFeatureFlags = ['ufo_payload_use_idle_callback'];

const featureFlagsCombos = [[...requiredFeatureFlags]];

test.describe('Search Page without smart answers', () => {
	for (const featureFlags of featureFlagsCombos) {
		test.describe(`with feature flags ${featureFlags.join(', ')}`, () => {
			test.use({
				examplePage: 'search-page-without-smart-answers',
				featureFlags,
			});

			for (const viewport of viewports) {
				test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
					test.use({
						viewport,
					});

					test(`should only receive one UFO payload`, async ({ page, waitForReactUFOPayload }) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const searchResult = page.locator('[data-testid="search-result"]');

						await expect(mainDiv).toBeVisible();
						await expect(searchResult).toBeVisible();

						// Expect one UFO payload
						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						const mainDivAfterTTVCFinished = page.locator('[data-is-ttvc-ready="true"]');
						await expect(mainDivAfterTTVCFinished).toBeVisible({ timeout: 20000 });

						// This looks like bad practice, but we're not not expecting a payload from
						// the extra search page interaction. So we're just giving it some time to
						// see if it does come in.
						// eslint-disable-next-line playwright/no-wait-for-timeout
						await page.waitForTimeout(3000);

						expect(async () => {
							const value = await page.evaluate(() => {
								const payloads =
									(window as WindowWithReactUFOTestGlobals)
										.__websiteReactUfoExtraSearchPageInteraction || [];
								return payloads;
							});

							return value;
						}).toHaveLength(0);
					});
				});
			}
		});
	}
});

const getTTAIFromPayload = (payload: ReactUFOPayload) => {
	return payload.attributes.properties.interactionMetrics.end;
};

const getVC90FromPayload = (payload: ReactUFOPayload) => {
	return payload.attributes.properties['ufo:vc:rev'].find((r) => r.revision === 'fy25.03')?.[
		'metric:vc90'
	];
};

test.describe('Search Page with smart answers', () => {
	for (const featureFlags of featureFlagsCombos) {
		test.describe(`with feature flags ${featureFlags.join(', ')}`, () => {
			test.use({
				examplePage: 'search-page-with-slower-smart-answers',
				featureFlags,
			});

			for (const viewport of viewports) {
				test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
					test.use({
						viewport,
					});

					test(`should have an additional payload with faster TTAI and VC90`, async ({
						page,
						waitForReactUFOPayload,
						waitForExtraSearchPageInteractionPayload,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const searchResult = page.locator('[data-testid="search-result"]');

						await expect(mainDiv).toBeVisible();
						await expect(searchResult).toBeVisible();

						// Expect a regular UFO payload
						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						// Expect an additional payload from the extra search page interaction
						const extraInteractionPayload = await waitForExtraSearchPageInteractionPayload();
						expect(extraInteractionPayload).toBeDefined();

						const regularTTAI = getTTAIFromPayload(reactUFOPayload!);
						const regularVC90 = getVC90FromPayload(reactUFOPayload!);

						const extraTTAI = getTTAIFromPayload(extraInteractionPayload!);
						const extraVC90 = getVC90FromPayload(extraInteractionPayload!);

						expect(regularTTAI).toBeGreaterThan(extraTTAI!);
						expect(regularVC90).toBeGreaterThan(extraVC90!);
					});
				});
			}
		});
	}

	for (const featureFlags of featureFlagsCombos) {
		test.describe(`with feature flags ${featureFlags.join(', ')}`, () => {
			test.use({
				examplePage: 'search-page-with-faster-smart-answers',
				featureFlags,
			});

			for (const viewport of viewports) {
				test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
					test.use({
						viewport,
					});

					test(`should have an additional payload with slower TTAI and VC90`, async ({
						page,
						waitForReactUFOPayload,
						waitForExtraSearchPageInteractionPayload,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const searchResult = page.locator('[data-testid="search-result"]');

						await expect(mainDiv).toBeVisible();
						await expect(searchResult).toBeVisible();

						// Expect a regular UFO payload
						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						// Expect an additional payload from the extra search page interaction
						const extraInteractionPayload = await waitForExtraSearchPageInteractionPayload();
						expect(extraInteractionPayload).toBeDefined();

						const regularTTAI = getTTAIFromPayload(reactUFOPayload!);
						const regularVC90 = getVC90FromPayload(reactUFOPayload!);

						const extraTTAI = getTTAIFromPayload(extraInteractionPayload!);
						const extraVC90 = getVC90FromPayload(extraInteractionPayload!);

						expect(regularTTAI).toEqual(extraTTAI!);
						expect(regularVC90).toEqual(extraVC90!);
					});
				});
			}
		});
	}
});
