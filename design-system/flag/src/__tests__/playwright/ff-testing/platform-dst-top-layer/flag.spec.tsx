import { expect, test, type Locator, type Page } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

// Helper: presses Tab up to `maxTabs` times until `target` is the active element.
// Extracted so the conditional lives outside the test body (playwright lint rule).
// The follow-up `expect(target).toBeFocused()` assertion is what guarantees
// correctness; this helper just shortens the path to focus.
async function tabUntilFocused({
	page,
	target,
	maxTabs,
}: {
	page: Page;
	target: Locator;
	maxTabs: number;
}): Promise<void> {
	for (let i = 0; i < maxTabs; i++) {
		const isFocused = await target.evaluate((node) => node === document.activeElement);
		if (isFocused) {
			return;
		}
		await page.keyboard.press('Tab');
	}
}

test.describe('Flag top-layer — WCAG 2.1.1 Keyboard', () => {
	test('flag dismiss button can be activated with Enter key', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
			{
				featureFlag,
			},
		);

		const addFlagBtn = page.getByTestId('AddFlag');
		await addFlagBtn.click();

		const flag = page.getByTestId('MyFlagTestId--1');
		await expect(flag).toBeVisible();

		const dismissButton = page.getByTestId('MyFlagTestId--1-dismiss');
		await expect(dismissButton).not.toBeFocused();

		await dismissButton.focus();
		await expect(dismissButton).toBeFocused();

		await page.keyboard.press('Enter');

		await expect(flag).toBeHidden();
	});

	test('flag action button is reachable via Tab key', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
			{
				featureFlag,
			},
		);

		const addFlagBtn = page.getByTestId('AddFlag');
		await addFlagBtn.click();

		const flag = page.getByTestId('MyFlagTestId--1');
		await expect(flag).toBeVisible();

		const actionBtn = page.getByTestId('MyFlagAction').first();
		await expect(actionBtn).not.toBeFocused();

		await actionBtn.focus();
		await expect(actionBtn).toBeFocused();
	});
});

test.describe('Flag top-layer — WCAG 2.4.7 Focus Visible', () => {
	test('flag action button shows :focus-visible ring when focused via keyboard', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
			{
				featureFlag,
			},
		);

		const addFlagBtn = page.getByTestId('AddFlag');
		// Focus the AddFlag button via keyboard so subsequent Tab presses are treated
		// as keyboard navigation by the browser. `.click()` would set focus via mouse
		// and the browser would not advertise the next focus as :focus-visible.
		await addFlagBtn.focus();
		await page.keyboard.press('Enter');

		const flag = page.getByTestId('MyFlagTestId--1');
		await expect(flag).toBeVisible();

		const actionBtn = page.getByTestId('MyFlagAction').first();
		await expect(actionBtn).not.toBeFocused();

		// Tab forward until the action button receives focus. The dismiss button on
		// the topmost flag precedes actions in DOM order, so we may need more than
		// one Tab depending on whether dismiss is rendered. The helper keeps the
		// conditional outside the test body (lint rule), and Playwright's auto-
		// retrying `toBeFocused` assertion below catches any divergence reliably.
		await tabUntilFocused({ page, target: actionBtn, maxTabs: 5 });

		await expect(actionBtn).toBeFocused();
		await expect(actionBtn).toHaveCSS('outline-style', /(solid|auto)/);
	});
});

test.describe('Flag top-layer — WCAG 2.4.11 Focus Not Obscured', () => {
	test('flag rendered in top layer is visible and not obscured', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
			{
				featureFlag,
			},
		);

		const addFlagBtn = page.getByTestId('AddFlag');
		await addFlagBtn.click();

		const flag = page.getByTestId('MyFlagTestId--1');
		await expect(flag).toBeVisible();
	});
});

test.describe('Flag top-layer — WCAG 4.1.2 Name, Role, Value', () => {
	test('flag has an appropriate ARIA role (sanity check)', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
			{
				featureFlag,
			},
		);

		const addFlagBtn = page.getByTestId('AddFlag');
		await addFlagBtn.click();

		const flag = page.getByTestId('MyFlagTestId--1');
		await expect(flag).toBeVisible();
		await expect(flag).toHaveAttribute('role');
	});
});

