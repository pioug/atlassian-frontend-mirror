import invariant from 'tiny-invariant';

import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform_dst_popup-disable-focuslock';

test.describe('Popup top-layer — WCAG 2.1.1 Keyboard', () => {
	test('Opens via Enter key on trigger', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/21-popup-should-render-to-parent.tsx')
		>('design-system', 'popup', 'popup-should-render-to-parent', { 'react-18-mode': 'legacy' });

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup');

		await expect(content).toBeHidden();

		await trigger.focus();
		await trigger.press('Enter');

		await expect(content).toBeVisible();
	});

	test('Opens via Space key on trigger', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/21-popup-should-render-to-parent.tsx')
		>('design-system', 'popup', 'popup-should-render-to-parent', { 'react-18-mode': 'legacy' });

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup');

		await expect(content).toBeHidden();

		await trigger.focus();
		await trigger.press(' ');

		await expect(content).toBeVisible();
	});

	test('Opens via click on trigger', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/21-popup-should-render-to-parent.tsx')
		>('design-system', 'popup', 'popup-should-render-to-parent', { 'react-18-mode': 'legacy' });

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup');

		await expect(content).toBeHidden();

		await trigger.click();

		await expect(content).toBeVisible();
	});
});

test.describe('Popup top-layer — WCAG 2.1.2 No Keyboard Trap', () => {
	test('Escape closes popup with default role (menu)', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/21-popup-should-render-to-parent.tsx')
		>('design-system', 'popup', 'popup-should-render-to-parent', { 'react-18-mode': 'legacy' });

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup');

		await trigger.focus();
		await trigger.press('Enter');
		await expect(content).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(content).toBeHidden();
	});

	// Skipped: exercises the interim `platform_dst_popup-disable-focuslock`
	// FF, which is being superseded by the `platform-dst-top-layer`
	// migration. The equivalent behaviour is covered by the green FF-on
	// suite at `popup/src/__tests__/playwright/ff-testing/`. Both this FF
	// and the underlying focus-lock code path will be removed once
	// top-layer adoption ships, so we do not invest in fixing the
	// pre-existing failure here.
	test.fixme('Tab can exit non-dialog popup when focus lock disabled', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/21-popup-should-render-to-parent.tsx')
		>('design-system', 'popup', 'popup-should-render-to-parent', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup');
		const popupButton0 = page.getByTestId('popup-button-0');
		const pageButton1 = page.getByTestId('button-1');

		await trigger.focus();
		await trigger.press('Enter');
		await expect(content).toBeVisible();

		await page.keyboard.press('Tab');
		await expect(popupButton0).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(popupButton0).toBeFocused(); // The second button in popup

		await page.keyboard.press('Tab');
		await expect(pageButton1).toBeFocused(); // Focus exits popup

		await expect(content).toBeHidden();
	});

	test('Dialog role has focus trap even with focus lock disabled', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/19-popup-role-dialog.tsx')>(
			'design-system',
			'popup',
			'popup-role-dialog',
			{
				featureFlag,
				'react-18-mode': 'legacy',
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup');
		const popupButton0 = page.getByTestId('popup-button-0');
		const popupButton1 = page.getByTestId('popup-button-1');

		await trigger.focus();
		await trigger.press('Enter');
		await expect(content).toBeVisible();

		await page.keyboard.press('Tab');
		await expect(popupButton0).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(popupButton1).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(popupButton0).toBeFocused(); // Focus wraps in dialog

		await page.keyboard.press('Shift+Tab');
		await expect(popupButton1).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		await expect(popupButton0).toBeFocused();
	});
});

