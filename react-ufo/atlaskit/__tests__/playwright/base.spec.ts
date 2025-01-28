/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect } from '@af/integration-testing';

import { test } from './fixtures';

test.describe('TTVC: basic', () => {
	test.use({
		examplePage: 'basic',
	});

	test('the page loads and a VC90 value exists', async ({ page, ufoVC90 }) => {
		const mainDiv = page.locator('[data-testid="main"]');
		const sections = page.locator('[data-testid="main"] > div');
		await expect(mainDiv).toBeVisible();
		await expect(sections.nth(0)).toBeVisible();
		await expect(sections.nth(1)).toBeVisible();
		await expect(sections.nth(2)).toBeVisible();
		await expect(sections.nth(3)).toBeVisible();
		await expect(sections.nth(4)).toBeVisible();
		await expect(sections.nth(5)).toBeVisible();
		await expect(sections.nth(6)).toBeVisible();
		await expect(sections.nth(7)).toBeVisible();
		await expect(sections.nth(8)).toBeVisible();
		await expect(sections.nth(9)).toBeVisible();

		const vc90 = await ufoVC90();

		// TODO: change expectation to use actual VC90 value
		expect(vc90).toBe(9000);
	});
});
