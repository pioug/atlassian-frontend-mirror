import { expect, test } from '@af/integration-testing';

test.describe('theming', () => {
	test('single top navigation produces sufficient color contrast', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/top-navigation-theming-single.vr.ap.tsx')
		>('design-system', 'navigation-system', 'top-navigation-theming-single');

		await expect(page).toBeAccessible();
	});
});
