import { expect, test } from '@af/integration-testing';

/**
 * Avatar group: focus contract on the top-layer code path.
 *
 * `AvatarGroup` renders a "more" trigger that opens a `role="menu"` popover
 * listing avatars beyond `maxCount`. The focus contract is:
 *
 * 1. Initial focus moves to the first item in the avatar list on open.
 * 2. Escape closes the popover and restores focus to the more trigger.
 * 3. ArrowDown / ArrowUp move focus between items within the menu, wrapping
 *    around at both ends (a WAI-ARIA menu behaviour the legacy popup did not
 *    have).
 * 4. Tab and Shift+Tab dismiss the menu rather than trapping focus inside it
 *    (WAI-ARIA menu button pattern).
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

	// WCAG 2.4.3 Focus Order + WAI-ARIA APG Menu pattern
	// (https://www.w3.org/WAI/ARIA/apg/patterns/menu/).
	// The top-layer overflow menu adds arrow-key wrap-around, which the legacy
	// popup did not have (flagged as untested in the migration audit). Internally
	// `useArrowNavigation` delegates to `getNextFocusable`, which wraps at both
	// ends: ArrowUp from the first item lands on the last, and ArrowDown from the
	// last item lands back on the first.
	test('focus movement: ArrowUp and ArrowDown wrap around the ends of the menu', async ({
		page,
	}) => {
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

		const items = menu.getByRole('menuitem');
		await expect(items.first()).toBeFocused();

		// ArrowUp from the first item wraps to the last item.
		await page.keyboard.press('ArrowUp');
		await expect(items.last()).toBeFocused();

		// ArrowDown from the last item wraps back to the first item.
		await page.keyboard.press('ArrowDown');
		await expect(items.first()).toBeFocused();
	});

	// WAI-ARIA APG Menu Button pattern
	// (https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/).
	// Unlike the legacy popup, which trapped focus, the top-layer overflow menu
	// treats Tab as a dismiss gesture: `useArrowNavigation` calls `onClose` on
	// Tab in both directions, so the menu closes rather than moving focus within
	// it. Shift+Tab is symmetric.
	test('dismiss: Tab closes the overflow menu', async ({ page }) => {
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

		await page.keyboard.press('Tab');
		await expect(menu).toBeHidden();
	});

	test('dismiss: Shift+Tab closes the overflow menu', async ({ page }) => {
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

		await page.keyboard.press('Shift+Tab');
		await expect(menu).toBeHidden();
	});
});
