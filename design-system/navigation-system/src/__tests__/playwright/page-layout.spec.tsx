import { expect, test } from '@af/integration-testing';

test.describe('page layout', () => {
	test('should use slots for scroll', async ({ page }) => {
		await page.visitExample(
			'design-system',
			'navigation-system',
			'page-layout-all-slots-scrollable',
		);

		const main = page.getByTestId('main');
		const aside = page.getByTestId('aside');
		// Aside's scroll container is a child rather than the slot itself
		const asideInner = page.getByTestId('aside--inner');

		// Main is a scroll container
		await expect(main).toHaveCSS('overflow-y', 'auto');

		// Aside's scroll container is a child rather than the slot itself
		await expect(aside).not.toHaveCSS('overflow-y', 'auto');
		await expect(asideInner).toHaveCSS('overflow-y', 'auto');
	});
});
