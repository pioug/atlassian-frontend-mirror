import { expect, test } from '@af/integration-testing';

/**
 * Spotlight: focus contract on the top-layer code path.
 *
 * `SpotlightCard` renders as a `role="dialog"` popover. The focus contract is:
 *
 * 1. Initial focus moves to the first focusable element on open (the dismiss
 *    control in the spotlight header).
 * 2. Escape closes the spotlight and restores focus to the trigger.
 * 3. Tab moves focus between focusable elements within the spotlight.
 *
 * The legacy `initial-focus.spec.tsx` has been superseded by this spec.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer-spotlight';

test.beforeEach(async ({ skipAxeCheck }) => {
	skipAxeCheck();
});

test.describe('Spotlight: top-layer focus contract', () => {
	test('initial focus: focus moves to the dismiss control on open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-initial-focus-matrix.tsx')>(
			'design-system',
			'spotlight',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('default-spotlight-trigger').click();

		const spotlight = page.getByTestId('default-spotlight');
		await expect(spotlight).toBeVisible();

		const dismiss = spotlight.getByRole('button', { name: /dismiss|close/i });
		await expect(dismiss).toBeFocused();
	});

	test('focus restoration: Escape restores focus to the trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-initial-focus-matrix.tsx')>(
			'design-system',
			'spotlight',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		const trigger = page.getByTestId('default-spotlight-trigger');
		await trigger.click();
		await expect(page.getByTestId('default-spotlight')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.getByTestId('default-spotlight')).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('initial focus: native [autofocus] element wins over the first focusable element', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-initial-focus-matrix.tsx')>(
			'design-system',
			'spotlight',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('autofocus-spotlight-trigger').click();

		await expect(page.getByTestId('autofocus-spotlight')).toBeVisible();
		await expect(page.getByTestId('autofocus-spotlight-input')).toBeFocused();
	});

	test('focus movement: Tab moves focus between focusable elements within the spotlight', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-initial-focus-matrix.tsx')>(
			'design-system',
			'spotlight',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('default-spotlight-trigger').click();
		const spotlight = page.getByTestId('default-spotlight');
		await expect(spotlight).toBeVisible();

		const dismiss = spotlight.getByRole('button', { name: /dismiss|close/i });
		await expect(dismiss).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(page.getByTestId('default-spotlight-primary')).toBeFocused();
	});
});
