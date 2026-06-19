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
	test('escapes an `overflow: hidden` scroll container', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../examples/testing-menu-portal-overflow.tsx')
		>('design-system', 'react-select', 'testing-menu-portal-overflow', { featureFlag });

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
});