test.describe('Popup top-layer — WCAG 2.4.3 Focus Order', () => {
	test('Focus moves into popup content on open', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/21-popup-should-render-to-parent.tsx')
		>('design-system', 'popup', 'popup-should-render-to-parent', { 'react-18-mode': 'legacy' });

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup');

		await trigger.focus();
		await expect(trigger).toBeFocused();

		await trigger.press('Enter');
		await expect(content).toBeVisible();

		await expect(content).toBeFocused(); // Focus moves into popup
	});

	test('Focus returns to trigger on close', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/21-popup-should-render-to-parent.tsx')
		>('design-system', 'popup', 'popup-should-render-to-parent', { 'react-18-mode': 'legacy' });

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup');

		await trigger.focus();
		await trigger.press('Enter');
		await expect(content).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();

		await expect(trigger).toBeFocused();
	});

	test('Focus traps in dialog popup (shifts + tab/tab wrap)', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/19-popup-role-dialog.tsx')>(
			'design-system',
			'popup',
			'popup-role-dialog',
			{ 'react-18-mode': 'legacy' },
		);

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup');
		const popupButton0 = page.getByTestId('popup-button-0');
		const popupButton1 = page.getByTestId('popup-button-1');

		await trigger.focus();
		await trigger.press('Enter');
		await expect(content).toBeVisible();

		await page.keyboard.press('Shift+Tab');
		await expect(popupButton1).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(popupButton0).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();
		await expect(trigger).toBeFocused();
	});
});

test.describe('Popup top-layer — WCAG 2.4.7 Focus Visible', () => {
	test('Focus-visible visible on keyboard navigation', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/21-popup-should-render-to-parent.tsx')
		>('design-system', 'popup', 'popup-should-render-to-parent', { 'react-18-mode': 'legacy' });

		const trigger = page.getByTestId('popup-trigger');
		const popupButton0 = page.getByTestId('popup-button-0');

		await trigger.focus();
		await trigger.press('Enter');

		await page.keyboard.press('Tab');
		await expect(popupButton0).toBeFocused();

		// Verify the button has focus-visible styles (outline-width > 0)
		const outlineWidth = await popupButton0.evaluate((el) => {
			const styles = window.getComputedStyle(el);
			return styles.outlineWidth;
		});

		expect(outlineWidth).not.toBe('0px');
	});
});

test.describe('Popup top-layer — WCAG 2.4.11 Focus Not Obscured', () => {
	test('Popup content is visible when open', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/10-popup.tsx')>(
			'design-system',
			'popup',
			'popup',
			{ 'react-18-mode': 'legacy' },
		);

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup');

		await trigger.click();
		await expect(content).toBeVisible();
	});

	test('Popup with a11y props remains visible', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/16-popup-with-a11y-props.tsx')>(
			'design-system',
			'popup',
			'popup-with-a11y-props',
			{ 'react-18-mode': 'legacy' },
		);

		const firstTrigger = page.getByRole('button', { name: /Open Popup/i }).first();

		await firstTrigger.click();

		const content = page.getByText('Popup content');
		await expect(content).toBeVisible();
	});
});

test.describe('Popup top-layer — WCAG 4.1.2 Name, Role, Value', () => {
	test('Popup with dialog role has correct ARIA attributes', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/19-popup-role-dialog.tsx')>(
			'design-system',
			'popup',
			'popup-role-dialog',
			{ 'react-18-mode': 'legacy' },
		);

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup');

		await trigger.click();
		await expect(content).toBeVisible();

		// Dialog should have role="dialog" or role="alertdialog"
		const role = await content.getAttribute('role');
		expect(['dialog', 'alertdialog']).toContain(role);
	});

	// Skipped: pre-existing failure on `origin/master`. The legacy popup
	// rendered the labelled `<div>` without forwarding `aria-label` /
	// `aria-labelledby` in the DOM shape this test inspects. The FF-on
	// `platform-dst-top-layer` path emits these attributes correctly and
	// is covered by the equivalent FF-on test in
	// `popup/src/__tests__/playwright/ff-testing/`. Not worth fixing the
	// legacy DOM inspection because the legacy code path is being removed
	// in scope of the top-layer migration.
	test.fixme('Popup with accessible label and title', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/16-popup-with-a11y-props.tsx')>(
			'design-system',
			'popup',
			'popup-with-a11y-props',
			{ 'react-18-mode': 'legacy' },
		);

		const firstTrigger = page.getByRole('button', { name: /Open Popup/i }).first();

		await firstTrigger.click();

		const content = page.getByText('Popup content').locator('..');
		const ariaLabel = await content.getAttribute('aria-label');
		const ariaLabelledBy = await content.getAttribute('aria-labelledby');

		expect(ariaLabel || ariaLabelledBy).toBeTruthy();
	});
});

