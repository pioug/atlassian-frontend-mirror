/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('ReactUFO: data-vc-ignore-if-no-layout-shift true', () => {
	test.use({
		examplePage: 'vc-no-layout-shift',
		featureFlags: ['platform_vc_ignore_no_ls_mutation_marker'],
	});

	test(`VC90 should match when the [main-div] is first visible`, async ({
		page,
		waitForReactUFOPayload,
		getSectionVisibleAt,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		const finalDiv = page.locator('[data-testid="section-to-replace-final"]');

		await expect(mainDiv).toBeVisible();
		await expect(finalDiv).toBeVisible();

		const reactUFOPayload = await waitForReactUFOPayload();

		const mainVisibleAt = await getSectionVisibleAt('main');

		expect(reactUFOPayload).toBeDefined();

		const ufoRevisions = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
		expect(ufoRevisions).toBeDefined();
		expect(ufoRevisions.length).toBeGreaterThan(1);

		for (const rev of ufoRevisions!) {
			const revisionName = rev['revision'];

			// eslint-disable-next-line playwright/no-conditional-in-test -- ignore old revisions
			if (revisionName <= 'fy25.02') {
				continue;
			}

			await test.step(`checking revision ${revisionName}`, () => {
				const vc90Result = rev['metric:vc90'];
				expect(vc90Result).toBeDefined();

				expect(vc90Result).toMatchTimestamp(mainVisibleAt);
			});
		}
	});
});

test.describe('ReactUFO: data-vc-ignore-if-no-layout-shift false', () => {
	test.use({
		examplePage: 'vc-no-layout-shift_false',
		featureFlags: ['platform_vc_ignore_no_ls_mutation_marker'],
	});

	test(`VC90 should match when the [final-div] is first visible`, async ({
		page,
		waitForReactUFOPayload,
		getSectionVisibleAt,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		const finalDiv = page.locator('[data-testid="section-to-replace-final"]');

		await expect(mainDiv).toBeVisible();
		await expect(finalDiv).toBeVisible();

		const reactUFOPayload = await waitForReactUFOPayload();

		const finalDivVisibleAt = await getSectionVisibleAt('section-to-replace-final');

		expect(reactUFOPayload).toBeDefined();

		const ufoRevisions = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
		expect(ufoRevisions).toBeDefined();
		expect(ufoRevisions.length).toBeGreaterThan(1);

		for (const rev of ufoRevisions!) {
			const revisionName = rev['revision'];

			// eslint-disable-next-line playwright/no-conditional-in-test -- ignore old revisions
			if (revisionName <= 'fy25.02') {
				continue;
			}

			await test.step(`checking revision ${revisionName}`, () => {
				const vc90Result = rev['metric:vc90'];
				expect(vc90Result).toBeDefined();

				expect(vc90Result).toMatchTimestamp(finalDivVisibleAt);
			});
		}
	});
});
