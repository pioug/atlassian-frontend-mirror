/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: Revisions - bad replacement node', () => {
	test.use({
		examplePage: 'bad-node-replacement',
		featureFlags: ['platform_ufo_vc_observer_new', 'platform_ufo_vc_ttai_on_paint'],
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test(`VC90 should match when the [section-to-replace-final] is replacing the [section-to-replace-placeholder] with a bigger div`, async ({
				page,
				waitForReactUFOPayload,
				getSectionVisibleAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const placeholderDiv = page.locator('[data-testid="section-to-replace-placeholder"]');
				const finalDiv = page.locator('[data-testid="section-to-replace-final"]');

				await expect(mainDiv).toBeVisible();
				await expect(placeholderDiv).toBeVisible();
				await expect(finalDiv).toBeVisible();

				const finalDivVisibleAt = await getSectionVisibleAt('section-to-replace-final');

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const ufoRevisions = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				expect(ufoRevisions).toBeDefined();

				for (const rev of ufoRevisions!) {
					const revisionName = rev['revision'];

					await test.step(`checking revision ${revisionName}`, () => {
						const vc90Result = rev['metric:vc90'];
						expect(vc90Result).toBeDefined();

						expect(vc90Result).toMatchTimeInSeconds(finalDivVisibleAt);
					});
				}
			});
		});
	}
});
