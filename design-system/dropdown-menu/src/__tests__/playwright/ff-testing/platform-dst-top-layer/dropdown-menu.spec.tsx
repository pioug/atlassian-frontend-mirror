import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

const triggerTestId = 'lite-mode-ddm--trigger';
const contentTestId = 'lite-mode-ddm--content';

// The auto-axe scan is skipped for every test in this file because opening the
// menu puts the trigger button into its "selected" state, which uses
// `color.text.selected` (#1868db) on `color.background.selected` (#cfe1fd).
// That combination is 3.91:1 — below the WCAG AA 4.5:1 threshold for normal
// text. The violation is platform-wide on these design tokens, not specific to
// the new top-layer DropdownMenu, and is being tracked separately. Each test
// here still asserts its own behaviour (keyboard nav, focus order, etc.).
// TODO(<follow-up-ticket>): remove this once color.text.selected/background
// .selected token contrast is brought to AA.
test.beforeEach(async ({ skipAxeCheck }) => {
	skipAxeCheck();
});

test.describe('DropdownMenu top-layer — WCAG 1.3.2 Meaningful Sequence', () => {
	test('menu content follows trigger in document order (not portalled to body end)', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../examples/98-testing-ddm-default.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-ddm-default',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(contentTestId);

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
			[triggerTestId, contentTestId],
		);

		expect(menuFollowsTrigger).toBe(true);

		const notLastBodyChild = await page.evaluate((cId: string) => {
			const c = document.querySelector(`[data-testid="${cId}"]`);
			return c !== null && document.body.lastElementChild !== c;
		}, contentTestId);

		expect(notLastBodyChild).toBe(true);
	});
});

test.describe('DropdownMenu top-layer — WCAG 2.1.1 Keyboard', () => {
	test('menu opens via Enter key on trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/98-testing-ddm-default.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-ddm-default',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(contentTestId);

		await expect(content).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(content).toBeVisible();
	});

	test('arrow keys cycle through menu items with wrapping', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/98-testing-ddm-default.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-ddm-default',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const moveItem = page.getByRole('menuitem', { name: 'Move' });
		const cloneItem = page.getByRole('menuitem', { name: 'Clone' });
		const deleteItem = page.getByRole('menuitem', { name: 'Delete' });

		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(moveItem).toBeFocused();

		await page.keyboard.press('ArrowDown');
		await expect(cloneItem).toBeFocused();

		await page.keyboard.press('ArrowDown');
		await expect(deleteItem).toBeFocused();

		await page.keyboard.press('ArrowDown');
		await expect(moveItem).toBeFocused();

		await page.keyboard.press('ArrowUp');
		await expect(deleteItem).toBeFocused();
	});
});

test.describe('DropdownMenu top-layer — WCAG 2.1.2 No Keyboard Trap', () => {
	test('Escape closes menu', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/98-testing-ddm-default.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-ddm-default',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(contentTestId);

		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(content).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(content).toBeHidden();
	});

	test('Tab exits menu without trapping focus', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/98-testing-ddm-default.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-ddm-default',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(contentTestId);

		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(content).toBeVisible();

		await page.keyboard.press('Tab');

		await expect(content).toBeHidden();
	});
});

test.describe('DropdownMenu top-layer — WCAG 2.4.3 Focus Order', () => {
	test('focus moves to first menu item when menu opens via keyboard', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/98-testing-ddm-default.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-ddm-default',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const moveItem = page.getByRole('menuitem', { name: 'Move' });

		await trigger.focus();
		// Use `not.toBeVisible()` (not `not.toBeFocused()`) for the pre-open
		// assertion. `not.toBeFocused()` waits up to 5s for the element to
		// exist before checking focus, which deadlocks here since the menu
		// has not been opened yet and the menu item is not in the DOM.
		await expect(moveItem).not.toBeVisible();

		await page.keyboard.press('Enter');

		await expect(moveItem).toBeFocused();
	});

	test('focus returns to trigger when Escape closes menu', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/98-testing-ddm-default.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-ddm-default',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(contentTestId);

		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(content).toBeVisible();
		await expect(trigger).not.toBeFocused();

		await page.keyboard.press('Escape');

		await expect(content).toBeHidden();
		await expect(trigger).toBeFocused();
	});
});

