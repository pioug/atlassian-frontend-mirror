/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

const exampleName = 'testing-arrow-navigation';

test.describe('useArrowNavigation — Basic menu', () => {
	test.describe('ArrowDown navigation', () => {
		test('ArrowDown moves focus to the next item', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			const trigger = page.getByTestId('basic-trigger');
			await trigger.click();

			const item1 = page.getByTestId('basic-item-1');
			await item1.focus();

			await page.keyboard.press('ArrowDown');
			await expect(page.getByTestId('basic-item-2')).toBeFocused();
		});

		test('ArrowDown moves through multiple items sequentially', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('basic-trigger').click();
			await page.getByTestId('basic-item-1').focus();

			await page.keyboard.press('ArrowDown');
			await expect(page.getByTestId('basic-item-2')).toBeFocused();

			await page.keyboard.press('ArrowDown');
			await expect(page.getByTestId('basic-item-3')).toBeFocused();

			await page.keyboard.press('ArrowDown');
			await expect(page.getByTestId('basic-item-4')).toBeFocused();
		});

		test('ArrowDown wraps from last item to first item', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('basic-trigger').click();
			await page.getByTestId('basic-item-4').focus();

			await page.keyboard.press('ArrowDown');
			await expect(page.getByTestId('basic-item-1')).toBeFocused();
		});

		test('ArrowDown prevents default page scroll', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('basic-trigger').click();
			await page.getByTestId('basic-item-1').focus();

			const scrollBefore = await page.evaluate(() => window.scrollY);
			await page.keyboard.press('ArrowDown');
			const scrollAfter = await page.evaluate(() => window.scrollY);

			expect(scrollBefore).toBe(scrollAfter);
		});
	});

	test.describe('ArrowUp navigation', () => {
		test('ArrowUp moves focus to the previous item', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('basic-trigger').click();
			await page.getByTestId('basic-item-3').focus();

			await page.keyboard.press('ArrowUp');
			await expect(page.getByTestId('basic-item-2')).toBeFocused();
		});

		test('ArrowUp wraps from first item to last item', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('basic-trigger').click();
			await page.getByTestId('basic-item-1').focus();

			await page.keyboard.press('ArrowUp');
			await expect(page.getByTestId('basic-item-4')).toBeFocused();
		});
	});

	test.describe('Home and End keys', () => {
		test('Home moves focus to the first item', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('basic-trigger').click();
			await page.getByTestId('basic-item-3').focus();

			await page.keyboard.press('Home');
			await expect(page.getByTestId('basic-item-1')).toBeFocused();
		});

		test('Home on first item stays on first item', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('basic-trigger').click();
			await page.getByTestId('basic-item-1').focus();

			await page.keyboard.press('Home');
			await expect(page.getByTestId('basic-item-1')).toBeFocused();
		});

		test('End moves focus to the last item', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('basic-trigger').click();
			await page.getByTestId('basic-item-1').focus();

			await page.keyboard.press('End');
			await expect(page.getByTestId('basic-item-4')).toBeFocused();
		});

		test('End on last item stays on last item', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('basic-trigger').click();
			await page.getByTestId('basic-item-4').focus();

			await page.keyboard.press('End');
			await expect(page.getByTestId('basic-item-4')).toBeFocused();
		});
	});

	test.describe('Tab to close', () => {
		test('Tab closes the menu', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('basic-trigger').click();
			await page.getByTestId('basic-item-1').focus();

			await page.keyboard.press('Tab');
			await expect(page.getByTestId('basic-menu')).toBeHidden();
		});

		test('Shift+Tab also closes the menu', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('basic-trigger').click();
			await page.getByTestId('basic-item-1').focus();

			await page.keyboard.press('Shift+Tab');
			// Both Tab and Shift+Tab close the menu (WAI-ARIA menu pattern).
			await expect(page.getByTestId('basic-menu')).toBeHidden();
		});
	});

	test.describe('isEnabled', () => {
		test('no keyboard navigation when menu is closed (isEnabled=false)', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			const trigger = page.getByTestId('basic-trigger');
			await trigger.focus();

			// Menu is closed — ArrowDown should not be intercepted
			await page.keyboard.press('ArrowDown');

			// Menu should still be closed (trigger handles its own opening)
			await expect(page.getByTestId('basic-menu')).toBeHidden();
		});
	});
});