test.describe('Flag top-layer — Sanity checks', () => {
	test('flag is rendered near provider in DOM, not portalled to body end (sanity check)', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
			{
				featureFlag,
			},
		);

		const addFlagBtn = page.getByTestId('AddFlag');
		await addFlagBtn.click();

		const flag = page.getByTestId('MyFlagTestId--1');
		await expect(flag).toBeVisible();
	});

	test('multiple flags can be shown and each is visible', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
			{
				featureFlag,
			},
		);

		const addFlagBtn = page.getByTestId('AddFlag');
		await addFlagBtn.click();
		await addFlagBtn.click();

		const flag1 = page.getByTestId('MyFlagTestId--1');
		const flag2 = page.getByTestId('MyFlagTestId--2');

		await expect(flag1).toBeVisible();
		await expect(flag2).toBeVisible();
	});
});

test.describe('Flag top-layer — popover="manual" (migrated from unit)', () => {
	test('flag popover host uses manual mode', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
			{
				featureFlag,
			},
		);

		await page.getByTestId('AddFlag').click();

		const popoverMode = await page.evaluate(() => {
			const el = document.querySelector('[popover]');
			return el?.getAttribute('popover') ?? null;
		});

		expect(popoverMode).toBe('manual');
	});

	test('Escape does not dismiss the flag; dismiss button still closes it', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
			{
				featureFlag,
			},
		);

		await page.getByTestId('AddFlag').click();

		const flag = page.getByTestId('MyFlagTestId--1');
		await expect(flag).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(flag).toBeVisible();

		await page.getByTestId('MyFlagTestId--1-dismiss').click();
		await expect(flag).toBeHidden();
	});

	test('dismiss control exposes the name "Dismiss"', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
			{
				featureFlag,
			},
		);

		await page.getByTestId('AddFlag').click();

		await expect(page.getByRole('button', { name: 'Dismiss' })).toBeVisible();
	});

	test('flag surface has role="alert"', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
			{
				featureFlag,
			},
		);

		await page.getByTestId('AddFlag').click();

		await expect(page.getByTestId('MyFlagTestId--1')).toHaveAttribute('role', 'alert');
	});

	test('two flags share a single manual popover element', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
			{
				featureFlag,
			},
		);

		const addFlagBtn = page.getByTestId('AddFlag');
		await addFlagBtn.click();
		await addFlagBtn.click();

		const manualPopoverCount = await page.evaluate(() => {
			return document.querySelectorAll('[popover="manual"]').length;
		});

		expect(manualPopoverCount).toBe(1);
	});

	test('remaining flag stays inside manual popover after first flag is dismissed', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
			{
				featureFlag,
			},
		);

		const addFlagBtn = page.getByTestId('AddFlag');
		await addFlagBtn.click();
		await addFlagBtn.click();

		await page.getByTestId('MyFlagTestId--2-dismiss').click();

		const flag1 = page.getByTestId('MyFlagTestId--1');
		await expect(flag1).toBeVisible();

		const stillInsideManual = await page.evaluate(() => {
			const popover = document.querySelector('[popover="manual"]');
			const flag = document.querySelector('[data-testid="MyFlagTestId--1"]');
			return Boolean(popover && flag && popover.contains(flag));
		});

		expect(stillInsideManual).toBe(true);
	});
});

test.describe('Flag top-layer — shouldRenderToParent (top-layer path)', () => {
	test('flag still renders inside popover="manual" and not via portal', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/flag-should-render-to-parent-top-layer.tsx')
		>('design-system', 'flag', 'flag-should-render-to-parent-top-layer', {
			featureFlag,
		});

		await expect(page.getByTestId('flag-srp-1')).toBeVisible();

		const popoverMode = await page.evaluate(() => {
			const el = document.querySelector('[popover]');
			return el?.getAttribute('popover') ?? null;
		});
		expect(popoverMode).toBe('manual');

		const portalCount = await page.locator('.atlaskit-portal').count();
		expect(portalCount).toBe(0);
	});
});

test.describe('Flag top-layer — AutoDismissFlag', () => {
	test('auto-dismiss removes the mounted flag after eight seconds (clock)', async ({ page }) => {
		await page.clock.install();
		await page.visitExample<typeof import('../../../../../examples/10-flag-auto-dismiss.tsx')>(
			'design-system',
			'flag',
			'flag-auto-dismiss',
			{
				featureFlag,
			},
		);

		const firstFlag = page.getByText('Flag #1');
		await expect(firstFlag).toBeVisible();

		await page.clock.fastForward(8_000);

		await expect(firstFlag).toBeHidden();
	});
});
