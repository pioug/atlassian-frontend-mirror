import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

const OVERFLOW_MENU_TRIGGER_TESTID = 'stack--overflow-menu--trigger';
const OVERFLOW_MENU_CONTENT_TESTID = 'stack--overflow-menu--content';
const AVATAR_GROUP_ITEM_4_TESTID = 'stack--avatar-group-item-4';
const AVATAR_GROUP_ITEM_5_TESTID = 'stack--avatar-group-item-5';
const AVATAR_GROUP_TESTID = 'stack--avatar-group';

test.describe('AvatarGroup top-layer — Core functionality', () => {
	test('opens and closes overflow menu when more indicator is clicked', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);

		await expect(content).toBeHidden();

		await trigger.click();
		await expect(content).toBeVisible();

		await trigger.click();
		await expect(content).toBeHidden();
	});

	test('shows avatars in overflow menu', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);
		const item4 = page.getByTestId(AVATAR_GROUP_ITEM_4_TESTID);

		await expect(content).toBeHidden();

		await trigger.click();
		await expect(content).toBeVisible();
		await expect(item4).toBeVisible();
	});

	test('non-interactive avatars are not clickable', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/02-non-interactive-avatar-group.tsx')
		>('design-system', 'avatar-group', 'non-interactive-avatar-group', {
			featureFlag,
		});

		const trigger = page.getByTestId('overrides--overflow-menu--trigger');
		const content = page.getByTestId('overrides--overflow-menu--content');

		await expect(content).toBeHidden();

		await trigger.click();
		await expect(content).toBeVisible();

		const item4 = page.getByTestId('overrides--avatar-group-item-4');
		await expect(item4).toBeVisible();
	});
});

test.describe('AvatarGroup top-layer — WCAG 1.3.2 Meaningful Sequence', () => {
	test('overflow menu content follows trigger in document order', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);

		await expect(content).toBeHidden();

		await trigger.click();
		await expect(content).toBeVisible();

		const menuFollowsTrigger = await page.evaluate(
			(ids: string[]) => {
				const tId = ids[0];
				const cId = ids[1];
				if (!tId || !cId) {
					return false;
				}
				const t = document.querySelector(`[data-testid="${tId}"]`);
				const c = document.querySelector(`[data-testid="${cId}"]`);
				if (!t || !c) {
					return false;
				}
				const position = t.compareDocumentPosition(c);
				return Boolean(position & Node.DOCUMENT_POSITION_FOLLOWING);
			},
			[OVERFLOW_MENU_TRIGGER_TESTID, OVERFLOW_MENU_CONTENT_TESTID],
		);

		expect(menuFollowsTrigger).toBe(true);

		const notLastBodyChild = await page.evaluate((cId: string) => {
			const c = document.querySelector(`[data-testid="${cId}"]`);
			return c !== null && document.body.lastElementChild !== c;
		}, OVERFLOW_MENU_CONTENT_TESTID);

		expect(notLastBodyChild).toBe(true);
	});
});

test.describe('AvatarGroup top-layer — WCAG 2.1.1 Keyboard', () => {
	test('opens via Enter key on trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);

		await expect(content).toBeHidden();
		await expect(trigger).not.toBeFocused();

		await trigger.focus();
		await expect(trigger).toBeFocused();

		await page.keyboard.press('Enter');
		await expect(content).toBeVisible();
	});

	test('opens via Space key on trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);

		await expect(content).toBeHidden();
		await expect(trigger).not.toBeFocused();

		await trigger.focus();
		await expect(trigger).toBeFocused();

		await page.keyboard.press('Space');
		await expect(content).toBeVisible();
	});

	test('Escape closes the overflow menu', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);

		await expect(content).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('Enter');
		await expect(content).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();
	});

	test('click outside closes the overflow menu', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);

		await expect(content).toBeHidden();

		await trigger.click();
		await expect(content).toBeVisible();

		await page.locator('body').click({ position: { x: 0, y: 0 } });
		await expect(content).toBeHidden();
	});
});

test.describe('AvatarGroup top-layer — WCAG 2.1.1 Arrow key navigation', () => {
	test('ArrowDown opens menu and focuses first item', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);
		const item4 = page.getByTestId(AVATAR_GROUP_ITEM_4_TESTID);

		// In top-layer mode the menu items are not rendered until the menu opens, so we cannot
		// assert `item4` focus state before opening, because the locator would resolve to no element
		// and `(not.)toBeFocused()` would fail with "element(s) not found".
		await expect(content).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('ArrowDown');
		await expect(content).toBeVisible();
		await expect(item4).toBeFocused();
	});

	test('ArrowDown navigates to next item in overflow menu', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);
		const item4 = page.getByTestId(AVATAR_GROUP_ITEM_4_TESTID);
		const item5 = page.getByTestId(AVATAR_GROUP_ITEM_5_TESTID);

		await expect(content).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('ArrowDown');
		await expect(content).toBeVisible();
		await expect(item4).toBeFocused();

		await page.keyboard.press('ArrowDown');
		await expect(item5).toBeFocused();
	});

	test('ArrowUp navigates to previous item in overflow menu', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);
		const item4 = page.getByTestId(AVATAR_GROUP_ITEM_4_TESTID);
		const item5 = page.getByTestId(AVATAR_GROUP_ITEM_5_TESTID);

		await expect(content).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('ArrowDown');
		await expect(content).toBeVisible();
		await expect(item4).toBeFocused();

		await page.keyboard.press('ArrowDown');
		await expect(item5).toBeFocused();

		await page.keyboard.press('ArrowUp');
		await expect(item4).toBeFocused();
	});

	test('Home key moves focus to first item', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);
		const item4 = page.getByTestId(AVATAR_GROUP_ITEM_4_TESTID);

		await expect(content).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('ArrowDown');
		await expect(content).toBeVisible();

		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');

		await page.keyboard.press('Home');
		await expect(item4).toBeFocused();
	});

	test('End key moves focus to last item', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);

		await expect(content).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('ArrowDown');
		await expect(content).toBeVisible();

		await page.keyboard.press('End');

		const menuContent = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);
		await expect(menuContent).toBeVisible();
	});
});

