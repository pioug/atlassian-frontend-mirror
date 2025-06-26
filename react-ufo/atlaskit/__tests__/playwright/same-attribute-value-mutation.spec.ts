/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: Revisions - replacement node', () => {
	test.use({
		examplePage: 'same-attribute-value-mutation',
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test(`VC90 should match when the [content-div] is first visible`, async ({
				page,
				waitForReactUFOPayload,
				getSectionVisibleAt,
				getSectionDOMAddedAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const contentDiv = page.locator('[data-testid="content-div"]');

				await expect(mainDiv).toBeVisible();
				await expect(contentDiv).toBeVisible();

				const contentDivAddedAt = await getSectionDOMAddedAt('content-div');
				const contentDivVisibleAt = await getSectionVisibleAt('content-div');

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const ufoRevisions = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				expect(ufoRevisions).toBeDefined();

				// const applicableRevisions = ufoRevisions?.filter((rev) => rev['revision'] >= 'fy25.02');
				for (const rev of ufoRevisions!) {
					const revisionName = rev['revision'];

					await test.step(`checking revision ${revisionName}`, () => {
						const vc90Result = rev['metric:vc90'];
						expect(vc90Result).toBeDefined();

						expect(vc90Result).toMatchTimestamp(
							revisionName <= 'fy25.02' ? contentDivAddedAt : contentDivVisibleAt,
						);
					});
				}
			});

			test('should capture and report a11y violations', async ({
				page,
				waitForReactUFOPayload,
				getSectionVisibleAt,
				getSectionDOMAddedAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				await expect(mainDiv).toBeVisible();

				await expect(page).toBeAccessible();
			});
		});
	}
});
