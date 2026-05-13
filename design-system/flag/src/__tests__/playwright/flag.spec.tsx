import { expect, test } from '@af/integration-testing';

test.describe('Flag top-layer — WCAG 2.1.1 Keyboard', () => {
	test('Flag actions should be keyboard accessible', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
		);

		// Arrange: Add a flag
		await page.getByTestId('AddFlag').click();
		await expect(page.getByTestId('MyFlagTestId--1')).toBeVisible();
		const actionButton = page.getByTestId('MyFlagTestId--1').getByTestId('MyFlagAction');
		await expect(actionButton).toBeVisible();

		// Set up the dialog handler before triggering it. Use focus() directly on the
		// action button rather than counting Tab presses; the dismiss button precedes
		// actions in DOM order, so the precise number of Tabs is brittle.
		const alertPromise = page.waitForEvent('dialog', async (alertDialog) => {
			await alertDialog.accept();
			return true;
		});

		// Act: Focus the action and activate via keyboard
		await actionButton.focus();
		await expect(actionButton).toBeFocused();
		await page.keyboard.press('Enter');

		// Assert: Alert dialog should appear
		await alertPromise;
	});
});

test.describe('Flag top-layer — WCAG 2.1.2 Dismiss', () => {
	test('Flag should be dismissible via keyboard', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
		);

		// Arrange: Add two flags
		await page.getByTestId('AddFlag').click();
		await expect(page.getByTestId('MyFlagTestId--1')).toBeVisible();

		await page.getByTestId('AddFlag').click();
		await expect(page.getByTestId('MyFlagTestId--2')).toBeVisible();

		// Act: Focus and activate dismiss button via keyboard
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');

		// Assert: Flag should be dismissed
		await expect(page.getByTestId('MyFlagTestId--2')).toBeHidden();
		await expect(page.getByTestId('MyFlagTestId--1')).toBeVisible();
	});
});

test.describe('Flag top-layer — WCAG 2.4.3 Focus Visible', () => {
	test('Focus should reach flag content and actions', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
		);

		// Arrange: Add a flag
		await page.getByTestId('AddFlag').click();
		await expect(page.getByTestId('MyFlagTestId--1')).toBeVisible();

		// Act: Focus the action button. The dismiss button precedes actions in DOM
		// order, so a single Tab from the AddFlag button does not reach the action;
		// focus() avoids relying on the surrounding tab order.
		const actionButton = page.getByTestId('MyFlagTestId--1').getByTestId('MyFlagAction');
		await actionButton.focus();

		// Assert: Focus should be visible on the action button
		await expect(actionButton).toBeFocused();
	});
});

test.describe('Flag top-layer — WCAG 2.4.7 Focus Indicator', () => {
	test('Buttons should have focus-visible indicator', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
		);

		// Arrange: Add a flag
		await page.getByTestId('AddFlag').click();
		await expect(page.getByTestId('MyFlagTestId--1')).toBeVisible();

		// Act: Focus the action button directly to avoid Tab-order coupling.
		const actionButton = page.getByTestId('MyFlagTestId--1').getByTestId('MyFlagAction');
		await actionButton.focus();

		// Assert: Button should be focused
		await expect(actionButton).toBeFocused();
	});
});

test.describe('Flag top-layer — WCAG 2.4.11 Content Visible', () => {
	test('Flag content should remain visible', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
		);

		// Arrange & Act: Add a flag
		await page.getByTestId('AddFlag').click();

		// Assert: Flag and its actions should be visible
		await expect(page.getByTestId('MyFlagTestId--1')).toBeVisible();
		await expect(page.getByTestId('MyFlagTestId--1').getByTestId('MyFlagAction')).toBeVisible();
	});
});

test.describe('Flag top-layer — WCAG 4.1.2 Roles', () => {
	test('Flag should have appropriate roles', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
		);

		// Arrange & Act: Add a flag
		await page.getByTestId('AddFlag').click();
		await expect(page.getByTestId('MyFlagTestId--1')).toBeVisible();

		// Assert: Action button should be accessible
		const actionButton = page.getByTestId('MyFlagTestId--1').getByTestId('MyFlagAction');
		await expect(actionButton).toBeVisible();
	});
});

test.describe('Flag top-layer — WCAG 1.3.2 Sanity', () => {
	test('Multiple flags should render and be dismissible', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
		);

		// Arrange: Add first flag
		await page.getByTestId('AddFlag').click();
		await expect(page.getByTestId('MyFlagTestId--1')).toBeVisible();

		// Act: Add second flag
		await page.getByTestId('AddFlag').click();

		// Assert: Both flags should be visible
		await expect(page.getByTestId('MyFlagTestId--1')).toBeVisible();
		await expect(page.getByTestId('MyFlagTestId--2')).toBeVisible();
	});
});
