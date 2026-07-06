import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

test.describe('Drawer top-layer: open / close', () => {
	test('opens on trigger click as a native dialog', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/02-drawer-default.tsx')>(
			'design-system',
			'drawer',
			'drawer-default',
			{ featureFlag },
		);

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeHidden();

		await page.getByTestId('drawer-trigger').click();

		await expect(dialog).toBeVisible();
	});

	test('opens via Enter key on the trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/02-drawer-default.tsx')>(
			'design-system',
			'drawer',
			'drawer-default',
			{ featureFlag },
		);

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeHidden();

		await page.getByTestId('drawer-trigger').focus();
		await page.keyboard.press('Enter');

		await expect(dialog).toBeVisible();
	});

	test('opens via Space key on the trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/02-drawer-default.tsx')>(
			'design-system',
			'drawer',
			'drawer-default',
			{ featureFlag },
		);

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeHidden();

		await page.getByTestId('drawer-trigger').focus();
		await page.keyboard.press('Space');

		await expect(dialog).toBeVisible();
	});

	test('closes when Escape is pressed', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/02-drawer-default.tsx')>(
			'design-system',
			'drawer',
			'drawer-default',
			{ featureFlag },
		);

		const dialog = page.getByRole('dialog');
		await page.getByTestId('drawer-trigger').click();
		await expect(dialog).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(dialog).toBeHidden();
	});

	test('closes when the backdrop is clicked', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/02-drawer-default.tsx')>(
			'design-system',
			'drawer',
			'drawer-default',
			{ featureFlag },
		);

		const dialog = page.getByRole('dialog');
		await page.getByTestId('drawer-trigger').click();
		await expect(dialog).toBeVisible();

		// Click the backdrop area to the right of the edge-pinned panel.
		const box = await dialog.boundingBox();
		await page.mouse.click((box?.x ?? 0) + (box?.width ?? 0) + 100, (box?.y ?? 0) + 50);

		await expect(dialog).toBeHidden();
	});

	test('closes via the close button', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/02-drawer-default.tsx')>(
			'design-system',
			'drawer',
			'drawer-default',
			{ featureFlag },
		);

		const dialog = page.getByRole('dialog');
		await page.getByTestId('drawer-trigger').click();
		await expect(dialog).toBeVisible();

		await page.getByTestId('DrawerCloseButton').click();

		await expect(dialog).toBeHidden();
	});

	test('locks background scroll while open and restores it on close', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/02-drawer-default.tsx')>(
			'design-system',
			'drawer',
			'drawer-default',
			{ featureFlag },
		);

		const dialog = page.getByRole('dialog');
		const overflowBefore = await page.evaluate(() => document.body.style.overflow);

		await page.getByTestId('drawer-trigger').click();
		await expect(dialog).toBeVisible();
		// `DialogScrollLock` sets `overflow: hidden` on the body while open (native
		// modality alone does not lock scroll).
		await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');

		await page.keyboard.press('Escape');
		await expect(dialog).toBeHidden();
		// Released once the exit settles and the subtree unmounts.
		await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(overflowBefore);
	});
});

test.describe('Drawer top-layer: focus management', () => {
	test('moves initial focus to the close button on open', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/02-drawer-default.tsx')>(
			'design-system',
			'drawer',
			'drawer-default',
			{ featureFlag },
		);

		await page.getByTestId('drawer-trigger').click();

		await expect(page.getByTestId('DrawerCloseButton')).toBeFocused();
	});

	test('traps Tab focus within the dialog', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/02-drawer-default.tsx')>(
			'design-system',
			'drawer',
			'drawer-default',
			{ featureFlag },
		);

		await page.getByTestId('drawer-trigger').click();
		const closeButton = page.getByTestId('DrawerCloseButton');
		await expect(closeButton).toBeFocused();

		// The close button is the only focusable element; Tab wraps back to it
		// rather than escaping to the inert background.
		await page.keyboard.press('Tab');
		await expect(closeButton).toBeFocused();
	});

	test('keeps focus inside, the trigger is inert while open', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/02-drawer-default.tsx')>(
			'design-system',
			'drawer',
			'drawer-default',
			{ featureFlag },
		);

		const trigger = page.getByTestId('drawer-trigger');
		await trigger.click();
		// Background is inert under showModal(): focusing the trigger is a no-op.
		await trigger.focus();
		await expect(trigger).not.toBeFocused();
	});

	test('returns focus to the trigger on close (default)', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/02-drawer-default.tsx')>(
			'design-system',
			'drawer',
			'drawer-default',
			{ featureFlag },
		);

		const trigger = page.getByTestId('drawer-trigger');
		await trigger.click();
		await page.getByTestId('DrawerCloseButton').click();

		await expect(trigger).toBeFocused();
	});

	test('returns focus to a custom ref on close (shouldReturnFocus={ref})', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/12-drawer-focus-to-ref-on-close.tsx')
		>('design-system', 'drawer', 'drawer-focus-to-ref-on-close', { featureFlag });

		await page.getByRole('button', { name: 'Open drawer' }).click();
		await page.getByTestId('DrawerCloseButton').click();

		await expect(page.getByRole('button', { name: 'Focused on drawer close' })).toBeFocused();
	});
});

test.describe('Drawer top-layer: stacked drawers', () => {
	test('supports nested stacked drawers', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/40-stacked-drawers.tsx')>(
			'design-system',
			'drawer',
			'stacked-drawers',
			{ featureFlag },
		);

		await page.getByRole('button', { name: 'Open drawer' }).click();
		await expect(page.getByText('Drawer contents')).toBeVisible();

		await page.getByRole('button', { name: 'Open Nested drawer' }).click();
		await expect(page.getByText('Nested Drawer Content')).toBeVisible();

		await expect(page.getByRole('dialog')).toHaveCount(2);
	});

	test('Escape closes the topmost drawer first', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/40-stacked-drawers.tsx')>(
			'design-system',
			'drawer',
			'stacked-drawers',
			{ featureFlag },
		);

		await page.getByRole('button', { name: 'Open drawer' }).click();
		await page.getByRole('button', { name: 'Open Nested drawer' }).click();
		await expect(page.getByRole('dialog')).toHaveCount(2);

		await page.keyboard.press('Escape');

		// Only the nested (topmost) drawer closes; the first stays open.
		await expect(page.getByText('Nested Drawer Content')).toBeHidden();
		await expect(page.getByText('Drawer contents')).toBeVisible();
		await expect(page.getByRole('dialog')).toHaveCount(1);
	});

	test('returns focus to the correct trigger as each stacked drawer closes', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/40-stacked-drawers.tsx')>(
			'design-system',
			'drawer',
			'stacked-drawers',
			{ featureFlag },
		);

		const outerTrigger = page.getByRole('button', { name: 'Open drawer' });
		// The nested trigger lives inside the first drawer's content.
		const nestedTrigger = page.getByRole('button', { name: 'Open Nested drawer' });
		const dialogs = page.getByRole('dialog');

		await outerTrigger.click();
		await expect(dialogs).toHaveCount(1);

		await nestedTrigger.click();
		await expect(dialogs).toHaveCount(2);

		// Closing the nested (topmost) drawer restores focus to the trigger that
		// opened it — native `<dialog>.close()` always returns focus to the
		// element focused before `showModal()` ran.
		await page.keyboard.press('Escape');
		await expect(dialogs).toHaveCount(1);
		await expect(nestedTrigger).toBeFocused();

		// Closing the first drawer restores focus to its (outer) trigger.
		await page.keyboard.press('Escape');
		await expect(dialogs).toHaveCount(0);
		await expect(outerTrigger).toBeFocused();
	});
});
