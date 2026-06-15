import { expect, test } from '@af/integration-testing';

/**
 * Avatar group: focus contract on the top-layer code path.
 *
 * `AvatarGroup` renders a "more" trigger that opens a `role="menu"` popover
 * listing avatars beyond `maxCount`. The focus contract is:
 *
 * 1. Initial focus moves to the first item in the avatar list on open.
 * 2. Escape closes the popover and restores focus to the more trigger.
 * 3. ArrowDown moves focus between items within the menu.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('Avatar group: top-layer focus contract', () => {
	test('initial focus: focus moves to the first overflow item on open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'avatar-group',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const moreTrigger = page.getByTestId('avatar-group--overflow-menu--trigger');
		await moreTrigger.click();

		const menu = page.getByRole('menu');
		await expect(menu).toBeVisible();
		// avatar-group computes `maxAvatar = total > max ? max - 1 : max` and
		// emits overflow items with testId `${testId}--avatar-group-item-${index + maxAvatar}`.
		// With `data.length=6` and `maxCount=3`, `maxAvatar=2`, so the first
		// overflow item is at index 2.
		const firstItem = page.getByTestId('avatar-group--avatar-group-item-2');
		await expect(firstItem).toBeFocused();
	});

	test('focus restoration: Escape restores focus to the more trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'avatar-group',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const moreTrigger = page.getByTestId('avatar-group--overflow-menu--trigger');
		await moreTrigger.focus();
		await page.keyboard.press('ArrowDown');
		await expect(page.getByRole('menu')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(moreTrigger).toBeFocused();
	});

	test('focus movement: ArrowDown moves focus between items within the menu', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'avatar-group',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const moreTrigger = page.getByTestId('avatar-group--overflow-menu--trigger');
		await moreTrigger.focus();
		await page.keyboard.press('ArrowDown');

		const menu = page.getByRole('menu');
		await expect(menu).toBeVisible();

		const items = menu.getByRole('menuitem');
		await expect(items.first()).toBeFocused();

		await page.keyboard.press('ArrowDown');
		await expect(items.nth(1)).toBeFocused();
	});
});