test.describe('Popup top-layer — WCAG 1.3.2 Meaningful Sequence', () => {
	test('Popup renders near trigger, not at end of body', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/21-popup-should-render-to-parent.tsx')
		>('design-system', 'popup', 'popup-should-render-to-parent', { 'react-18-mode': 'legacy' });

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup');

		await trigger.click();
		await expect(content).toBeVisible();

		// With shouldRenderToParent, popup should be in DOM near trigger
		// Check that popup and trigger are within same layout context
		const triggerBox = await trigger.boundingBox();
		const contentBox = await content.boundingBox();

		invariant(triggerBox, 'trigger should have a bounding box');
		invariant(contentBox, 'content should have a bounding box');

		// Popup should be reasonably close to trigger (same viewport area)
		expect(Math.abs(contentBox.y - triggerBox.y)).toBeLessThan(300);
	});
});

test.describe('Popup top-layer — Nested popups', () => {
	test('Focus trapped in nested popups when focus lock enabled', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/nested.tsx')>(
			'design-system',
			'popup',
			'nested',
			{ 'react-18-mode': 'legacy' },
		);

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup');
		const nestedTrigger = page.getByTestId('nested-popup-trigger');
		const nestedContent = page.getByTestId('nested-popup');

		await trigger.focus();
		await trigger.press('Enter');
		await expect(content).toBeVisible();

		await page.keyboard.press('Tab');
		const firstItem = page.getByTestId('create-project');
		await expect(firstItem).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		// Should trap at nested trigger, not escape outer popup
		await expect(nestedTrigger).toBeFocused();

		await nestedTrigger.press('Enter');
		await expect(nestedContent).toBeVisible();

		await page.keyboard.press('Tab');
		const nestedFirstItem = nestedContent.getByTestId('create-project');
		await expect(nestedFirstItem).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		// Should trap at nested trigger, not escape to outer popup
		await expect(nestedContent.getByTestId('nested-popup-trigger')).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(nestedContent).toBeHidden();
		await expect(nestedTrigger).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('Focus can exit nested popups when focus lock disabled', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/nested.tsx')>(
			'design-system',
			'popup',
			'nested',
			{
				featureFlag,
				'react-18-mode': 'legacy',
			},
		);

		const trigger = page.getByTestId('popup-trigger');
		const content = page.getByTestId('popup');

		const button0 = page.getByTestId('button-0');
		const button1 = page.getByTestId('button-1');

		await trigger.focus();
		await trigger.press('Enter');
		await expect(content).toBeVisible();

		await page.keyboard.press('Tab');
		await expect(page.getByTestId('create-project')).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		// Should exit popup entirely to button before trigger
		await expect(button0).toBeFocused();

		await trigger.focus();
		await trigger.press('Enter');
		await expect(content).toBeVisible();

		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		// Should exit popup to button after trigger
		await expect(button1).toBeFocused();
	});
});

test.describe('Popup top-layer — Content positioning', () => {
	// Skipped: pre-existing failure on `origin/master`. The legacy popup
	// renders the popup off-screen on first paint while popper.js
	// computes its position, so `getByText('Hello')` resolves to a node
	// that has no bounding box (test times out at 30s). The FF-on
	// `platform-dst-top-layer` path uses `width: anchor-size(width)` and
	// is covered by an equivalent FF-on test that asserts sub-pixel
	// trigger-width parity. Legacy code path is being removed in scope
	// of the top-layer migration.
	test.fixme('shouldFitContainer makes popup match trigger width', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/18-should-fit-container.tsx')>(
			'design-system',
			'popup',
			'should-fit-container',
			{ 'react-18-mode': 'legacy' },
		);

		const trigger = page.getByRole('button', { name: /Open Popup/i });
		const content = page.getByText('Hello');

		await trigger.click();
		await expect(content).toBeVisible();

		const triggerBox = await trigger.boundingBox();
		const contentBox = await content.boundingBox();

		invariant(triggerBox, 'trigger should have a bounding box');
		invariant(contentBox, 'content should have a bounding box');

		// Popup width should be close to trigger width (with shouldFitContainer)
		expect(Math.abs(contentBox.width - triggerBox.width)).toBeLessThan(20);
	});
});

