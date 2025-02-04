/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('TTVC: basic react', () => {
	test.fixme(true, '[AFO-3390] - This test is not ready to run on CI yet');

	test.use({
		examplePage: 'basic',
	});

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
		//{
		//	width: 1536,
		//	height: 864,
		//},
		//{
		//	width: 2560,
		//	height: 1440,
		//},
		//{
		//	width: 1280,
		//	height: 720,
		//},
		//{
		//	width: 1728,
		//	height: 1117,
		//},
	];

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test('section nine should exist inside the ufo:vc:update', async ({
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

				const ufoVCUpdates = reactUFOPayload!.attributes.properties['ufo:vc:updates'];
				expect(ufoVCUpdates).toContainEqual(
					expect.objectContaining({
						time: expect.any(Number),
						vc: expect.any(Number),
						elements: expect.arrayContaining(['div[testid=sectionNine]']),
					}),
				);

				const sectionNineUpdate = ufoVCUpdates.find(v => v.elements.includes('div[testid=sectionNine]'));
				expect(sectionNineUpdate!.time).toMatchTimeInSeconds(sectionNineVisibleAt);
				expect(sectionNineUpdate!.vc).toEqual(90);
			});

			test('VC90 should matches when the section nine was visible', async ({
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

				const vc90Result = reactUFOPayload!.attributes.properties['metric:vc90'];
				expect(vc90Result).toBeDefined();
				expect(vc90Result).toMatchTimeInSeconds(sectionNineVisibleAt);
			});
		});
	}
});
