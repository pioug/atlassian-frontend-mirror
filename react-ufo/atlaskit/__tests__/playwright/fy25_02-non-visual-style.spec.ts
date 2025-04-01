/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: fy25.02 - non visual style mutation', () => {
	const featureFlagsSetups = [[], ['platform_ufo_vc_observer_new']];
	for (const featureFlags of featureFlagsSetups) {
		test.describe(`with feature flags: ${featureFlags.length > 0 ? featureFlags.join(', ') : 'no feature flags'}`, () => {
			// TODO AFO-3612
			test.fixme(true, 'AFO-3612 will implement this');

			for (const viewport of viewports) {
				test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
					test.use({
						examplePage: 'fy25_02-non-visual-style-mutation',
						featureFlags,
						viewport,
					});

					test(`VC90 should match when the [content-div] is first visible`, async ({
						page,
						waitForReactUFOPayload,
						getSectionDOMAddedAt,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const contentDiv = page.locator('[data-testid="content-div"]');

						await expect(mainDiv).toBeVisible();
						await expect(contentDiv).toBeVisible();

						const mainDivAddedAt = await getSectionDOMAddedAt('main');

						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						const ufoRevisions = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
						expect(ufoRevisions).toBeDefined();

						const fy25_02_rev = ufoRevisions?.find((r) => r.revision === 'fy25.02');
						expect(fy25_02_rev).toBeDefined();

						const vc90Result = fy25_02_rev!['metric:vc90'];
						expect(vc90Result).toBeDefined();

						expect(vc90Result).toMatchTimeInSeconds(mainDivAddedAt);
					});
				});
			}
		});
	}
});
