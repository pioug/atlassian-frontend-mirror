/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

// Regression coverage for the nested-submenu focus-timing bug reported on
// the `nested-dropdown` example. When the popover's initial-focus hook
// waited for the entry transition to settle (`phase === 'open'`), a rapid
// arrow-right sequence into a deep submenu could deliver `focus()` AFTER
// the user had already pressed arrow-left to back out — snapping focus
// back to a now-stale leaf.
//
// The fix moves initial focus on the transition out of `'closed'` (i.e.
// the moment the submenu mounts) so any subsequent close cannot be
// pre-empted by a deferred focus call.
//
// `prefers-reduced-motion: reduce` is emulated to collapse the entry
// transition entirely. The lifecycle becomes `closed -> open` in a
// single commit, which makes the test deterministic regardless of CI
// timing noise — no `transitionend`, no fallback timer, no animation
// duration to wait through.
test.beforeEach(async ({ page, skipAxeCheck }) => {
	skipAxeCheck();
	await page.emulateMedia({ reducedMotion: 'reduce' });
});

test.describe('DropdownMenu top-layer — Nested submenu initial-focus timing', () => {
	const getTriggerTestId = (level: number) => `nested-${level}--trigger`;
	const getContentTestId = (level: number) => `nested-${level}--content`;

	test('ArrowRight into a deep submenu lands focus on the new submenu trigger, not on a stale leaf', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../examples/93-testing-nested-keyboard-navigation-top-layer.tsx')
		>('design-system', 'dropdown-menu', 'testing-nested-keyboard-navigation-top-layer', {
			featureFlag,
		});

		const topTrigger = page.getByTestId(getTriggerTestId(0));
		const nestedTrigger = page.getByTestId(getTriggerTestId(1));
		const nestedContent = page.getByTestId(getContentTestId(1));
		const level2Trigger = page.getByTestId(getTriggerTestId(2));
		const level2Content = page.getByTestId(getContentTestId(2));

		await topTrigger.focus();
		await page.keyboard.press('Enter');

		await expect(nestedTrigger).toBeFocused();

		// ArrowRight opens the level-1 submenu and (per the dropdown-menu
		// keyboard contract) leaves focus on the parent trigger before the
		// menu auto-focuses its first item.
		await page.keyboard.press('ArrowRight');

		await expect(nestedContent).toBeVisible();
		await expect(level2Trigger).toBeFocused();

		// Drill one level deeper. The first child inside the level-2
		// submenu is itself a nested-menu trigger (level-3), so that is
		// what should receive focus when the level-2 menu auto-focuses
		// its first item.
		const level3Trigger = page.getByTestId(getTriggerTestId(3));

		await page.keyboard.press('ArrowRight');

		await expect(level2Content).toBeVisible();
		await expect(level3Trigger).toBeFocused();
	});

	test('ArrowLeft immediately after ArrowRight does not snap focus back into the closed submenu', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../examples/93-testing-nested-keyboard-navigation-top-layer.tsx')
		>('design-system', 'dropdown-menu', 'testing-nested-keyboard-navigation-top-layer', {
			featureFlag,
		});

		const topTrigger = page.getByTestId(getTriggerTestId(0));
		const nestedTrigger = page.getByTestId(getTriggerTestId(1));
		const nestedContent = page.getByTestId(getContentTestId(1));
		const level2Trigger = page.getByTestId(getTriggerTestId(2));
		const level2Content = page.getByTestId(getContentTestId(2));

		await topTrigger.focus();
		await page.keyboard.press('Enter');

		await expect(nestedTrigger).toBeFocused();

		// Open level-1, then level-2.
		await page.keyboard.press('ArrowRight');
		await expect(nestedContent).toBeVisible();
		await expect(level2Trigger).toBeFocused();

		await page.keyboard.press('ArrowRight');
		await expect(level2Content).toBeVisible();

		// ArrowLeft closes level-2 and returns focus to its parent
		// trigger. If a deferred focus from the level-2 open call were
		// still queued, it would steal focus back to a level-2 item here.
		await page.keyboard.press('ArrowLeft');

		await expect(level2Content).toBeHidden();
		await expect(level2Trigger).toBeFocused();

		// And again: closing level-1 must return focus to its parent.
		await page.keyboard.press('ArrowLeft');

		await expect(nestedContent).toBeHidden();
		await expect(nestedTrigger).toBeFocused();
	});
});
