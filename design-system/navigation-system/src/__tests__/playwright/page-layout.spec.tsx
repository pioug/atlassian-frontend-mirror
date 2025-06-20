import { expect, test } from '@af/integration-testing';

test.describe('page layout', () => {
	test('should use body for scroll when isFixed={false} and platform_dst_nav4_disable_is_fixed_prop is off', async ({
		page,
	}) => {
		await page.visitExample(
			'design-system',
			'navigation-system',
			'page-layout-all-slots-scrollable',
		);

		const main = page.getByTestId('main');
		const aside = page.getByTestId('aside');
		const asideInner = page.getByTestId('aside--inner');

		// Main is not a scroll container, it has the default overflow of visible
		await expect(main).toHaveCSS('overflow-y', 'visible');

		// Aside has no scroll container, it has the default overflow of visible
		await expect(aside).toHaveCSS('overflow-y', 'visible');
		await expect(asideInner).toHaveCSS('overflow-y', 'visible');
	});

	test('should use slots for scroll when isFixed={false} and platform_dst_nav4_disable_is_fixed_prop is on', async ({
		page,
	}) => {
		await page.visitExample(
			'design-system',
			'navigation-system',
			'page-layout-all-slots-scrollable',
			{ featureFlag: 'platform_dst_nav4_disable_is_fixed_prop' },
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
