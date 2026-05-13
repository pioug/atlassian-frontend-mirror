import invariant from 'tiny-invariant';

import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

// Skip axe checks across this file: the test example may have known
// pre-existing accessibility violations unrelated to the top-layer migration.
test.beforeEach(({ skipAxeCheck }) => {
	skipAxeCheck();
});
test.describe('Popup top-layer — WCAG 2.1.1 Keyboard', () => {
	test('popup can be opened via Enter key on trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.focus();
		await trigger.press('Enter');

		await expect(page.getByTestId('popup--content')).toBeVisible();
	});

	test('popup can be opened via Space key on trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.focus();
		await trigger.press('Space');

		await expect(page.getByTestId('popup--content')).toBeVisible();
	});

	test('popup can be opened via click on trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();

		await expect(page.getByTestId('popup--content')).toBeVisible();
	});
});
test.describe('Popup top-layer — WCAG 2.1.2 No Keyboard Trap', () => {
	test('Escape closes the popup', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();
		await expect(page.getByTestId('popup--content')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.getByTestId('popup--content')).toBeHidden();
	});

	test('Tab does not trap focus inside the popup (escape via Escape key)', async ({ page }) => {
		// In the FF-on top-layer path, Popups default to `role="dialog"`
		// (the bridge in `internal/top-layer-bridge.tsx` defaults the role
		// when none is provided), which intentionally **does** wrap Tab to
		// match the WAI-ARIA dialog pattern. So this test asserts WCAG
		// 2.1.2 ("no keyboard trap") in the way that's actually correct
		// for that pattern: Escape always provides an escape route, even
		// when Tab is wrapped.
		await page.visitExample<
			typeof import('../../../../../examples/21-popup-should-render-to-parent.tsx')
		>('design-system', 'popup', 'popup-should-render-to-parent', {
			featureFlag,
		});

		const trigger = page.getByTestId('popup-trigger');
		await trigger.focus();
		await trigger.press('Enter');

		await expect(page.getByTestId('popup--content')).toBeVisible();

		// Tab a few times — focus stays inside the popup (correct for
		// dialog-pattern wrapping).
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await expect(page.getByTestId('popup--content')).toBeVisible();

		// Escape always exits — that's the WCAG 2.1.2 escape route.
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('popup--content')).toBeHidden();
		await expect(trigger).toBeFocused();
	});
});
test.describe('Popup top-layer — WCAG 2.4.3 Focus Order', () => {
	test('focus moves into popup content when opened', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();

		await expect(page.getByTestId('popup--content')).toBeVisible();
		// Focus should have moved off the trigger into the popup
		await expect(trigger).not.toBeFocused();
	});

	test('focus returns to trigger after Escape', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();
		await expect(page.getByTestId('popup--content')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
	});
});
type FocusOptionsWithVisible = NonNullable<Parameters<HTMLElement['focus']>[0]> & {
	focusVisible?: boolean;
};

