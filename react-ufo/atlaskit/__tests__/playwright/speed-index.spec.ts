/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

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
