/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
/* eslint-disable playwright/no-conditional-in-test */
import { expect, test, viewports } from './fixtures';

test.describe('speed index', () => {
	test.use({
		examplePage: 'basic',
	});

	test('the page reports speed index', async ({ page, waitForReactUFOPayload }) => {
		const mainDiv = page.locator('[data-testid="main"]');
		const sections = page.locator('[data-testid="main"] > div');

		await expect(mainDiv).toBeVisible();
		await expect(sections.nth(9)).toBeVisible();

		const reactUFOPayload = await waitForReactUFOPayload();

		expect(reactUFOPayload).toBeDefined();

		// TODO assert actual value
		expect(reactUFOPayload!.attributes.properties['ufo:speedIndex']).toBeDefined();

		expect(reactUFOPayload!.attributes.properties['ufo:next:speedIndex']).toBeDefined();
	});

	test('should capture and report a11y violations', async ({ page }) => {
		const mainDiv = page.locator('[data-testid="main"]');
		await expect(mainDiv).toBeVisible();

		await expect(page).toBeAccessible();
	});
});

test.describe('speed index - fy26.04 revision', () => {
	test.use({
		examplePage: 'basic',
	});

	for (const viewport of viewports) {
		test.describe(`when viewport is ${viewport.width}x${viewport.height}`, () => {
			test.use({
				viewport,
			});

			test('fy26.04 revision should include speedIndex', async ({
				page,
				waitForReactUFOPayload,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const sections = page.locator('[data-testid="main"] > div');

				await expect(mainDiv).toBeVisible();
				await expect(sections.nth(9)).toBeVisible();

				const reactUFOPayload = await waitForReactUFOPayload();

				expect(reactUFOPayload).toBeDefined();

				const ufoRevisions = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				expect(ufoRevisions).toBeDefined();

				// Find the fy26.04 revision
				const fy26_04_revision = ufoRevisions?.find((rev) => rev.revision === 'fy26.04');
				expect(fy26_04_revision).toBeDefined();

				// Verify speedIndex is present and is a valid positive number
				expect(fy26_04_revision?.speedIndex).toBeDefined();
				expect(typeof fy26_04_revision?.speedIndex).toBe('number');
				expect(fy26_04_revision?.speedIndex).toBeGreaterThan(0);

				// Speed index should be less than or equal to VC90 (the time at which 90% of viewport is painted)
				const vc90 = fy26_04_revision?.['metric:vc90'];
				if (vc90 !== null && vc90 !== undefined) {
					expect(fy26_04_revision?.speedIndex).toBeLessThanOrEqual(vc90);
				}
			});

			test('speedIndex should be reasonable relative to VC percentiles', async ({
				page,
				waitForReactUFOPayload,
			}) => {
				const mainDiv = page.locator('[data-testid="main"]');
				const sections = page.locator('[data-testid="main"] > div');

				await expect(mainDiv).toBeVisible();
				await expect(sections.nth(9)).toBeVisible();

				const reactUFOPayload = await waitForReactUFOPayload();

				expect(reactUFOPayload).toBeDefined();

				const ufoRevisions = reactUFOPayload!.attributes.properties['ufo:vc:rev'];
				const fy26_04_revision = ufoRevisions?.find((rev) => rev.revision === 'fy26.04');

				expect(fy26_04_revision).toBeDefined();
				expect(fy26_04_revision?.vcDetails).toBeDefined();

				const speedIndex = fy26_04_revision?.speedIndex;
				const vc50 = fy26_04_revision?.vcDetails?.['50']?.t;
				const vc100 = fy26_04_revision?.vcDetails?.['100']?.t;

				// Speed index is typically between VC50 and VC100
				// It represents the average time at which the viewport is painted
				if (vc50 !== undefined && speedIndex !== undefined) {
					// Speed index should generally be >= VC50
					// (time at which at least 50% is painted)
					expect(speedIndex).toBeGreaterThanOrEqual(vc50 * 0.5); // Allow some tolerance
				}

				if (vc100 !== undefined && speedIndex !== undefined) {
					// Speed index should be <= VC100
					// (time at which 100% is painted)
					expect(speedIndex).toBeLessThanOrEqual(vc100);
				}
			});
		});
	}
});
