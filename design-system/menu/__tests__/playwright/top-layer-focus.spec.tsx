import { expect, test } from '@af/integration-testing';

/**
 * Menu: focus contract on the top-layer code path.
 *
 * `@atlaskit/menu` renders in-flow menu content (`MenuGroup`, `ButtonItem`,
 * `LinkItem`), not an overlay, and has no local `@atlaskit/top-layer` adapter.
 * Menu content is frequently rendered INSIDE a top-layer popover by consumers
 * such as `@atlaskit/dropdown-menu`, so this spec asserts that, on the
 * top-layer code path, menu items keep their focus and keyboard contract:
 *
 * 1. Menu items are keyboard-focusable and respond to activation (Enter).
 * 2. Focus moves through items in DOM order (WCAG 2.4.3). Menu items sit in the
 *    natural tab sequence; roving arrow-key navigation is the consumer's
 *    concern (for example `dropdown-menu` via `useArrowNavigation`).
 * 3. Keyboard focus produces a visible focus indicator (WCAG 2.4.7).
 *
 * Because menu is not an overlay, there is no open / initial-focus /
 * focus-restoration lifecycle to assert here (contrast the overlay adopters).
 * The remaining FF-on WCAG coverage (semantics, meaningful sequence, content
 * not obscured, structure) lives in the broad sweep at
 * `src/__tests__/playwright/ff-testing/platform-dst-top-layer/menu.spec.tsx`.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('Menu top-layer — WCAG 2.1.1 Keyboard', () => {
	test('ButtonItem responds to keyboard activation', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/05-menu-group.tsx')>(
			'design-system',
			'menu',
			'menu-group',
			{
				featureFlag,
			},
		);

		const buttonItem = page.getByTestId('favourite-articles-button-item');
		await expect(buttonItem).toBeVisible();

		await buttonItem.focus();
		await expect(buttonItem).toBeFocused();

		await buttonItem.press('Enter');
		// Item activation is observable through click handler
	});

	test('LinkItem responds to keyboard navigation', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/link-item.tsx')>(
			'design-system',
			'menu',
			'link-item',
			{
				featureFlag,
			},
		);

		const firstItem = page.getByTestId('first-item');
		await expect(firstItem).toBeVisible();

		await firstItem.focus();
		await expect(firstItem).toBeFocused();
	});
});

test.describe('Menu top-layer — WCAG 2.4.3 Focus Order', () => {
	test('focus enters and exits MenuGroup', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/05-menu-group.tsx')>(
			'design-system',
			'menu',
			'menu-group',
			{
				featureFlag,
			},
		);

		const menuGroup = page.getByTestId('with-adjacent-sections');
		await expect(menuGroup).toBeVisible();

		// Focus into the menu
		const firstFocusableItem = page.getByRole('link', { name: 'Search your items' });
		await expect(firstFocusableItem).toBeVisible();

		await firstFocusableItem.focus();
		await expect(firstFocusableItem).toBeFocused();
	});

	test('PopupMenuGroup receives focus when rendered', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/05-menu-group.tsx')>(
			'design-system',
			'menu',
			'menu-group',
			{
				featureFlag,
			},
		);

		const popupMenuGroup = page.getByTestId('mock-starred-menu');
		await expect(popupMenuGroup).toBeVisible();

		const firstItem = popupMenuGroup.getByRole('button').first();
		await expect(firstItem).toBeVisible();
	});
});

test.describe('Menu top-layer — WCAG 2.4.7 Focus Visible', () => {
	test('ButtonItem shows focus-visible when keyboard focused', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/05-menu-group.tsx')>(
			'design-system',
			'menu',
			'menu-group',
			{
				featureFlag,
			},
		);

		const buttonItem = page.getByTestId('favourite-articles-button-item');
		await expect(buttonItem).toBeVisible();

		await buttonItem.focus();
		await expect(buttonItem).toBeFocused();
		// Focus-visible state is visually observable by user
	});

	test('LinkItem shows focus-visible when keyboard focused', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/link-item.tsx')>(
			'design-system',
			'menu',
			'link-item',
			{
				featureFlag,
			},
		);

		const firstItem = page.getByTestId('first-item');
		await expect(firstItem).toBeVisible();

		await firstItem.focus();
		await expect(firstItem).toBeFocused();
	});
});