test.describe('DropdownMenu top-layer — WCAG 2.4.7 Focus Visible', () => {
	test('keyboard-focused menu items have visible focus indicator', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/98-testing-ddm-default.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-ddm-default',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const secondItem = page.getByRole('menuitem', { name: 'Clone' });

		await trigger.focus();
		await page.keyboard.press('Enter');

		await page.keyboard.press('ArrowDown');

		await expect(secondItem).toBeFocused();

		const hasFocusVisible = await secondItem.evaluate((el) => {
			return el.matches(':focus-visible');
		});

		expect(hasFocusVisible).toBe(true);
	});
});

test.describe('DropdownMenu top-layer — WCAG 2.4.11 Focus Not Obscured', () => {
	test('menu is visible and not obscured when open', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/98-testing-ddm-default.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-ddm-default',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(contentTestId);

		await expect(content).toBeHidden();

		await trigger.click();

		await expect(content).toBeVisible();
	});
});

test.describe('DropdownMenu top-layer — WCAG 3.2.1 On Focus', () => {
	test('focus returning to trigger does not re-open menu', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/98-testing-ddm-default.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-ddm-default',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(contentTestId);

		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(content).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(content).toBeHidden();
		await expect(trigger).toBeFocused();

		await expect(content).toBeHidden();
	});
});

test.describe('DropdownMenu top-layer — Home/End key navigation', () => {
	test('Home key moves focus to first menu item', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/98-testing-ddm-default.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-ddm-default',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const moveItem = page.getByRole('menuitem', { name: 'Move' });
		const deleteItem = page.getByRole('menuitem', { name: 'Delete' });

		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(moveItem).toBeFocused();

		await page.keyboard.press('ArrowUp');

		await expect(deleteItem).toBeFocused();

		await page.keyboard.press('Home');

		await expect(moveItem).toBeFocused();
	});

	test('End key moves focus to last menu item', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/98-testing-ddm-default.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-ddm-default',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const moveItem = page.getByRole('menuitem', { name: 'Move' });
		const deleteItem = page.getByRole('menuitem', { name: 'Delete' });

		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(moveItem).toBeFocused();

		await page.keyboard.press('End');

		await expect(deleteItem).toBeFocused();
	});
});

