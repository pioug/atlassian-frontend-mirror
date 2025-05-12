/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test, viewports } from './fixtures';

test.describe('TTVC: basic page (100 congruent sections)', () => {
	test.use({
		examplePage: 'basic-any-number-sections', // hardcoded to 100 in the code
		featureFlags: ['ufo_payload_use_idle_callback', 'platform_ufo_use_offscreen_canvas'],
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test('the correct sections should exist inside the ufo:vc:dom', async ({
				page,
				waitForReactUFOPayload,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				await expect(mainDiv).toBeVisible();

				const sections = page.locator('[data-testid="main"] > div');
				await expect(sections.nth(99)).toBeVisible();

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				const ttvcV2Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.02');

				expect(ttvcV2Revision).toBeTruthy();
				expect(ttvcV2Revision!.vcDetails?.['25'].e).toContainEqual('div[testid=section25]');
				expect(ttvcV2Revision!.vcDetails?.['50'].e).toContainEqual('div[testid=section50]');
				expect(ttvcV2Revision!.vcDetails?.['75'].e).toContainEqual('div[testid=section75]');
				expect(ttvcV2Revision!.vcDetails?.['80'].e).toContainEqual('div[testid=section80]');
				expect(ttvcV2Revision!.vcDetails?.['85'].e).toContainEqual('div[testid=section85]');
				expect(ttvcV2Revision!.vcDetails?.['90'].e).toContainEqual('div[testid=section90]');
				expect(ttvcV2Revision!.vcDetails?.['95'].e).toContainEqual('div[testid=section95]');
				expect(ttvcV2Revision!.vcDetails?.['98'].e).toContainEqual('div[testid=section98]');
				expect(ttvcV2Revision!.vcDetails?.['99'].e).toContainEqual('div[testid=section99]');
			});

			test('VC90 should matches when the section 90 was visible', async ({
				page,
				waitForReactUFOPayload,
				getSectionDOMAddedAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				await expect(mainDiv).toBeVisible();

				const sections = page.locator('[data-testid="main"] > div');
				await expect(sections.nth(99)).toBeVisible();

				const sectionNinetyRenderTime = await getSectionDOMAddedAt('section90');
				expect(sectionNinetyRenderTime).toBeDefined();

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				const ttvcV2Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.02');

				expect(ttvcV2Revision).toBeTruthy();
				const vc90Result = ttvcV2Revision!['metric:vc90'];
				expect(vc90Result).toBeDefined();
				expect(vc90Result).toMatchTimestamp(sectionNinetyRenderTime);
			});
		});
	}
});
