import { expect, test } from '@af/integration-testing';

const exampleComponent = "[data-testid='spotlight']";

test('Spotlight should be able to be identified by data-testid', async ({ page }) => {
	await page.visitExample<typeof import('../../examples/card.tsx')>(
		'design-system',
		'spotlight',
		'card',
	);
	await expect(page.locator(exampleComponent).first()).toBeVisible();
});

test.describe('top-layer migration', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample<typeof import('../../examples/single-step.tsx')>(
			'design-system',
			'spotlight',
			'single-step',
			{
				featureFlag: 'platform-dst-top-layer-spotlight',
			},
		);
	});

	test('renders an accessible top-layer dialog', async ({ page }) => {
		const dialog = page.getByRole('dialog', { name: 'Headline' });

		await expect(dialog).toBeVisible();
		await expect(dialog).toHaveJSProperty('popover', 'manual');
		expect(await dialog.evaluate((element) => element.matches(':popover-open'))).toBe(true);
	});

	test('dismisses on Escape', async ({ page }) => {
		const dialog = page.getByRole('dialog', { name: 'Headline' });

		// Sanity check that the dialog is mounted before we trigger dismissal.
		// Without this, the dismiss can race the example's first paint and
		// the keyboard event lands before any focus trap or light-dismiss
		// listener is bound.
		await expect(dialog).toBeVisible();

		await page.keyboard.press('Escape');

		// The Popover primitive unmounts its host element after exit, so the
		// dialog is removed from the DOM entirely. `toHaveCount(0)` matches
		// the contract more precisely than `toBeHidden`, which polls visual
		// state and can race the host-element unmount on a paused
		// animation frame.
		await expect(dialog).toHaveCount(0);
	});

	test('dismisses on outside click', async ({ page }) => {
		const dialog = page.getByRole('dialog', { name: 'Headline' });

		await expect(dialog).toBeVisible();

		await page.mouse.click(5, 5);

		await expect(dialog).toHaveCount(0);
	});
});
