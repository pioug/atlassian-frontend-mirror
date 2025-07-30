/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('ReactUFO: RLL hydration simulation', () => {
	test.use({
		examplePage: 'rll-simulation',
		featureFlags: [
			'platform_ufo_rll_placeholder_ignore',
		],
	});

	test(`VC90 should match when the [content-div] is first visible`, async ({
		page,
		waitForReactUFOPayload,
		getSectionVisibleAt,
		getSectionDOMAddedAt,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		const finalDiv = page.locator('[data-testid="section-to-replace-final"]');

		await expect(mainDiv).toBeVisible();
		await expect(finalDiv).toBeVisible();

		const reactUFOPayload = await waitForReactUFOPayload();

		const mainAddedAt = await getSectionDOMAddedAt('main');
		const mainVisibleAt = await getSectionVisibleAt('main');

		expect(reactUFOPayload).toBeDefined();

		const ufoRevisions = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
		expect(ufoRevisions).toBeDefined();
		expect(ufoRevisions.length).toBeGreaterThan(1);

		for (const rev of ufoRevisions!) {
			const revisionName = rev['revision'];

			await test.step(`checking revision ${revisionName}`, () => {
				const vc90Result = rev['metric:vc90'];
				expect(vc90Result).toBeDefined();

				expect(vc90Result).toMatchTimestamp(
					revisionName <= 'fy25.02' ? mainAddedAt : mainVisibleAt,
				);
			});
		}
	});
});
