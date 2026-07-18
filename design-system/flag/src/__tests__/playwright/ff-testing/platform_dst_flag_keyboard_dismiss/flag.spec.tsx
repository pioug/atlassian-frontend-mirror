/* eslint-disable testing-library/prefer-screen-queries -- Playwright `page` locators, not RTL `render` */
import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform_dst_flag_keyboard_dismiss';

test.describe('Flag keyboard dismissal from an input', () => {
	test('feature gate off leaves the existing Escape behavior unchanged', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/22-flag-keyboard-dismiss-from-input.tsx')
		>('design-system', 'flag', 'flag-keyboard-dismiss-from-input');

		const input = page.getByRole('textbox', { name: 'Summary' });
		const flag = page.getByTestId('keyboard-dismiss-flag');

		await input.fill('Edited summary');
		await expect(flag).toBeVisible();
		await expect(input).toBeFocused();

		await page.keyboard.press('Escape');

		await expect(flag).toBeVisible();
		await expect(input).toHaveValue('Edited summary');
		await expect(input).toBeFocused();
	});

	test('Escape dismisses the flag without changing the input value or focus', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/22-flag-keyboard-dismiss-from-input.tsx')
		>('design-system', 'flag', 'flag-keyboard-dismiss-from-input', { featureFlag });

		const input = page.getByRole('textbox', { name: 'Summary' });
		const flag = page.getByTestId('keyboard-dismiss-flag');

		await input.fill('Edited summary');
		await expect(flag).toBeVisible();
		await expect(input).toBeFocused();

		await page.keyboard.press('Escape');

		await expect(flag).toBeHidden();
		await expect(input).toHaveValue('Edited summary');
		await expect(input).toBeFocused();
	});

	test('preventDefault keeps Escape ownership with the input', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/22-flag-keyboard-dismiss-from-input.tsx')
		>('design-system', 'flag', 'flag-keyboard-dismiss-from-input', { featureFlag });

		await page
			.getByRole('radio', { name: 'Prevent default — the input keeps Escape ownership' })
			.check();

		const input = page.getByRole('textbox', { name: 'Summary' });
		const flag = page.getByTestId('keyboard-dismiss-flag');

		await input.fill('Edited summary');
		await expect(flag).toBeVisible();
		await expect(input).toBeFocused();

		await page.keyboard.press('Escape');

		await expect(flag).toBeVisible();
		await expect(input).toHaveValue('Edited summary');
		await expect(input).toBeFocused();
	});
});
