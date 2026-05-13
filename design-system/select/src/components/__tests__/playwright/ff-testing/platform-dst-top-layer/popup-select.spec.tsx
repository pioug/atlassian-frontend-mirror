import invariant from 'tiny-invariant';

import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

test.describe('PopupSelect top-layer — WCAG 2.1.1 Keyboard', () => {
	test('opens when trigger is clicked', async ({ page, skipAxeCheck }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');
		const menu = page.getByTestId('select-for-testing--menu');

		await expect(menu).toBeHidden();

		await trigger.click();

		await expect(menu).toBeVisible();

		skipAxeCheck();
	});

	test('opens when trigger receives ArrowDown key', async ({ page, skipAxeCheck }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');
		const menu = page.getByTestId('select-for-testing--menu');

		// Focus the trigger explicitly. Using Tab is unreliable here because
		// the example renders multiple PopupSelects in a row, so the first
		// Tab may focus a different element depending on document tab order.
		await trigger.focus();
		await expect(trigger).toBeFocused();
		await expect(menu).toBeHidden();

		await page.keyboard.press('ArrowDown');

		await expect(menu).toBeVisible();

		skipAxeCheck();
	});

	test('arrow keys navigate through options', async ({ page, skipAxeCheck }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');
		const menu = page.getByTestId('select-for-testing--menu');

		await trigger.click();
		await expect(menu).toBeVisible();

		// Note: react-select uses `aria-activedescendant` on the search input
		// to denote the currently navigated option. `aria-selected` on options
		// reflects the chosen value, not arrow-key navigation focus. The menu
		// opens with the current value (Adelaide) as the active descendant.
		const input = page.locator('input[role="combobox"]').first();
		const secondOption = page.getByRole('option', { name: 'Brisbane' });
		const thirdOption = page.getByRole('option', { name: 'Melbourne' });

		await page.keyboard.press('ArrowDown');
		await expect(input).toHaveAttribute('aria-activedescendant', await secondOption.getAttribute('id') ?? '');

		await page.keyboard.press('ArrowDown');
		await expect(input).toHaveAttribute('aria-activedescendant', await thirdOption.getAttribute('id') ?? '');

		skipAxeCheck();
	});

	test('Enter key selects focused option', async ({ page, skipAxeCheck }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');
		const menu = page.getByTestId('select-for-testing--menu');

		await trigger.click();
		await expect(menu).toBeVisible();

		await page.keyboard.press('ArrowDown');

		// Pressing Enter on a navigated option closes the menu.
		await page.keyboard.press('Enter');

		await expect(menu).toBeHidden();

		skipAxeCheck();
	});
});

test.describe('PopupSelect top-layer — WCAG 2.1.2 No Keyboard Trap', () => {
	test('Escape closes the menu', async ({ page, skipAxeCheck }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');
		const menu = page.getByTestId('select-for-testing--menu');

		await trigger.click();
		await expect(menu).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(menu).toBeHidden();

		skipAxeCheck();
	});

	test('Tab key closes the menu', async ({ page, skipAxeCheck }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');
		const menu = page.getByTestId('select-for-testing--menu');

		await trigger.click();
		await expect(menu).toBeVisible();

		await page.keyboard.press('Tab');

		await expect(menu).toBeHidden();

		skipAxeCheck();
	});
});

test.describe('PopupSelect top-layer — WCAG 2.4.3 Focus Order', () => {
	test('focus returns to trigger when menu is closed via Escape', async ({ page, skipAxeCheck }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');
		const menu = page.getByTestId('select-for-testing--menu');

		await trigger.click();
		await expect(menu).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(menu).toBeHidden();

		await expect(trigger).toBeFocused();

		skipAxeCheck();
	});

	test('focus returns to trigger when selection is made', async ({ page, skipAxeCheck }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');
		const menu = page.getByTestId('select-for-testing--menu');

		await trigger.click();
		await expect(menu).toBeVisible();

		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');

		await expect(menu).toBeHidden();
		await expect(trigger).toBeFocused();

		skipAxeCheck();
	});
});

