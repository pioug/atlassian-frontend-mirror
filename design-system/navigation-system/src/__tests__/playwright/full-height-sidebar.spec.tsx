import { expect, test } from '@af/integration-testing';

test.describe('full height sidebar', () => {
	test('side nav should be layered above top nav', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/side-nav-layering.tsx')>(
			'design-system',
			'navigation-system',
			'side-nav-layering',
			{
				featureFlag: 'navx-full-height-sidebar',
			},
		);

		const sideNav = page.getByTestId('side-nav');
		const topNav = page.getByTestId('top-nav');

		await expect(topNav).toHaveCSS('z-index', '3');
		await expect(sideNav).toHaveCSS('z-index', '2');
	});
});