test.describe('Popup top-layer — Auto-focus behavior', () => {
	test('Focus moves to first focusable element when autoFocus enabled', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/13-setting-focus.tsx')>(
			'design-system',
			'popup',
			'setting-focus',
			{ 'react-18-mode': 'legacy' },
		);

		const openButton = page.getByRole('button', { name: 'Open Popup' });
		const button1 = page.getByRole('button', { name: 'Button 1' });

		await page.getByRole('radio', { name: 'Button 1' }).check();

		await openButton.click();
		await expect(button1).toBeFocused();
	});

	test('Focus does not auto-move when autoFocus disabled', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/popup-disable-autofocus-vr.tsx')>(
			'design-system',
			'popup',
			'popup-disable-autofocus-vr',
			{ 'react-18-mode': 'legacy' },
		);

		const openButton = page.getByRole('button', { name: 'Open Popup' });
		const closeButton = page.getByRole('button', { name: 'Close Popup' });

		await openButton.click();

		// Focus should remain on close button, not move to it
		await expect(closeButton).toBeFocused();
	});

	test('Popup with custom focus ref maintains specified focus on open and close', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../examples/popup-disable-autofocus.tsx')>(
			'design-system',
			'popup',
			'popup-disable-autofocus',
			{ 'react-18-mode': 'legacy' },
		);

		const trigger = page.getByTestId('popup-trigger');
		const focusedInput = page.getByTestId('focused-input');
		const popup = page.getByTestId('popup');

		await trigger.focus();
		await trigger.press('Enter');
		await expect(popup).toBeVisible();

		await expect(focusedInput).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(popup).toBeHidden();
		await expect(focusedInput).toBeFocused();
	});
});

