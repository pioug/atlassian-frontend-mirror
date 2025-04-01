/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

/*
 *
 * Most used viewports (ordered)
 *
 * - 1920x1080
 * - 1536x864
 * - 2560x1440
 * - 1280x720
 * - 1728x1117
 */
const viewports = [
	{
		width: 1920,
		height: 1080,
	},
	{
		width: 1536,
		height: 864,
	},
	{
		width: 2560,
		height: 1440,
	},
	{
		width: 1280,
		height: 720,
	},
	{
		width: 1728,
		height: 1117,
	},
];

test.describe('TTVC: basic page (10 congruent sections)', () => {
	test.use({
		examplePage: 'basic',
		featureFlags: ['platform_ufo_fix_vc_observer_rounding_error', 'ufo_payload_use_idle_callback'],
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test(`section nine should exist inside the ufo:vc:dom['90']`, async ({
				page,
				waitForReactUFOPayload,
				getSectionDOMAddedAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const sections = page.locator('[data-testid="main"] > div');

				await expect(mainDiv).toBeVisible();
				await expect(sections.nth(9)).toBeVisible();

				const sectionNineVisibleAt = await getSectionDOMAddedAt('sectionNine');
				expect(sectionNineVisibleAt).toBeDefined();

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				const ttvcV2Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.02');

				expect(ttvcV2Revision).toBeTruthy();
				expect(ttvcV2Revision!.vcDetails?.['90'].e).toStrictEqual(['div[testid=sectionNine]']);
				expect(ttvcV2Revision!.vcDetails?.['90'].t).toMatchTimeInSeconds(sectionNineVisibleAt);
			});

			test(`VC90 should matches when the section nine was visible`, async ({
				page,
				waitForReactUFOPayload,
				getSectionDOMAddedAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const sections = page.locator('[data-testid="main"] > div');

				await expect(mainDiv).toBeVisible();
				await expect(sections.nth(9)).toBeVisible();

				const sectionNineVisibleAt = await getSectionDOMAddedAt('sectionNine');
				expect(sectionNineVisibleAt).toBeDefined();

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const vc90Result = reactUFOPayload!.attributes.properties['metric:vc90'];
				expect(vc90Result).toBeDefined();
				expect(vc90Result).toMatchTimeInSeconds(sectionNineVisibleAt);
			});
		});
	}
});

test.describe('TTVC: basic page (3 congruent sections)', () => {
	test.use({
		examplePage: 'basic-three-sections',
		featureFlags: ['platform_ufo_fix_vc_observer_rounding_error', 'ufo_payload_use_idle_callback'],
	});

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test("section three should exist inside the ufo:vc:dom['90']", async ({
				page,
				waitForReactUFOPayload,
				getSectionDOMAddedAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const sections = page.locator('[data-testid="main"] > div');

				await expect(mainDiv).toBeVisible();
				await expect(sections.nth(2)).toBeVisible();

				const sectionThreeVisibleAt = await getSectionDOMAddedAt('sectionThree');
				expect(sectionThreeVisibleAt).toBeDefined();

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const ufoVCRev = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				const ttvcV2Revision = ufoVCRev?.find(({ revision }) => revision === 'fy25.02');

				expect(ttvcV2Revision).toBeTruthy();
				expect(ttvcV2Revision!.vcDetails?.['90'].e).toStrictEqual(['div[testid=sectionThree]']);
				expect(ttvcV2Revision!.vcDetails?.['90'].t).toMatchTimeInSeconds(sectionThreeVisibleAt);
			});

			test('VC90 should matches when the section three was visible', async ({
				page,
				waitForReactUFOPayload,
				getSectionDOMAddedAt,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const sections = page.locator('[data-testid="main"] > div');

				await expect(mainDiv).toBeVisible();
				await expect(sections.nth(2)).toBeVisible();

				const sectionThreeVisibleAt = await getSectionDOMAddedAt('sectionThree');
				expect(sectionThreeVisibleAt).toBeDefined();

				const reactUFOPayload = await waitForReactUFOPayload();
				expect(reactUFOPayload).toBeDefined();

				const vc90Result = reactUFOPayload!.attributes.properties['metric:vc90'];
				expect(vc90Result).toBeDefined();
				expect(vc90Result).toMatchTimeInSeconds(sectionThreeVisibleAt);
			});
		});
	}
});

test.describe('TTVC: basic page (100 congruent sections)', () => {
	test.use({
		examplePage: 'basic-any-number-sections', // hardcoded to 100 in the code
		featureFlags: ['platform_ufo_fix_vc_observer_rounding_error', 'ufo_payload_use_idle_callback'],
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

				const ufoVCDom = reactUFOPayload!.attributes.properties['ufo:vc:dom'];
				expect(ufoVCDom['25']).toHaveLength(1);
				expect(ufoVCDom['25']).toStrictEqual(['div[testid=section25]']);
				expect(ufoVCDom['50']).toHaveLength(1);
				expect(ufoVCDom['50']).toStrictEqual(['div[testid=section50]']);
				expect(ufoVCDom['75']).toHaveLength(1);
				expect(ufoVCDom['75']).toStrictEqual(['div[testid=section75]']);
				expect(ufoVCDom['80']).toHaveLength(1);
				expect(ufoVCDom['80']).toStrictEqual(['div[testid=section80]']);
				expect(ufoVCDom['85']).toHaveLength(1);
				expect(ufoVCDom['85']).toStrictEqual(['div[testid=section85]']);
				expect(ufoVCDom['90']).toHaveLength(1);
				expect(ufoVCDom['90']).toStrictEqual(['div[testid=section90]']);
				expect(ufoVCDom['95']).toHaveLength(1);
				expect(ufoVCDom['95']).toStrictEqual(['div[testid=section95]']);
				expect(ufoVCDom['98']).toHaveLength(1);
				expect(ufoVCDom['98']).toStrictEqual(['div[testid=section98]']);
				expect(ufoVCDom['99']).toHaveLength(1);
				expect(ufoVCDom['99']).toStrictEqual(['div[testid=section99]']);
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

				const vc90Result = reactUFOPayload!.attributes.properties['metric:vc90'];
				expect(vc90Result).toBeDefined();
				expect(vc90Result).toMatchTimeInSeconds(sectionNinetyRenderTime);
			});
		});
	}
});
