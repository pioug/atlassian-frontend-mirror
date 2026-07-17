import { expect, test } from '@af/integration-testing';

/**
 * Tooltip: focus contract on the top-layer code path.
 *
 * `Tooltip` renders a `role="tooltip"` overlay. Per WCAG 1.4.13 (Content on
 * Hover or Focus) and the top-layer focus rules, opening or closing a tooltip
 * must NEVER move focus.
 *
 * The third "focus movement within the layer" smoke test is intentionally
 * omitted: tooltip content is non-interactive and contains no focusable
 * elements.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer-tooltip';

test.describe('Tooltip: top-layer focus contract', () => {
	test('initial focus: opening the tooltip does not move focus', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'tooltip',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const externalInput = page.getByTestId('external-input');
		await externalInput.focus();
		await expect(externalInput).toBeFocused();

		await page.getByTestId('tooltip-trigger').hover();
		await expect(page.getByTestId('tooltip')).toBeVisible();

		await expect(externalInput).toBeFocused();
	});

	test('focus restoration: closing the tooltip does not move focus', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'tooltip',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const externalInput = page.getByTestId('external-input');
		await externalInput.focus();
		await expect(externalInput).toBeFocused();

		await page.getByTestId('tooltip-trigger').hover();
		await expect(page.getByTestId('tooltip')).toBeVisible();
		await expect(externalInput).toBeFocused();

		await page.mouse.move(0, 0);
		await expect(page.getByTestId('tooltip')).toBeHidden();
		await expect(externalInput).toBeFocused();
	});
});