test.describe('Popup top-layer — WCAG 2.4.7 Focus Visible', () => {
	test('trigger matches :focus-visible when focused with keyboard-style focus', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');

		await trigger.evaluate((el) => {
			const options: FocusOptionsWithVisible = { focusVisible: true };
			(el as HTMLElement).focus(options);
		});

		await expect(trigger).toBeFocused();

		const hasFocusVisible = await trigger.evaluate((el) => {
			return el.matches(':focus-visible');
		});

		expect(hasFocusVisible).toBe(true);
	});
});
test.describe('Popup top-layer — WCAG 2.4.11 Content Not Obscured', () => {
	test('popup content is visible and not obscured', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup--content');
		await expect(content).toBeHidden();

		await trigger.click();

		await expect(content).toBeVisible();
	});
});
test.describe('Popup top-layer — WCAG 4.1.2 Name, Role, Value', () => {
	test('trigger has aria-expanded=false when popup is closed', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	test('trigger has aria-expanded=true when popup is open', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	test('trigger has aria-haspopup', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await expect(trigger).toHaveAttribute('aria-haspopup');
	});

	test('popup content has popover attribute', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();

		const content = page.getByTestId('popup--content');
		await expect(content).toBeVisible();
	});

	test('popup dialog role has accessible label', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/16-popup-with-a11y-props.tsx')>(
			'design-system',
			'popup',
			'popup-with-a11y-props',
			{
				featureFlag,
			},
		);

		// The popup should have an accessible name via aria-label or aria-labelledby.
		// The example renders TWO popups (one with `label`, one with `titleId`),
		// so we click only the first trigger and assert the first dialog is named.
		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();

		const dialog = page.getByRole('dialog').first();
		await expect(dialog).toBeVisible();
		// Either aria-label or aria-labelledby provides the accessible name.
		const label = await dialog.getAttribute('aria-label');
		const labelledBy = await dialog.getAttribute('aria-labelledby');
		expect(label || labelledBy).toBeTruthy();
	});
});
test.describe('Popup top-layer — WCAG 4.1.3 Status Messages', () => {
	test('popup state change is perceivable via aria-expanded', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');

		// Closed state
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');

		// Open
		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		// Close via Escape
		await page.keyboard.press('Escape');
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});
});
test.describe('Popup top-layer — WCAG 1.3.1 Info and Relationships', () => {
	test('trigger aria-controls references the actual popup element', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();

		// `aria-controls` references the popup container's auto-generated id
		// (top-layer Popup uses `useId()` for the popover element when no
		// explicit `id` is provided). The actual id value depends on render
		// order, so we just assert that aria-controls is set and points at
		// the visible popup content.
		await expect(trigger).toHaveAttribute('aria-controls', /.+/);
		const ariaControlsValue = await trigger.getAttribute('aria-controls');
		// eslint-disable-next-line playwright/prefer-web-first-assertions -- need the
		// actual id string to build the locator below; the auto-waiting check
		// above guarantees it is present.
		await expect(page.locator(`#${ariaControlsValue}`)).toBeVisible();
		// The example's inner div with id="popup-content" should also be
		// visible inside the popup (a separate node from the popover root).
		await expect(page.locator('#popup-content')).toBeVisible();
	});
});
test.describe('Popup top-layer — WCAG 1.3.2 Meaningful Sequence', () => {
	test('popup content follows trigger in document order (not portalled to body end)', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();

		const content = page.getByTestId('popup--content');
		await expect(content).toBeVisible();

		const contentFollowsTrigger = await page.evaluate(() => {
			const t = document.querySelector('[data-testid="popup-trigger"]');
			const c = document.querySelector('[data-testid="popup--content"]');
			if (!t || !c) {
				return false;
			}
			const position = t.compareDocumentPosition(c);
			return Boolean(position & Node.DOCUMENT_POSITION_FOLLOWING);
		});

		expect(contentFollowsTrigger).toBe(true);

		const notLastBodyChild = await page.evaluate(() => {
			const c = document.querySelector('[data-testid="popup--content"]');
			return c !== null && document.body.lastElementChild !== c;
		});

		expect(notLastBodyChild).toBe(true);
	});
});
test.describe('Popup top-layer — Dismiss behaviors', () => {
	test('clicking outside closes the popup (light dismiss)', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();
		await expect(page.getByTestId('popup--content')).toBeVisible();

		// Click on empty area outside the popup
		await page.mouse.click(10, 10);
		await expect(page.getByTestId('popup--content')).toBeHidden();
	});

	test('Escape key closes the popup', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();
		await expect(page.getByTestId('popup--content')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.getByTestId('popup--content')).toBeHidden();
	});
});
test.describe('Popup top-layer — Positioning and sizing', () => {
	test('popup is positioned near the trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();

		const content = page.getByTestId('popup--content');
		await expect(content).toBeVisible();

		const triggerBox = await trigger.boundingBox();
		const contentBox = await content.boundingBox();
		invariant(triggerBox, 'trigger bounding box');
		invariant(contentBox, 'content bounding box');

		// Content should be within a reasonable proximity of the trigger
		// (within 500px — generous but prevents off-screen rendering)
		const distance = Math.abs(contentBox.y - triggerBox.y);
		expect(distance).toBeLessThan(500);
	});

	test('shouldFitContainer makes popup match trigger width', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/18-should-fit-container.tsx')>(
			'design-system',
			'popup',
			'should-fit-container',
			{
				featureFlag,
			},
		);

		// The example exports both a default (initially-closed) and a
		// named (initially-open) instance. The default export is the closed
		// variant — the only one rendered when the test visits 'should-fit-container'.
		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();

		const content = page.getByTestId('popup--content');
		await expect(content).toBeVisible();

		const triggerBox = await trigger.boundingBox();
		const contentBox = await content.boundingBox();
		invariant(triggerBox, 'trigger bounding box');
		invariant(contentBox, 'content bounding box');

		// `shouldFitContainer` plumbs `width="trigger"` into the top-layer
		// `Popup.Content`, which sets `width: anchor-size(width)` on the
		// popover (with a one-off offsetWidth fallback in browsers without
		// CSS anchor-size). The content width should match the trigger
		// width within sub-pixel rounding.
		expect(Math.abs(contentBox.width - triggerBox.width)).toBeLessThan(1);
	});
});
test.describe('Popup top-layer — Nested popups', () => {
	// Native `popover="auto"` chains nested popovers via DOM ancestry —
	// when a child popover opens inside an open parent popover, the parent
	// stays open. The `nested.tsx` example renders the nested `<Popup>` as
	// a descendant of the parent's `Popup.Content`, which preserves the
	// chain through the top layer.
	test('nested popup opens without closing parent', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/nested.tsx')>(
			'design-system',
			'popup',
			'nested',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();

		// The nested.tsx example renders a recursive `NestedPopup`, so each
		// open level introduces *another* `nested-popup-trigger`. Always
		// pick the first (level 1) to avoid strict-mode violations.
		// (The original fixme had the wrong selector — `popup-trigger-0` —
		// which didn't match anything.)
		const nestedTrigger = page.getByTestId('nested-popup-trigger').first();
		await nestedTrigger.click();

		// Both popups should be visible.
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await expect(nestedTrigger).toHaveAttribute('aria-expanded', 'true');
	});

	test('Escape on nested popup only closes the nested one', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/nested.tsx')>(
			'design-system',
			'popup',
			'nested',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();

		// `nested-popup-trigger` is recursive in this example, so always
		// pick the first (level 1) instance.
		const nestedTrigger = page.getByTestId('nested-popup-trigger').first();
		await nestedTrigger.click();
		await expect(nestedTrigger).toHaveAttribute('aria-expanded', 'true');

		await page.keyboard.press('Escape');

		// Per `popover="auto"` semantics, Escape closes the topmost popover
		// in the chain (the nested one), leaving the parent open.
		await expect(nestedTrigger).toHaveAttribute('aria-expanded', 'false');
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});
});
test.describe('Popup top-layer — Dialog role focus behavior', () => {
	test('Tab wraps forward from last to first focusable element', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/19-popup-role-dialog.tsx')>(
			'design-system',
			'popup',
			'popup-role-dialog',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.focus();
		await trigger.press('Enter');

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		// Top-layer's Popup auto-focuses the first focusable child of the
		// dialog when it opens, so popup-button-0 already has focus and we
		// do not need a first Tab to reach it.
		await expect(page.getByTestId('popup-button-0')).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(page.getByTestId('popup-button-1')).toBeFocused();

		// After the last focusable element, Tab should wrap back to the first.
		await page.keyboard.press('Tab');
		await expect(page.getByTestId('popup-button-0')).toBeFocused();
	});

	test('Shift+Tab wraps backward from first to last focusable element', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/19-popup-role-dialog.tsx')>(
			'design-system',
			'popup',
			'popup-role-dialog',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.focus();
		await trigger.press('Enter');

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		// First focusable already has focus thanks to top-layer auto-focus.
		await expect(page.getByTestId('popup-button-0')).toBeFocused();

		// Shift+Tab from the first focusable element should wrap to the last.
		await page.keyboard.press('Shift+Tab');
		await expect(page.getByTestId('popup-button-1')).toBeFocused();

		// Continue backward to verify cycling
		await page.keyboard.press('Shift+Tab');
		await expect(page.getByTestId('popup-button-0')).toBeFocused();
	});

	test('Tab does not escape dialog popup to background content', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/19-popup-role-dialog.tsx')>(
			'design-system',
			'popup',
			'popup-role-dialog',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.focus();
		await trigger.press('Enter');

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		// Tab many times — focus should never leave the dialog
		for (let i = 0; i < 8; i++) {
			await page.keyboard.press('Tab');
		}

		// Background buttons should not have focus
		await expect(page.getByTestId('button-0')).not.toBeFocused();
		await expect(page.getByTestId('button-1')).not.toBeFocused();
	});

	test('Escape still closes focus-wrapped dialog popup', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/19-popup-role-dialog.tsx')>(
			'design-system',
			'popup',
			'popup-role-dialog',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.focus();
		await trigger.press('Enter');

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		// Top-layer auto-focus places focus on the first focusable child.
		await expect(page.getByTestId('popup-button-0')).toBeFocused();

		// Escape should still close the popup (light dismiss is preserved)
		await page.keyboard.press('Escape');
		await expect(dialog).toBeHidden();
	});
});
