import invariant from 'tiny-invariant';

import { expect, type Page, test } from '@af/integration-testing';

/**
 * Top-layer-specific contract tests for `react-select`'s `MenuPortal`.
 *
 * Runs with `platform-dst-top-layer` ON. Covers:
 * - clipping escape (overflow/transform ancestors)
 * - stacking against a modal dialog
 * - WCAG 4.1.2 combobox/listbox ARIA wiring
 */

const featureFlag = 'platform-dst-top-layer';

async function openMenu(page: Page, name = 'City') {
	const combobox = page.getByRole('combobox', { name });
	await combobox.focus();
	await page.keyboard.press('ArrowDown');
	return combobox;
}

test.describe('react-select MenuPortal - top-layer-specific contracts', () => {
	test('Escape closes an initially open menu while focus is outside Select', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../examples/34-menu-no-portal-config.vr.ap.tsx')
		>('design-system', 'react-select', 'menu-no-portal-config', { featureFlag });

		const combobox = page.getByRole('combobox', { name: 'City' });
		const listbox = page.getByRole('listbox');
		await expect(listbox).toBeVisible();
		await expect(combobox).toHaveAttribute('aria-expanded', 'true');
		await expect(page.locator('body')).toBeFocused();

		await page.keyboard.press('Escape');

		await expect(listbox).toBeHidden();
		await expect(combobox).toHaveAttribute('aria-expanded', 'false');
	});

	test('Escape closes the menu when focus is inside its listbox', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../examples/34-menu-no-portal-config.vr.ap.tsx')
		>('design-system', 'react-select', 'menu-no-portal-config', { featureFlag });
		const combobox = page.getByRole('combobox', { name: 'City' });
		const listbox = page.getByRole('listbox');
		await listbox.focus();
		await expect(listbox).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(listbox).toBeHidden();
		await expect(combobox).toHaveAttribute('aria-expanded', 'false');
	});

	test('escapes an `overflow: hidden` scroll container', async ({ page }) => {
		await page.visitExample<typeof import('../../../../examples/testing-menu-portal-overflow.tsx')>(
			'design-system',
			'react-select',
			'testing-menu-portal-overflow',
			{ featureFlag },
		);

		await openMenu(page);
		const listbox = page.getByRole('listbox');
		await expect(listbox).toBeVisible();

		// Top-layer popovers paint outside any clipping ancestor. If the menu
		// were clipped by `overflow: hidden`, its bottom edge would be capped
		// at the clip container's bottom.
		const listboxBox = await listbox.boundingBox();
		const clipBox = await page.getByTestId('clip-container').boundingBox();
		invariant(listboxBox, 'expected listbox to have a bounding box');
		invariant(clipBox, 'expected clip-container to have a bounding box');
		expect(listboxBox.y + listboxBox.height).toBeGreaterThan(clipBox.y + clipBox.height);
	});

	test('stacks above a modal-dialog', async ({ page }) => {
		await page.visitExample<typeof import('../../../../examples/testing-menu-portal-in-modal.tsx')>(
			'design-system',
			'react-select',
			'testing-menu-portal-in-modal',
			{ featureFlag },
		);

		await page.getByTestId('open-modal').click();
		await expect(page.getByTestId('modal')).toBeVisible();

		await openMenu(page);
		const listbox = page.getByRole('listbox');
		await expect(listbox).toBeVisible();

		// Pick an option through the popover - if stacking is wrong, the
		// modal swallows the keyboard activation.
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');
		await expect(listbox).toBeHidden();
		await expect(page.getByText('Brisbane', { exact: true })).toBeVisible();
	});

	test('combobox carries the correct ARIA wiring (haspopup, expanded, controls)', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = page.getByRole('combobox', { name: 'City' });
		await expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');
		await expect(combobox).toHaveAttribute('aria-expanded', 'false');

		await openMenu(page);
		await expect(page.getByRole('listbox')).toBeVisible();
		await expect(combobox).toHaveAttribute('aria-expanded', 'true');
		await expect(combobox).toHaveAttribute('aria-controls', /.+/);
	});

	test('typing filters options inside the popover', async ({ page }) => {
		await page.visitExample<typeof import('../../../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = await openMenu(page);
		await combobox.fill('Bri');

		await expect(page.getByRole('option', { name: 'Brisbane' })).toBeVisible();
		await expect(page.getByRole('option', { name: 'Adelaide' })).toHaveCount(0);
	});

	test('clicking outside a standalone Select closes its menu', async ({ page }) => {
		await page.visitExample<typeof import('../../../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		await openMenu(page);
		await page.getByTestId('before-button').click();
		await expect(page.getByRole('listbox')).toHaveCount(0);
	});

	test('keeps an already-focused input open while editing its text', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../examples/testing-top-layer-nested-popover.tsx')
		>('design-system', 'react-select', 'testing-top-layer-nested-popover', { featureFlag });

		await page.getByRole('button', { name: 'Open outer popover' }).click();
		const combobox = await openMenu(page);
		await combobox.fill('Bri');
		const listbox = page.getByRole('listbox');
		expect(
			await listbox.evaluate((element) => element.closest('[popover]')?.getAttribute('popover')),
		).toBe('manual');
		await combobox.click();
		await expect(page.getByRole('listbox')).toBeVisible();
		await expect(combobox).toHaveValue('Bri');
		await expect(combobox).toBeFocused();
		await expect(page.getByTestId('menu-close-count')).toHaveText('0');

		const caretPosition = await combobox.evaluate(
			(element: HTMLInputElement) => element.selectionStart,
		);
		expect(caretPosition).not.toBeNull();
		await combobox.press('s');
		await expect(combobox).toHaveValue(
			`Bri`.slice(0, caretPosition ?? 0) + `s` + `Bri`.slice(caretPosition ?? 0),
		);

		await combobox.selectText();
		await expect(combobox).toHaveJSProperty('selectionStart', 0);
		await expect(combobox).toHaveJSProperty('selectionEnd', 4);
		await combobox.pressSequentially('Ade');
		await expect(combobox).toHaveValue('Ade');
		await expect(page.getByRole('listbox')).toBeVisible();
		await combobox.dblclick();
		await expect(combobox).toHaveJSProperty('selectionStart', 0);
		await expect(combobox).toHaveJSProperty('selectionEnd', 3);
		await expect(combobox).toHaveValue('Ade');
		await expect(page.getByRole('listbox')).toBeVisible();
		await expect(page.getByTestId('menu-close-count')).toHaveText('0');
	});

	test('Escape closes a nested Select menu without closing its containing popover', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../examples/testing-top-layer-nested-popover.tsx')
		>('design-system', 'react-select', 'testing-top-layer-nested-popover', { featureFlag });

		await page.getByRole('button', { name: 'Open outer popover' }).click();
		const outerPopover = page.getByTestId('outer-popover');
		await expect(outerPopover).toHaveJSProperty('popover', 'auto');
		expect(await outerPopover.evaluate((element) => element.matches(':popover-open'))).toBe(true);

		const combobox = await openMenu(page);
		await expect(page.getByRole('listbox')).toBeVisible();

		await combobox.fill('Bri');
		await combobox.click();
		await combobox.click();
		await expect(combobox).toHaveValue('Bri');
		await expect(page.getByTestId('menu-close-count')).toHaveText('0');

		await page.keyboard.press('Escape');

		await expect(page.getByRole('listbox')).toHaveCount(0);
		await expect(combobox).toHaveAttribute('aria-expanded', 'false');
		expect(await outerPopover.evaluate((element) => element.matches(':popover-open'))).toBe(true);
		await expect(page.getByTestId('parent-escape-count')).toHaveText('1');
		await expect(page.getByTestId('menu-close-count')).toHaveText('1');

		await page.keyboard.press('Escape');
		await expect(page.getByTestId('parent-escape-count')).toHaveText('2');
		expect(await outerPopover.evaluate((element) => element.matches(':popover-open'))).toBe(false);
	});

	test('keeps its parent open for menu and input interactions', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../examples/testing-top-layer-nested-popover.tsx')
		>('design-system', 'react-select', 'testing-top-layer-nested-popover', { featureFlag });

		await page.getByRole('button', { name: 'Open outer popover' }).click();
		const outerPopover = page.getByTestId('outer-popover');
		const combobox = await openMenu(page);
		await combobox.fill('Bri');
		await combobox.click();
		await expect(outerPopover).toBeVisible();
		await expect(page.getByRole('listbox')).toBeVisible();

		await page.getByRole('option', { name: 'Brisbane' }).click();
		await expect(page.getByRole('listbox')).toHaveCount(0);
		await expect(combobox).toHaveValue('');
		await expect(page.getByText('Brisbane', { exact: true })).toBeVisible();
		await expect(page.getByTestId('menu-close-count')).toHaveText('1');
		expect(await outerPopover.evaluate((element) => element.matches(':popover-open'))).toBe(true);
	});

	test('closes only Select inside its parent and both popovers outside it', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../examples/testing-top-layer-nested-popover.tsx')
		>('design-system', 'react-select', 'testing-top-layer-nested-popover', { featureFlag });

		await page.getByRole('button', { name: 'Open outer popover' }).click();
		const outerPopover = page.getByTestId('outer-popover');
		await openMenu(page);
		await page.getByTestId('parent-popover-content').click();
		await expect(page.getByRole('listbox')).toHaveCount(0);
		await expect(page.getByTestId('menu-close-count')).toHaveText('1');
		expect(await outerPopover.evaluate((element) => element.matches(':popover-open'))).toBe(true);
		await page.getByTestId('parent-popover-content').click();
		await expect(page.getByTestId('menu-close-count')).toHaveText('1');

		await openMenu(page);
		await page.getByTestId('outside-popovers').click();
		await expect(page.getByRole('listbox')).toHaveCount(0);
		expect(await outerPopover.evaluate((element) => element.matches(':popover-open'))).toBe(false);
	});

	test('removes dismissal handling when Select unmounts', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../examples/testing-top-layer-nested-popover.tsx')
		>('design-system', 'react-select', 'testing-top-layer-nested-popover', { featureFlag });

		await page.getByRole('button', { name: 'Open outer popover' }).click();
		await openMenu(page);
		await page.keyboard.press('u');
		await expect(page.getByRole('combobox', { name: 'City' })).toHaveCount(0);
		await page.getByTestId('parent-popover-content').click();
		await expect(page.getByTestId('menu-close-count')).toHaveText('0');
	});
});
