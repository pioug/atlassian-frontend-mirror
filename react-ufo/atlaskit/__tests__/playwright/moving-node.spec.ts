/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: Revisions - moving-node', () => {
	test.fixme(
		true,
		'The chromium fork version in our current Playwrigth does not support LayoutShift api',
	);
	test.use({
		examplePage: 'moving-node',
		featureFlags: ['platform_ufo_vc_observer_new'],
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test(`VC90 should match when the content-to-mutate suffered a layout shift`, async ({
				page,
				waitForReactUFOPayload,
				getSectionVisibleAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const contentToMutateDiv = page.locator('[data-testid="content-to-mutate"]');

				await expect(mainDiv).toBeVisible();
				await expect(contentToMutateDiv).toBeVisible();

				const mainDivVisibleAt = await getSectionVisibleAt('main');
				const contentToMutateDivVisibleAt = await getSectionVisibleAt('content-to-mutate');

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const ufoRevisions = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				expect(ufoRevisions).toBeDefined();

				const applicableRevisions = ufoRevisions?.filter((rev) => rev['revision'] >= 'fy25.03');
				for (const rev of applicableRevisions!) {
					const revisionName = rev['revision'];

					await test.step(`checking revision ${revisionName}`, () => {
						const vcDetails = rev['vcDetails'];
						const vc25 = vcDetails!['25']?.t;
						expect(vc25).toBeDefined();

						const vc90Result = rev['metric:vc90'];
						expect(vc90Result).toBeDefined();

						expect(vc25).toMatchTimestamp(mainDivVisibleAt);
						expect(vc90Result).toMatchTimestamp(contentToMutateDivVisibleAt);
					});
				}
			});
		});
	}
});