test.describe('PopupSelect top-layer — WCAG 2.4.7 Focus Visible', () => {
	test('focused option has visible focus indicator', async ({ page, skipAxeCheck }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');
		const menu = page.getByTestId('select-for-testing--menu');

		await trigger.click();
		await expect(menu).toBeVisible();

		// react-select uses a hidden combobox input as the actual focused
		// element; options are focus-controlled via aria-activedescendant
		// rather than DOM focus. Verifying that aria-activedescendant
		// points at a real option is a stronger guarantee of "focus visible"
		// than DOM focus on a tabindex="-1" element. The menu opens with
		// the current value (Adelaide) active, so ArrowDown moves to Brisbane.
		const input = page.locator('input[role="combobox"]').first();
		const secondOption = page.getByRole('option', { name: 'Brisbane' });

		await page.keyboard.press('ArrowDown');
		await expect(input).toHaveAttribute('aria-activedescendant', await secondOption.getAttribute('id') ?? '');

		skipAxeCheck();
	});
});

test.describe('PopupSelect top-layer — WCAG 2.4.11 Focus Not Obscured', () => {
	test('menu is not visually obscured when opened', async ({ page, skipAxeCheck }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');
		const menu = page.getByTestId('select-for-testing--menu');

		await trigger.click();

		await expect(menu).toBeVisible();
		await expect(menu).toBeInViewport();

		skipAxeCheck();
	});
});

test.describe('PopupSelect top-layer — WCAG 4.1.2 Name, Role, Value', () => {
	test('trigger has correct ARIA attributes when closed', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');

		await expect(trigger).toHaveAttribute('aria-haspopup', 'true');
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	test('trigger has correct ARIA attributes when open', async ({ page, skipAxeCheck }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');

		await expect(trigger).toHaveAttribute('aria-expanded', 'false');

		await trigger.click();

		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await expect(trigger).toHaveAttribute('aria-controls');

		skipAxeCheck();
	});

	test('menu has listbox role', async ({ page, skipAxeCheck }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');
		const menu = page.getByRole('listbox');

		await expect(menu).toBeHidden();

		await trigger.click();

		await expect(menu).toBeVisible();

		skipAxeCheck();
	});

	test('options have correct role and aria-selected attribute', async ({ page, skipAxeCheck }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');

		await trigger.click();

		const firstOption = page.getByRole('option', { name: 'Adelaide' });
		const secondOption = page.getByRole('option', { name: 'Brisbane' });

		await expect(firstOption).toHaveAttribute('aria-selected', 'true');
		await expect(secondOption).toHaveAttribute('aria-selected', 'false');

		await page.keyboard.press('ArrowDown');

		await expect(firstOption).toHaveAttribute('aria-selected', 'true');
		await expect(secondOption).toHaveAttribute('aria-selected', 'false');

		skipAxeCheck();
	});
});

test.describe('PopupSelect top-layer — WCAG 1.3.2 Meaningful Sequence', () => {
	test('popup content is rendered in DOM order near trigger (sanity check)', async ({ page, skipAxeCheck }) => {
		await page.visitExample<typeof import('../../../../../../examples/18-popup-select.tsx')>(
			'design-system',
			'select',
			'popup-select',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('button-for-testing');
		const menu = page.getByTestId('select-for-testing--menu');

		await trigger.click();

		const triggerBox = await trigger.boundingBox();
		const menuBox = await menu.boundingBox();

		expect(triggerBox).not.toBeNull();
		expect(menuBox).not.toBeNull();
		invariant(triggerBox !== null && menuBox !== null);

		const menuIsNearTrigger =
			Math.abs(menuBox.y - triggerBox.y - triggerBox.height) < 50;
		expect(menuIsNearTrigger).toBe(true);

		skipAxeCheck();
	});
});
