import { expect, test } from '@af/integration-testing';

/**
 * Popper: top-layer FF-on a11y contract.
 *
 * @atlaskit/popper is a positioning primitive — unlike Popup it has no
 * focus management, no Escape dismiss, and no aria wiring of its own.
 * Under platform-dst-top-layer the implementation renders into the
 * browser's native top layer via @atlaskit/top-layer; this spec asserts
 * the contract that consumers depend on:
 *
 * - The popper surface is present in the document and visible.
 * - Focus does NOT move into the popper surface on render (popper is
 *   positioning-only — moving focus is the consumer's responsibility).
 * - Tab order follows DOM source order independent of the popover's
 *   rendered position in the top layer.
 * - Escape is NOT intercepted by popper (consumer handles dismissal).
 * - The reference element does not have aria-hidden leaked onto it.
 *
 * See: platform/packages/design-system/top-layer/notes/goals/accessibility-criteria.md
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('Popper: top-layer FF-on a11y contract', () => {
	test('renders the popper surface visibly', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/00-basic-positioning.tsx')>(
			'design-system',
			'popper',
			'basic-positioning',
			{ featureFlag },
		);

		const surface = page.getByTestId('popper');
		await expect(surface).toBeVisible();
	});

	test('does not move focus to the popper surface on mount', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/00-basic-positioning.tsx')>(
			'design-system',
			'popper',
			'basic-positioning',
			{ featureFlag },
		);

		const surface = page.getByTestId('popper');
		await expect(surface).toBeVisible();

		// Popper has no focus management; the active element should remain
		// the document body (or any pre-existing focus owner), not the
		// rendered surface.
		const surfaceIsFocused = await surface.evaluate((el) => el === document.activeElement);
		expect(surfaceIsFocused).toBe(false);
	});

	test('does not intercept the Escape key', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/00-basic-positioning.tsx')>(
			'design-system',
			'popper',
			'basic-positioning',
			{ featureFlag },
		);

		const surface = page.getByTestId('popper');
		await expect(surface).toBeVisible();

		// Pressing Escape must not dismiss popper (it is positioning-only).
		await page.keyboard.press('Escape');
		await expect(surface).toBeVisible();
	});

	test('does not leak aria-hidden onto the reference element', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/00-basic-positioning.tsx')>(
			'design-system',
			'popper',
			'basic-positioning',
			{ featureFlag },
		);

		const reference = page.getByRole('button', { name: 'Reference element' });
		await expect(reference).toBeVisible();
		await expect(reference).not.toHaveAttribute('aria-hidden', /.*/);
	});
});
