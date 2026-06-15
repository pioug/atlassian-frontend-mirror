import { expect, test } from '@af/integration-testing';

/**
 * Flag: focus contract on the top-layer code path.
 *
 * `Flag` is an informational, non-modal overlay. Per the top-layer focus
 * rules, a flag's lifecycle must NEVER steal focus from the user's current
 * focus target. Specifically:
 *
 * 1. Showing a flag while another element is focused must not move focus.
 * 2. The flag may render with its own internal focusable controls
 *    (e.g. a dismiss button), but it must not auto-focus them.
 *
 * The third "focus movement within the layer" smoke test is intentionally
 * omitted: flags do not contain focusable navigation content the user steps
 * through with arrow keys.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('Flag: top-layer focus contract', () => {
	test('initial focus: showing a flag does not move focus', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'flag',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const externalInput = page.getByTestId('external-input');
		await externalInput.focus();
		await expect(externalInput).toBeFocused();

		const addFlag = page.getByTestId('add-flag-trigger');
		await addFlag.click();

		await expect(page.getByTestId('flag-1')).toBeVisible();

		// Click moved focus to the trigger; showing the flag must not steal it back.
		await expect(addFlag).toBeFocused();
	});

	test('focus restoration: showing a flag while an unrelated element is focused does not steal focus', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'flag',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const externalInput = page.getByTestId('external-input');
		const addFlag = page.getByTestId('add-flag-trigger');

		// Trigger the flag by keyboard so focus stays on the trigger button.
		await addFlag.focus();
		await page.keyboard.press('Enter');
		await expect(page.getByTestId('flag-1')).toBeVisible();

		// Move focus to the external input AFTER the flag is showing.
		await externalInput.focus();
		await expect(externalInput).toBeFocused();

		// Show another flag while the input is focused. Use `dispatchEvent`
		// so the trigger click does not itself move focus to the button (a
		// real `click()` would focus the trigger). The new flag must not
		// steal focus from the input.
		await addFlag.dispatchEvent('click');
		await expect(page.getByTestId('flag-2')).toBeVisible();

		await expect(externalInput).toBeFocused();
	});
});
