import { expect, test } from '@af/integration-testing';

/**
 * Inline dialog: focus contract on the top-layer code path.
 *
 * `InlineDialog` renders a `role="dialog"` popover. The focus contract is:
 *
 * 1. Initial focus moves to the first focusable inside the popover on open,
 *    unless an element inside the popover carries the native HTML
 *    `autofocus` attribute, in which case the autofocus element wins
 *    (the dialog-role branch of `top-layer/useInitialFocus`).
 * 2. Escape closes the popover and restores focus to the trigger.
 * 3. Tab moves focus between focusable elements inside the popover.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('Inline dialog: top-layer focus contract', () => {
	test('initial focus: focus moves to first focusable on open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/99-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'inline-dialog',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('default-inline-dialog-trigger').click();
		await expect(page.getByTestId('default-inline-dialog-content')).toBeVisible();

		await expect(page.getByTestId('default-inline-dialog-first-button')).toBeFocused();
	});

	test('focus restoration: Escape restores focus to the trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/99-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'inline-dialog',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		const trigger = page.getByTestId('default-inline-dialog-trigger');
		await trigger.click();
		await expect(page.getByTestId('default-inline-dialog-content')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.getByTestId('default-inline-dialog-content')).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('focus movement: Tab moves focus between focusable elements within the popover', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/99-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'inline-dialog',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('default-inline-dialog-trigger').click();
		await expect(page.getByTestId('default-inline-dialog-content')).toBeVisible();

		const first = page.getByTestId('default-inline-dialog-first-button');
		const second = page.getByTestId('default-inline-dialog-second-button');

		await expect(first).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(second).toBeFocused();

		// Tabbing past the last focusable wraps within the role="dialog" popover:
		// `useFocusWrap` prevents focus from escaping to page content behind it.
		const content = page.getByTestId('default-inline-dialog-content');
		await page.keyboard.press('Tab');
		const focusWithinContent = await content.evaluate(
			(contentElement) =>
				document.activeElement !== null && contentElement.contains(document.activeElement),
		);
		expect(focusWithinContent).toBe(true);
	});

	// WCAG 2.4.3 Focus Order + WAI-ARIA APG Dialog pattern
	// (https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
	// Inline dialogs use `role="dialog"`, so when content inside the
	// popover carries the native HTML `autofocus` attribute, that
	// element must receive initial focus rather than the first
	// focusable in source order.
	test('initial focus: native [autofocus] element wins over the first focusable element', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/99-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'inline-dialog',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('autofocus-inline-dialog-trigger').click();
		await expect(page.getByTestId('autofocus-inline-dialog-content')).toBeVisible();

		// The popover contains an interior `<input>` carrying
		// `autofocus`, so focus must land on the input rather than the
		// trailing Close button (the first otherwise-focusable element
		// in source order).
		await expect(page.getByTestId('autofocus-inline-dialog-input')).toBeFocused();
	});
});