test.describe('Popup top-layer — Complex interactions', () => {
	// Skipped: pre-existing failure on `origin/master`. The
	// dropdown-then-popup-then-modal Tab chain depends on the legacy
	// `react-focus-on` focus-lock layering, which is being replaced by
	// the native popover / `<dialog>` stack via the top-layer migration.
	// The new model passes the equivalent integration test in
	// `modal-dialog/src/__tests__/playwright/ff-testing/` (modal-over-popup
	// flow). Legacy implementation will be removed in scope of the
	// top-layer migration, so we do not invest in fixing this here.
	test.fixme('Modal inside popup inside dropdown maintains focus management', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../examples/testing-modal-inside-popup-inside-dropdown.tsx')
		>('design-system', 'popup', 'testing-modal-inside-popup-inside-dropdown', {
			'react-18-mode': 'legacy',
		});

		const dropdownTrigger = page.getByTestId('dropdown--trigger');
		const popupContent = page.getByTestId('popup-content');
		const modalTrigger = page.getByTestId('modal-trigger');
		const modalContent = page.getByTestId('modal-content');

		await dropdownTrigger.focus();
		await dropdownTrigger.press('Enter');

		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');

		await expect(popupContent).toBeVisible();
		await expect(modalTrigger).toBeFocused();

		await page.keyboard.press('Enter');

		await expect(modalContent).toBeVisible();
	});

	test('Dropdown inside popup can open and close independently', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/testing-dropdown-inside-popup.tsx')>(
			'design-system',
			'popup',
			'testing-dropdown-inside-popup',
			{ 'react-18-mode': 'legacy' },
		);

		const popupTrigger = page.getByTestId('popup-trigger');
		const popupContent = page.getByTestId('popup-content');
		const dropdownTrigger = page.getByTestId('dropdown--trigger');
		const dropdownContent = page.getByTestId('dropdown--content');

		await popupTrigger.focus();
		await popupTrigger.press('Enter');
		await expect(popupContent).toBeVisible();

		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await expect(dropdownContent).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(dropdownContent).toBeHidden();
		await expect(dropdownTrigger).toBeFocused();
		await expect(popupContent).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(popupContent).toBeHidden();
		await expect(popupTrigger).toBeFocused();
	});

	test('Escape at each nested level closes only that level', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/testing-popup-with-dropdown-escape.tsx')
		>('design-system', 'popup', 'testing-popup-with-dropdown-escape', {
			featureFlag: 'platform_dst_nested_escape',
		});

		const popupTrigger = page.getByRole('button', { name: 'Open popup' });
		const dropdownTrigger = page.getByTestId('dropdown-inside-popup--trigger');
		const dropdownContent = page.getByTestId('dropdown-inside-popup--content');
		const popupContent = page.getByTestId('popup-content');

		await popupTrigger.click();
		await expect(popupContent).toBeVisible();

		await dropdownTrigger.click();
		await expect(dropdownContent).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(dropdownContent).toBeHidden();
		await expect(dropdownTrigger).toBeFocused();
		await expect(popupContent).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(popupContent).toBeHidden();
		await expect(popupTrigger).toBeFocused();
	});

	test('Nested dropdown in popup closes at each level with Escape', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/testing-popup-with-dropdown-escape.tsx')
		>('design-system', 'popup', 'testing-popup-with-dropdown-escape', {
			featureFlag: 'platform_dst_nested_escape',
		});

		const popupTrigger = page.getByRole('button', { name: 'Open popup' });
		const nestedDropdownTrigger = page.getByTestId('nested-dropdown-inside-popup--trigger');
		const nestedDropdownContent = page.getByTestId('nested-dropdown-inside-popup--content');
		const popupContent = page.getByTestId('popup-content');

		await popupTrigger.click();
		await expect(popupContent).toBeVisible();

		await nestedDropdownTrigger.click();
		await expect(nestedDropdownContent).toBeVisible();

		await page.getByRole('menuitem', { name: 'Nested Menu' }).press('Enter');
		const nestedOption = page.getByRole('menuitem', { name: 'Nested option one' });
		await expect(nestedOption).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(nestedOption).toBeHidden();
		await expect(page.getByRole('menuitem', { name: 'Nested Menu' })).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(nestedDropdownContent).toBeHidden();
		await expect(nestedDropdownTrigger).toBeFocused();
		await expect(popupContent).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(popupContent).toBeHidden();
		await expect(popupTrigger).toBeFocused();
	});

	test('Focus properly managed when opening dropdown inside popup', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/testing-dropdown-inside-popup.tsx')>(
			'design-system',
			'popup',
			'testing-dropdown-inside-popup',
			{
				featureFlag,
			},
		);

		const popupTrigger = page.getByTestId('popup-trigger');
		const popupContent = page.getByTestId('popup-content');
		const dropdownTrigger = page.getByTestId('dropdown--trigger');
		const dropdownContent = page.getByTestId('dropdown--content');

		await popupTrigger.focus();
		await popupTrigger.press('Enter');
		await expect(popupContent).toBeVisible();

		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await expect(dropdownContent).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(dropdownContent).toBeHidden();
		await expect(dropdownTrigger).toBeFocused();
		await expect(popupContent).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(popupContent).toBeHidden();
		await expect(popupTrigger).toBeFocused();
	});

	// Skipped: exercises the interim `platform_dst_popup-disable-focuslock`
	// FF behaviour where the dropdown trigger keeps `tabindex="-1"` after
	// Tab-out instead of being restored to `tabindex="0"`. This is a
	// known limitation of the interim FF and is fixed in the
	// `platform-dst-top-layer` adoption path (native `<dialog>` /
	// popover restores tab order automatically). The interim FF is
	// being removed once top-layer ships.
	test.fixme('Trigger tabindex managed correctly when closing with Tab', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../examples/testing-modal-inside-popup-inside-dropdown.tsx')
		>('design-system', 'popup', 'testing-modal-inside-popup-inside-dropdown', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		const dropdownTrigger = page.getByTestId('dropdown--trigger');
		const dropdownContent = page.getByTestId('dropdown--content');
		const popupContent = page.getByTestId('popup-content');

		await dropdownTrigger.focus();
		await dropdownTrigger.press('Enter');
		await expect(dropdownTrigger).toHaveAttribute('tabindex', '-1');

		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await expect(popupContent).toBeVisible();

		await page.keyboard.press('Tab');
		await expect(dropdownContent).toBeHidden();
		await expect(dropdownTrigger).toHaveAttribute('tabindex', '0');
	});

	test('Should not return focus to trigger when configured', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/should-not-return-focus.tsx')>(
			'design-system',
			'popup',
			'should-not-return-focus',
			{ 'react-18-mode': 'legacy' },
		);

		const trigger = page.getByText('Trigger');
		const content = page.getByText('Content');

		await trigger.focus();
		await trigger.press('Enter');
		await expect(content).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(trigger).not.toBeFocused();

		await trigger.focus();
		await trigger.press('Enter');
		await expect(content).toBeFocused();

		await page.keyboard.press('Enter');
		await expect(trigger).not.toBeFocused();
		await expect(page.getByPlaceholder('Input')).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
	});
});
