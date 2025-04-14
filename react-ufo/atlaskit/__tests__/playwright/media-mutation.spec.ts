/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { VCObserver } from '../../src/vc/vc-observer';

import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: fy25.02 - non visual style mutation', () => {
	const featureFlagsSetups = [
		['platform_ufo_vc_fix_ignore_image_mutation', 'platform_ufo_vc_filter_ignored_items'],
		[
			'platform_ufo_vc_fix_ignore_image_mutation',
			'platform_ufo_vc_filter_ignored_items',
			'platform_ufo_vc_observer_new',
		],
	];
	for (const featureFlags of featureFlagsSetups) {
		test.describe(`with feature flags: ${featureFlags.length > 0 ? featureFlags.join(', ') : 'no feature flags'}`, () => {
			for (const viewport of viewports) {
				test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
					test.use({
						examplePage: 'media-wrapper',
						featureFlags,
						viewport,
					});

					test(`VC90 should match when the [content-div] is first visible`, async ({
						page,
						waitForReactUFOPayload,
						getSectionDOMAddedAt,
						getSectionVisibleAt,
					}) => {
						const mainDiv = page.locator('[data-testid="main"]');
						const mediaStyleMutationDiv = page.locator('[data-testid="media-style-mutation-div"]');
						const mediaDomAdditionDiv = page.locator('[data-testid="media-dom-addition-div"]');

						await expect(mainDiv).toBeVisible();
						await expect(mediaStyleMutationDiv).toBeVisible();
						await expect(mediaDomAdditionDiv).toBeVisible();

						const mainDivAddedAt = await getSectionDOMAddedAt('main');
						const mainDivVisibleAt = await getSectionVisibleAt('main');

						const reactUFOPayload = await waitForReactUFOPayload();
						expect(reactUFOPayload).toBeDefined();

						const ufoRevisions = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
						expect(ufoRevisions).toBeDefined();

						const fy25_02_rev = ufoRevisions?.find((r) => r.revision === 'fy25.02');
						expect(fy25_02_rev).toBeDefined();
						expect(fy25_02_rev!.clean).toEqual(true);

						for (const checkpoint of VCObserver.VCParts) {
							await test.step(`checking fy25_02_rev vc ${checkpoint} details`, () => {
								expect(fy25_02_rev!.vcDetails![checkpoint].t).toMatchTimeInSeconds(mainDivAddedAt);
								expect(fy25_02_rev!.vcDetails![checkpoint].e).not.toContain(
									'div[testid=media-style-mutation-div]',
								);
								expect(fy25_02_rev!.vcDetails![checkpoint].e).not.toContain(
									'div[testid=media-dom-addition-div]',
								);
							});
						}

						const vc90Result = fy25_02_rev!['metric:vc90'];
						expect(vc90Result).toBeDefined();

						expect(vc90Result).toMatchTimeInSeconds(mainDivAddedAt);

						// check future bigger revisions
						const applicableRevisions = ufoRevisions?.filter((rev) => rev['revision'] >= 'fy25.03');

						for (const rev of applicableRevisions!) {
							const vc90Result = rev['metric:vc90'];
							const revisionName = rev['revision'];
							expect(vc90Result).toBeDefined();
							expect(rev!.clean).toEqual(true);

							await test.step(`checking revision ${revisionName}`, async () => {
								expect(vc90Result).toMatchTimeInSeconds(mainDivVisibleAt);

								for (const checkpoint of VCObserver.VCParts) {
									await test.step(`checking revision ${revisionName} vc ${checkpoint} details`, () => {
										expect(rev!.vcDetails![checkpoint].t).toMatchTimeInSeconds(mainDivVisibleAt);
										expect(rev!.vcDetails![checkpoint].e).not.toContain(
											'div[testid=media-style-mutation-div]',
										);
										expect(rev!.vcDetails![checkpoint].e).not.toContain(
											'div[testid=media-dom-addition-div]',
										);
									});
								}
							});
						}
					});
				});
			}
		});
	}
});