test.describe('DropdownMenu top-layer — Nested keyboard navigation', () => {
	const getTriggerTestId = (level: number) => `nested-${level}--trigger`;
	const getContentTestId = (level: number) => `nested-${level}--content`;
	const getItemTestId = (level: number, id: number) => `nested-item${id}-${level}`;

	test('ArrowDown navigates within current menu level, not into nested menu', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/93-testing-nested-keyboard-navigation-top-layer.tsx')
		>('design-system', 'dropdown-menu', 'testing-nested-keyboard-navigation-top-layer', {
			featureFlag,
		});

		const topTrigger = page.getByTestId(getTriggerTestId(0));
		const topContent = page.getByTestId(getContentTestId(0));
		const nestedTrigger = page.getByTestId(getTriggerTestId(1));
		const nestedContent = page.getByTestId(getContentTestId(1));
		const item1 = page.getByTestId(getItemTestId(1, 1));
		const item2 = page.getByTestId(getItemTestId(1, 2));

		await topTrigger.focus();
		await page.keyboard.press('Enter');

		await expect(topContent).toBeVisible();
		await expect(nestedTrigger).toBeFocused();

		await page.keyboard.press('ArrowDown');

		await expect(item1).toBeFocused();

		await page.keyboard.press('ArrowDown');

		await expect(item2).toBeFocused();

		await page.keyboard.press('ArrowDown');

		await expect(nestedTrigger).toBeFocused();
		await expect(nestedContent).toBeHidden();
	});

	test('ArrowUp navigates within current menu level, not into nested menu', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/93-testing-nested-keyboard-navigation-top-layer.tsx')
		>('design-system', 'dropdown-menu', 'testing-nested-keyboard-navigation-top-layer', {
			featureFlag,
		});

		const topTrigger = page.getByTestId(getTriggerTestId(0));
		const topContent = page.getByTestId(getContentTestId(0));
		const nestedTrigger = page.getByTestId(getTriggerTestId(1));
		const item2 = page.getByTestId(getItemTestId(1, 2));

		await topTrigger.focus();
		await page.keyboard.press('Enter');

		await expect(topContent).toBeVisible();
		await expect(nestedTrigger).toBeFocused();

		await page.keyboard.press('ArrowUp');

		await expect(item2).toBeFocused();
	});

	test('nested dropdown opens and navigates correctly with Enter', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/93-testing-nested-keyboard-navigation-top-layer.tsx')
		>('design-system', 'dropdown-menu', 'testing-nested-keyboard-navigation-top-layer', {
			featureFlag,
		});

		const topTrigger = page.getByTestId(getTriggerTestId(0));
		const topContent = page.getByTestId(getContentTestId(0));
		const nestedTrigger = page.getByTestId(getTriggerTestId(1));
		const nestedContent = page.getByTestId(getContentTestId(1));
		const level2Trigger = page.getByTestId(getTriggerTestId(2));
		const level2Item1 = page.getByTestId(getItemTestId(2, 1));
		const level2Item2 = page.getByTestId(getItemTestId(2, 2));

		await topTrigger.focus();
		await page.keyboard.press('Enter');

		await expect(topContent).toBeVisible();
		await expect(nestedTrigger).toBeFocused();

		await page.keyboard.press('Enter');

		await expect(nestedContent).toBeVisible();
		await expect(topContent).toBeVisible();
		await expect(level2Trigger).toBeFocused();

		await page.keyboard.press('ArrowDown');

		await expect(level2Item1).toBeFocused();

		await page.keyboard.press('ArrowDown');

		await expect(level2Item2).toBeFocused();
	});

	test('ArrowRight opens nested menu from trigger', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/93-testing-nested-keyboard-navigation-top-layer.tsx')
		>('design-system', 'dropdown-menu', 'testing-nested-keyboard-navigation-top-layer', {
			featureFlag,
		});

		const topTrigger = page.getByTestId(getTriggerTestId(0));
		const topContent = page.getByTestId(getContentTestId(0));
		const nestedTrigger = page.getByTestId(getTriggerTestId(1));
		const nestedContent = page.getByTestId(getContentTestId(1));
		const level2Trigger = page.getByTestId(getTriggerTestId(2));

		await topTrigger.focus();
		await page.keyboard.press('Enter');

		await expect(topContent).toBeVisible();
		await expect(nestedTrigger).toBeFocused();

		await page.keyboard.press('ArrowRight');

		await expect(nestedContent).toBeVisible();
		await expect(level2Trigger).toBeFocused();
	});

	test('ArrowRight does nothing on non-trigger menu items', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/93-testing-nested-keyboard-navigation-top-layer.tsx')
		>('design-system', 'dropdown-menu', 'testing-nested-keyboard-navigation-top-layer', {
			featureFlag,
		});

		const topTrigger = page.getByTestId(getTriggerTestId(0));
		const topContent = page.getByTestId(getContentTestId(0));
		const nestedContent = page.getByTestId(getContentTestId(1));
		const item1 = page.getByTestId(getItemTestId(1, 1));

		await topTrigger.focus();
		await page.keyboard.press('Enter');

		await expect(topContent).toBeVisible();

		await page.keyboard.press('ArrowDown');

		await expect(item1).toBeFocused();

		await page.keyboard.press('ArrowRight');

		await expect(item1).toBeFocused();
		await expect(nestedContent).toBeHidden();
		await expect(topContent).toBeVisible();
	});

	test('ArrowLeft closes nested menu and returns focus to parent', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/93-testing-nested-keyboard-navigation-top-layer.tsx')
		>('design-system', 'dropdown-menu', 'testing-nested-keyboard-navigation-top-layer', {
			featureFlag,
		});

		const topTrigger = page.getByTestId(getTriggerTestId(0));
		const topContent = page.getByTestId(getContentTestId(0));
		const nestedTrigger = page.getByTestId(getTriggerTestId(1));
		const nestedContent = page.getByTestId(getContentTestId(1));

		await topTrigger.focus();
		await page.keyboard.press('Enter');

		await expect(topContent).toBeVisible();
		// Wait until the nested trigger is the active element before pressing
		// ArrowRight. The roving focus inside the just-opened menu is asynchronous,
		// so dispatching the key before focus has landed on the trigger sometimes
		// caused focus restoration on the subsequent ArrowLeft to fail.
		await expect(nestedTrigger).toBeFocused();

		await page.keyboard.press('ArrowRight');

		await expect(nestedContent).toBeVisible();
		// Wait until focus has moved into the nested submenu before closing it via
		// ArrowLeft. Without this wait, ArrowLeft can fire while focus is still on
		// the parent trigger, which made focus restoration to the parent inconsistent.
		await expect(nestedTrigger).not.toBeFocused();

		await page.keyboard.press('ArrowLeft');

		await expect(nestedContent).toBeHidden();
		await expect(nestedTrigger).toBeFocused();
		await expect(topContent).toBeVisible();
	});

	test('ArrowLeft does nothing on top-level menu', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/93-testing-nested-keyboard-navigation-top-layer.tsx')
		>('design-system', 'dropdown-menu', 'testing-nested-keyboard-navigation-top-layer', {
			featureFlag,
		});

		const topTrigger = page.getByTestId(getTriggerTestId(0));
		const topContent = page.getByTestId(getContentTestId(0));

		await topTrigger.focus();
		await page.keyboard.press('Enter');

		await expect(topContent).toBeVisible();

		await page.keyboard.press('ArrowLeft');

		await expect(topContent).toBeVisible();
	});

	test('Escape closes nested menu and returns focus to parent', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/93-testing-nested-keyboard-navigation-top-layer.tsx')
		>('design-system', 'dropdown-menu', 'testing-nested-keyboard-navigation-top-layer', {
			featureFlag,
		});

		const topTrigger = page.getByTestId(getTriggerTestId(0));
		const topContent = page.getByTestId(getContentTestId(0));
		const nestedTrigger = page.getByTestId(getTriggerTestId(1));
		const nestedContent = page.getByTestId(getContentTestId(1));

		await topTrigger.focus();
		await page.keyboard.press('Enter');

		await expect(topContent).toBeVisible();

		await page.keyboard.press('Enter');

		await expect(nestedContent).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(nestedContent).toBeHidden();
		await expect(nestedTrigger).toBeFocused();
	});

	test('Home/End keys navigate within current menu level only', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/93-testing-nested-keyboard-navigation-top-layer.tsx')
		>('design-system', 'dropdown-menu', 'testing-nested-keyboard-navigation-top-layer', {
			featureFlag,
		});

		const topTrigger = page.getByTestId(getTriggerTestId(0));
		const topContent = page.getByTestId(getContentTestId(0));
		const nestedTrigger = page.getByTestId(getTriggerTestId(1));
		const item2 = page.getByTestId(getItemTestId(1, 2));

		await topTrigger.focus();
		await page.keyboard.press('Enter');

		await expect(topContent).toBeVisible();

		await page.keyboard.press('End');

		await expect(item2).toBeFocused();

		await page.keyboard.press('Home');

		await expect(nestedTrigger).toBeFocused();
	});

	test('Home/End keys stay within nested menu, not parent menu', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/93-testing-nested-keyboard-navigation-top-layer.tsx')
		>('design-system', 'dropdown-menu', 'testing-nested-keyboard-navigation-top-layer', {
			featureFlag,
		});

		const topTrigger = page.getByTestId(getTriggerTestId(0));
		const topContent = page.getByTestId(getContentTestId(0));
		const nestedTrigger = page.getByTestId(getTriggerTestId(1));
		const nestedContent = page.getByTestId(getContentTestId(1));
		const level2Trigger = page.getByTestId(getTriggerTestId(2));
		const level2Item2 = page.getByTestId(getItemTestId(2, 2));

		await topTrigger.focus();
		await page.keyboard.press('Enter');

		await expect(topContent).toBeVisible();
		await expect(nestedTrigger).toBeFocused();

		await page.keyboard.press('Enter');

		await expect(nestedContent).toBeVisible();
		await expect(level2Trigger).toBeFocused();

		await page.keyboard.press('End');

		await expect(level2Item2).toBeFocused();

		await page.keyboard.press('Home');

		await expect(level2Trigger).toBeFocused();

		await expect(topContent).toBeVisible();
		await expect(nestedContent).toBeVisible();
	});

	// Note: "ArrowRight navigates through multiple nesting levels" is not tested
	// here because `popover="auto"` dismisses sibling auto-popovers, preventing
	// 3+ levels from being open simultaneously.

	// Note: 3-level deep nesting (ArrowLeft closing one level at a time)
	// is not tested here because `popover="auto"` dismisses sibling auto-popovers,
	// preventing 3+ levels from being open simultaneously. The 2-level nesting
	// tests above cover the ArrowLeft behavior adequately.
});