test.describe('useArrowNavigation — Nested menu with filter', () => {
	test.describe('Parent menu navigation stays scoped', () => {
		test('ArrowDown in parent does not enter nested sub-menu items', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('nested-trigger').click();

			// Open sub-menu
			await page.getByTestId('nested-item-2').click();
			await expect(page.getByTestId('nested-submenu')).toBeVisible();

			// Focus parent item 1
			await page.getByTestId('nested-item-1').focus();

			// ArrowDown should go to parent item 2 (skipping sub-menu items)
			await page.keyboard.press('ArrowDown');
			await expect(page.getByTestId('nested-item-2')).toBeFocused();

			// ArrowDown again should go to parent item 3 (skipping sub-menu items)
			await page.keyboard.press('ArrowDown');
			await expect(page.getByTestId('nested-item-3')).toBeFocused();
		});

		test('ArrowUp in parent does not enter nested sub-menu items', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('nested-trigger').click();

			// Open sub-menu
			await page.getByTestId('nested-item-2').click();
			await expect(page.getByTestId('nested-submenu')).toBeVisible();

			// Focus parent item 3
			await page.getByTestId('nested-item-3').focus();

			// ArrowUp should go to parent item 2 (skipping sub-menu items)
			await page.keyboard.press('ArrowUp');
			await expect(page.getByTestId('nested-item-2')).toBeFocused();

			// ArrowUp again should go to parent item 1 (skipping sub-menu items)
			await page.keyboard.press('ArrowUp');
			await expect(page.getByTestId('nested-item-1')).toBeFocused();
		});

		test('Home/End in parent are scoped to parent items', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('nested-trigger').click();
			await page.getByTestId('nested-item-2').click();
			await expect(page.getByTestId('nested-submenu')).toBeVisible();

			// Focus parent item 2
			await page.getByTestId('nested-item-2').focus();

			// End should go to parent item 3 (not sub-item-2)
			await page.keyboard.press('End');
			await expect(page.getByTestId('nested-item-3')).toBeFocused();

			// Home should go to parent item 1 (not sub-item-1)
			await page.keyboard.press('Home');
			await expect(page.getByTestId('nested-item-1')).toBeFocused();
		});
	});

	test.describe('Sub-menu navigation is independent', () => {
		test('ArrowDown in sub-menu navigates within sub-menu', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('nested-trigger').click();
			await page.getByTestId('nested-item-2').click();
			await expect(page.getByTestId('nested-submenu')).toBeVisible();

			await page.getByTestId('sub-item-1').focus();

			await page.keyboard.press('ArrowDown');
			await expect(page.getByTestId('sub-item-2')).toBeFocused();
		});

		test('ArrowDown wraps within sub-menu', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('nested-trigger').click();
			await page.getByTestId('nested-item-2').click();

			await page.getByTestId('sub-item-2').focus();

			await page.keyboard.press('ArrowDown');
			await expect(page.getByTestId('sub-item-1')).toBeFocused();
		});

		test('Tab in sub-menu closes only the sub-menu', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('nested-trigger').click();
			await page.getByTestId('nested-item-2').click();

			await page.getByTestId('sub-item-1').focus();

			await page.keyboard.press('Tab');
			// Sub-menu should close
			await expect(page.getByTestId('nested-submenu')).toBeHidden();
			// Parent menu should remain open
			await expect(page.getByTestId('nested-menu')).toBeVisible();
		});
	});

	test.describe('Guard prevents parent from handling nested events', () => {
		test('parent handler does not move focus when sub-menu item is focused', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
				'design-system',
				'top-layer',
				exampleName,
			);

			await page.getByTestId('nested-trigger').click();
			await page.getByTestId('nested-item-2').click();

			// Focus sub-item-1
			await page.getByTestId('sub-item-1').focus();

			// ArrowDown should move to sub-item-2, NOT parent-item-3
			await page.keyboard.press('ArrowDown');
			await expect(page.getByTestId('sub-item-2')).toBeFocused();
		});
	});
});

test.describe('useArrowNavigation — Mixed element types', () => {
	test('navigates through buttons', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
			'design-system',
			'top-layer',
			exampleName,
		);

		await page.getByTestId('mixed-trigger').click();
		await page.getByTestId('mixed-item-1').focus();

		// ArrowDown: moves to next item
		await page.keyboard.press('ArrowDown');
		await expect(page.getByTestId('mixed-item-2')).toBeFocused();
	});

	test('skips disabled items', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
			'design-system',
			'top-layer',
			exampleName,
		);

		await page.getByTestId('mixed-trigger').click();
		await page.getByTestId('mixed-item-2').focus();

		// ArrowDown should skip the disabled item and go to mixed-item-3
		await page.keyboard.press('ArrowDown');
		await expect(page.getByTestId('mixed-item-3')).toBeFocused();
	});

	test('wraps correctly with disabled items present', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
			'design-system',
			'top-layer',
			exampleName,
		);

		await page.getByTestId('mixed-trigger').click();
		await page.getByTestId('mixed-item-3').focus();

		// ArrowDown from last enabled item should wrap to first
		await page.keyboard.press('ArrowDown');
		await expect(page.getByTestId('mixed-item-1')).toBeFocused();
	});

	test('Home skips disabled items', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
			'design-system',
			'top-layer',
			exampleName,
		);

		await page.getByTestId('mixed-trigger').click();
		await page.getByTestId('mixed-item-3').focus();

		await page.keyboard.press('Home');
		await expect(page.getByTestId('mixed-item-1')).toBeFocused();
	});

	test('End skips disabled items', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
			'design-system',
			'top-layer',
			exampleName,
		);

		await page.getByTestId('mixed-trigger').click();
		await page.getByTestId('mixed-item-1').focus();

		// End should go to the last enabled item (mixed-item-3), skipping disabled
		await page.keyboard.press('End');
		await expect(page.getByTestId('mixed-item-3')).toBeFocused();
	});
});

test.describe('useArrowNavigation — Unhandled keys pass through', () => {
	test('letter keys are not intercepted', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
			'design-system',
			'top-layer',
			exampleName,
		);

		await page.getByTestId('basic-trigger').click();
		await page.getByTestId('basic-item-1').focus();

		// Pressing a letter key should not move focus
		await page.keyboard.press('a');
		await expect(page.getByTestId('basic-item-1')).toBeFocused();
	});

	test('Escape is not intercepted', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/140-testing-arrow-navigation.tsx')>(
			'design-system',
			'top-layer',
			exampleName,
		);

		await page.getByTestId('basic-trigger').click();
		await page.getByTestId('basic-item-1').focus();

		// Escape is not handled by useArrowNavigation
		await page.keyboard.press('Escape');

		// Focus should still be on item 1 (useArrowNavigation doesn't handle Escape)
		// The menu may still be visible since only Tab triggers onClose
		await expect(page.getByTestId('basic-item-1')).toBeFocused();
	});
});
