/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: Revisions - basic', () => {
	test.use({
		examplePage: 'basic',
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test(`all revisions VC90 should matches when the section nine was visible`, async ({
				page,
				waitForReactUFOPayload,
				getSectionVisibleAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const sections = page.locator('[data-testid="main"] > div');

				await expect(mainDiv).toBeVisible();
				await expect(sections.nth(9)).toBeVisible();

				const sectionNineVisibleAt = await getSectionVisibleAt('sectionNine');
				expect(sectionNineVisibleAt).toBeDefined();

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const ufoRevisions = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				expect(ufoRevisions).toBeDefined();

				const applicableRevisions = ufoRevisions?.filter((rev) => rev['revision'] >= 'fy25.03');
				for (const rev of applicableRevisions!) {
					const vc90Result = rev['metric:vc90'];
					const revisionName = rev['revision'];
					expect(vc90Result).toBeDefined();

					await test.step(`checking revision ${revisionName}`, () => {
						expect(vc90Result).toMatchTimestamp(sectionNineVisibleAt);
					});
				}
			});

			test('should capture and report a11y violations', async ({
				page,
				waitForReactUFOPayload,
				getSectionVisibleAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				await expect(mainDiv).toBeVisible();

				await expect(page).toBeAccessible();
			});
		});
	}
});

test.describe('ReactUFO: Revisions - nested', () => {
	test.use({
		examplePage: 'nested-elements',
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test(`all revisions VC90 should matches the section A`, async ({
				page,
				waitForReactUFOPayload,
				getSectionVisibleAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const sections = page.locator('[data-nested="true"]');

				await expect(mainDiv).toBeVisible();
				await expect(sections.nth(2)).toBeVisible();

				const sectionBVisibleAt = await getSectionVisibleAt('sectionA');
				expect(sectionBVisibleAt).toBeDefined();

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const ufoRevisions = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				expect(ufoRevisions).toBeDefined();

				const applicableRevisions = ufoRevisions?.filter((rev) => rev['revision'] >= 'fy25.03');
				for (const rev of applicableRevisions!) {
					const vc90Result = rev['metric:vc90'];
					const revisionName = rev['revision'];
					expect(vc90Result).toBeDefined();

					await test.step(`checking revision ${revisionName}`, () => {
						expect(vc90Result).toMatchTimestamp(sectionBVisibleAt);
					});
				}
			});
		});
	}
});
