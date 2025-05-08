/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('ReactUFO: Full precision - Full Vertical Pixel Page', () => {
	test.use({
		examplePage: 'full-vertical-pixel-page',
		featureFlags: ['platform_ufo_canvas_heatmap_full_precision'],
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test(`all revisions VC90 should matches when the 90th pixel section was visible`, async ({
				page,
				waitForReactUFOPayload,
				getSectionVisibleAt,
			}) => {
				await test.slow();
				const mainDiv = page.locator('[data-testid="main"]');
				await expect(mainDiv).toBeVisible();

				const [p10, p25, p50, p75, p90, p95] = [
					Math.ceil(viewport.width * 0.1),
					Math.ceil(viewport.width * 0.25),
					Math.ceil(viewport.width * 0.5),
					Math.ceil(viewport.width * 0.75),
					Math.ceil(viewport.width * 0.9),
					Math.ceil(viewport.width * 0.95),
				];

				const sectionP10 = page.locator(`[data-testid="sectionVertical${p10}"]`);
				const sectionP25 = page.locator(`[data-testid="sectionVertical${p25}"]`);
				const sectionP50 = page.locator(`[data-testid="sectionVertical${p50}"]`);
				const sectionP75 = page.locator(`[data-testid="sectionVertical${p75}"]`);
				const sectionP90 = page.locator(`[data-testid="sectionVertical${p90}"]`);
				const sectionP95 = page.locator(`[data-testid="sectionVertical${p95}"]`);

				await expect(sectionP10).toBeVisible();
				await expect(sectionP25).toBeVisible();
				await expect(sectionP50).toBeVisible();
				await expect(sectionP75).toBeVisible({ timeout: 10000 });
				await expect(sectionP90).toBeVisible({ timeout: 15000 });
				await expect(sectionP95).toBeVisible({ timeout: 20000 });

				const sectionTestid = `sectionVertical${p90}`;
				const p90VisibleAt = await getSectionVisibleAt(sectionTestid);
				expect(p90VisibleAt).toBeDefined();

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
						expect(vc90Result).toMatchTimestamp(p90VisibleAt);
					});
				}
			});
		});
	}
});

test.describe('ReactUFO: Scaled (with margin error)- Full Vertical Pixel Page', () => {
	test.use({
		examplePage: 'full-vertical-pixel-page',
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test(`all revisions VC90 should matches when the 90th pixel section was visible`, async ({
				page,
				waitForReactUFOPayload,
				getSectionVisibleAt,
			}) => {
				await test.slow();
				const mainDiv = page.locator('[data-testid="main"]');
				await expect(mainDiv).toBeVisible();

				const [p10, p25, p50, p75, p89, p90, p91, p95] = [
					Math.ceil(viewport.width * 0.1),
					Math.ceil(viewport.width * 0.25),
					Math.ceil(viewport.width * 0.5),
					Math.ceil(viewport.width * 0.75),
					Math.ceil(viewport.width * 0.89),
					Math.ceil(viewport.width * 0.9),
					Math.ceil(viewport.width * 0.91),
					Math.ceil(viewport.width * 0.95),
				];

				const sectionP10 = page.locator(`[data-testid="sectionVertical${p10}"]`);
				const sectionP25 = page.locator(`[data-testid="sectionVertical${p25}"]`);
				const sectionP50 = page.locator(`[data-testid="sectionVertical${p50}"]`);
				const sectionP75 = page.locator(`[data-testid="sectionVertical${p75}"]`);
				const sectionP90 = page.locator(`[data-testid="sectionVertical${p90}"]`);
				const sectionP95 = page.locator(`[data-testid="sectionVertical${p95}"]`);

				await expect(sectionP10).toBeVisible();
				await expect(sectionP25).toBeVisible();
				await expect(sectionP50).toBeVisible();
				await expect(sectionP75).toBeVisible({ timeout: 10000 });
				await expect(sectionP90).toBeVisible({ timeout: 15000 });
				await expect(sectionP95).toBeVisible({ timeout: 20000 });

				const p89VisibleAt = await getSectionVisibleAt(`sectionVertical${p89}`);
				expect(p89VisibleAt).toBeDefined();

				const p91VisibleAt = await getSectionVisibleAt(`sectionVertical${p91}`);
				expect(p91VisibleAt).toBeDefined();

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
						expect(vc90Result).toBeGreaterThanOrEqual(p89VisibleAt!);
						expect(vc90Result).toBeLessThanOrEqual(p91VisibleAt!);
					});
				}
			});
		});
	}
});