test.describe('AvatarGroup top-layer — WCAG 2.1.2 No Keyboard Trap', () => {
	test('Tab closes the overflow menu and exits without trapping focus', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);

		await expect(content).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('ArrowDown');
		await expect(content).toBeVisible();

		await page.keyboard.press('Tab');
		await expect(content).toBeHidden();
	});
});

test.describe('AvatarGroup top-layer — WCAG 2.4.3 Focus Order', () => {
	test('focus moves into menu content on Enter key open', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);

		await expect(content).toBeHidden();
		await expect(trigger).not.toBeFocused();

		await trigger.focus();
		await expect(trigger).toBeFocused();

		await page.keyboard.press('Enter');
		await expect(content).toBeVisible();

		const firstItem = page.getByTestId(AVATAR_GROUP_ITEM_4_TESTID);
		await expect(firstItem).toBeFocused();
	});

	test('focus moves to first menu item on ArrowDown open', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);
		const item4 = page.getByTestId(AVATAR_GROUP_ITEM_4_TESTID);

		// In top-layer mode the menu items are not rendered until the menu opens, so we cannot
		// assert `item4` focus state before opening, because the locator would resolve to no element
		// and `(not.)toBeFocused()` would fail with "element(s) not found".
		await expect(content).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('ArrowDown');
		await expect(content).toBeVisible();
		await expect(item4).toBeFocused();
	});

	test('focus returns to trigger on close via Escape', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);

		await expect(content).toBeHidden();
		await expect(trigger).not.toBeFocused();

		await trigger.click();
		await expect(content).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('focus returns to trigger on light-dismiss close', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);

		await expect(content).toBeHidden();

		await trigger.click();
		await expect(content).toBeVisible();

		await page.locator('body').click({ position: { x: 0, y: 0 } });
		await expect(content).toBeHidden();
	});
});

test.describe('AvatarGroup top-layer — WCAG 4.1.2 Name, Role, Value', () => {
	test('trigger has aria-expanded attribute that reflects state', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);

		await expect(trigger).toHaveAttribute('aria-expanded', 'false');

		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	test('trigger has aria-haspopup attribute', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		await expect(trigger).toHaveAttribute('aria-haspopup');
	});

	test('avatar group has accessible label', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const group = page.getByTestId(AVATAR_GROUP_TESTID);
		await expect(group).toHaveAttribute('aria-label', 'avatar group');
	});

	test('overflow menu content has role="menu" (sanity check)', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/02-basic-avatar-group.tsx')>(
			'design-system',
			'avatar-group',
			'basic-avatar-group',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(OVERFLOW_MENU_TRIGGER_TESTID);
		const content = page.getByTestId(OVERFLOW_MENU_CONTENT_TESTID);

		await expect(content).toBeHidden();

		await trigger.click();
		await expect(content).toBeVisible();

		const menu = page.getByRole('menu');
		await expect(menu).toBeVisible();
	});
});

test.describe('AvatarGroup top-layer — Within Modal', () => {
	test('overflow menu opens and closes correctly inside a modal', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/40-within-modal.tsx')>(
			'design-system',
			'avatar-group',
			'within-modal',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('within-modal--overflow-menu--trigger');
		const content = page.getByTestId('within-modal--overflow-menu--content');

		await expect(trigger).toBeVisible();
		await expect(content).toBeHidden();

		await trigger.click();
		await expect(content).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();
	});

	test('arrow keys navigate items inside modal', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/40-within-modal.tsx')>(
			'design-system',
			'avatar-group',
			'within-modal',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('within-modal--overflow-menu--trigger');
		const content = page.getByTestId('within-modal--overflow-menu--content');
		const item4 = page.getByTestId('within-modal--avatar-group-item-4');
		const item5 = page.getByTestId('within-modal--avatar-group-item-5');

		await expect(content).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('ArrowDown');
		await expect(content).toBeVisible();
		await expect(item4).toBeFocused();

		await page.keyboard.press('ArrowDown');
		await expect(item5).toBeFocused();
	});

	test('Tab closes menu inside modal without trapping focus', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/40-within-modal.tsx')>(
			'design-system',
			'avatar-group',
			'within-modal',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('within-modal--overflow-menu--trigger');
		const content = page.getByTestId('within-modal--overflow-menu--content');

		await expect(content).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('ArrowDown');
		await expect(content).toBeVisible();

		await page.keyboard.press('Tab');
		await expect(content).toBeHidden();
	});

	test('focus returns to trigger on Escape inside modal', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/40-within-modal.tsx')>(
			'design-system',
			'avatar-group',
			'within-modal',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('within-modal--overflow-menu--trigger');
		const content = page.getByTestId('within-modal--overflow-menu--content');

		await expect(content).toBeHidden();
		await expect(trigger).not.toBeFocused();

		await trigger.focus();
		await page.keyboard.press('Enter');
		await expect(content).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();
		await expect(trigger).toBeFocused();
	});
});
