/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('TTVC: basic react', () => {
	test.use({
		examplePage: 'basic-react',
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

	for (const viewport of viewports) {
		test.describe(`when view port is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test('VC90 should matches when the section nine was visible', async ({
				page,
				getSectionVisibleAt,
				getTTVCTargets,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const sections = page.locator('[data-testid="main"] > div');
				const mainDivAfterTTVCFinished = page.locator(
					'[data-testid="main"][data-is-ttvc-ready="true"]',
				);

				await expect(mainDiv).toBeVisible();
				await expect(sections.nth(9)).toBeVisible();

				await expect(mainDivAfterTTVCFinished).toBeVisible();

				const sectionNineVisibleAt = await getSectionVisibleAt('sectionNine');

				const VCTargets = await getTTVCTargets();

				expect(VCTargets).toBeDefined();
				expect(sectionNineVisibleAt).toBeDefined();

				const vc90Result = VCTargets!['90'];
				expect(vc90Result).toMatchTimeInSeconds(sectionNineVisibleAt);
			});
		});
	}

	test('should capture and report a11y violations', async ({ page }) => {
		const mainDiv = page.locator('[data-testid="main"]');
		const sections = page.locator('[data-testid="main"] > div');

		await expect(mainDiv).toBeVisible();
		await expect(sections.nth(9)).toBeVisible();

		await expect(page).toBeAccessible();
	});
});
