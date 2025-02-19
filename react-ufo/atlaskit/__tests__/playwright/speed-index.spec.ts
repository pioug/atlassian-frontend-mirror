/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect, test } from './fixtures';

test.describe('speed index', () => {
	test.describe('ff-enabled', () => {
		test.use({
			examplePage: 'basic',
			featureFlags: ['ufo-calc-speed-index'],
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
	});

	test.describe('ff-disabled', () => {
		test.use({
			examplePage: 'basic',
			featureFlags: [],
		});

		test('no speed index', async ({ page, waitForReactUFOPayload }) => {
			const mainDiv = page.locator('[data-testid="main"]');
			const sections = page.locator('[data-testid="main"] > div');

			await expect(mainDiv).toBeVisible();
			await expect(sections.nth(9)).toBeVisible();

			const reactUFOPayload = await waitForReactUFOPayload();

			expect(reactUFOPayload).toBeDefined();

			expect(reactUFOPayload!.attributes.properties['ufo:speedIndex']).toBeUndefined();
			expect(reactUFOPayload!.attributes.properties['ufo:next:speedIndex']).toBeUndefined();
		});
	});
});
