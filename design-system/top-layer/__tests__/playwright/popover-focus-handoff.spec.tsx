import { expect, type Locator, type Page, test } from '@af/integration-testing';

async function activateWithKeyboard({ page, button }: { page: Page; button: Locator }) {
	// Keyboard activation also focuses the button on WebKit.
	await button.focus();
	await expect(button).toBeFocused();
	await page.keyboard.press('Enter');
}

async function openNestedPopover({ page, role }: { page: Page; role: 'note' | 'dialog' }) {
	const trigger = page.getByRole('button', { name: `Open nested ${role}` });
	await activateWithKeyboard({ page, button: trigger });
	await expect(page.getByTestId('nested-popover')).toBeVisible();
	return trigger;
}

async function expectFirstMenuClosed({ page }: { page: Page }) {
	// Detachment waits for close handling, not just native hiding.
	await expect(
		page.getByRole('dialog', { name: 'First menu', includeHidden: true }),
	).not.toBeAttached();
}

async function expectNestedPopoverClosed({ page }: { page: Page }) {
	await expect(page.getByTestId('nested-popover')).not.toBeAttached();
}

test.beforeEach(async ({ page }) => {
	await page.visitExample<typeof import('../../examples/165-testing-popover-focus-handoff.tsx')>(
		'design-system',
		'top-layer',
		'testing-popover-focus-handoff',
	);

	await activateWithKeyboard({
		page,
		button: page.getByRole('button', { name: 'Open first menu' }),
	});
	await expect(page.getByRole('button', { name: 'Open second menu' })).toBeFocused();
});

test('preserves focus moved outside before a controlled close', async ({ page }) => {
	const outside = page.getByRole('button', { name: 'Close from outside' });
	await activateWithKeyboard({ page, button: outside });

	await expectFirstMenuClosed({ page });
	await expect(outside).toBeFocused();
});

test('preserves focus in a replacement menu after the outgoing menu closes', async ({ page }) => {
	await page.keyboard.press('Enter');

	// Wait for the outgoing menu to close before asserting the replacement focus.
	await expectFirstMenuClosed({ page });
	await expect(page.getByRole('button', { name: 'Second menu action' })).toBeFocused();
});

test('still restores focus when closing from inside the menu', async ({ page }) => {
	await page.keyboard.press('Tab');
	await expect(page.getByRole('button', { name: 'Close first menu' })).toBeFocused();
	await page.keyboard.press('Enter');

	await expectFirstMenuClosed({ page });
	await expect(page.getByRole('button', { name: 'Open first menu' })).toBeFocused();
});

test('preserves focus already on body before a controlled close', async ({ page }) => {
	const close = page.getByRole('button', { name: 'Close first menu' });
	await close.focus();
	await close.evaluate((button) => {
		if (!(button instanceof HTMLElement)) {
			throw new Error('Expected a close button');
		}
		button.blur();
		if (button.ownerDocument.activeElement !== button.ownerDocument.body) {
			throw new Error('Expected focus on body before closing');
		}
		// Programmatic activation closes through React without focusing the button again.
		button.click();
	});

	await expectFirstMenuClosed({ page });
	await expect(page.locator('body')).toBeFocused();
});

test('restores focus after focus enters a role that does not autofocus', async ({ page }) => {
	const trigger = await openNestedPopover({ page, role: 'note' });
	await expect(trigger).toBeFocused();
	const close = page.getByRole('button', { name: 'Close nested popover' });
	await close.focus();
	await expect(close).toBeFocused();
	// Manual mode has no native restoration, so this exercises the custom fallback.
	await page.keyboard.press('Enter');

	await expectNestedPopoverClosed({ page });
	await expect(trigger).toBeFocused();
});

test.describe('Nested dialog focus restoration', () => {
	test.beforeEach(async ({ page }) => {
		await openNestedPopover({ page, role: 'dialog' });
		await expect(page.getByRole('button', { name: 'Close nested popover' })).toBeFocused();
	});

	test('restores focus when programmatically closed from inside', async ({ page }) => {
		// Manual mode has no native restoration, so this exercises the custom fallback.
		await page.keyboard.press('Enter');

		await expectNestedPopoverClosed({ page });
		await expect(page.getByRole('button', { name: 'Open nested dialog' })).toBeFocused();
	});

	test('preserves focus transferred to another parent button during closing', async ({ page }) => {
		const close = page.getByRole('button', { name: 'Close and focus parent' });
		const target = page.getByTestId('parent-destination');
		await activateWithKeyboard({ page, button: close });

		await expectNestedPopoverClosed({ page });
		// The fixture records focus before the component's toggle listener runs.
		await expect(target).toHaveAttribute('data-focus-before-restore', 'true');
		await expect(target).toBeFocused();
	});

	test('preserves focus transferred to an element outside the parent during closing', async ({
		page,
	}) => {
		const close = page.getByRole('button', { name: 'Close and focus outside' });
		const target = page.getByTestId('outside-destination');
		await activateWithKeyboard({ page, button: close });

		await expectNestedPopoverClosed({ page });
		// The fixture records focus before the component's toggle listener runs.
		await expect(target).toHaveAttribute('data-focus-before-restore', 'true');
		await expect(target).toBeFocused();
	});
});
