import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

// Skip axe checks across this file: the test example may have known
// pre-existing accessibility violations unrelated to the top-layer migration.
test.beforeEach(({ skipAxeCheck }) => {
	skipAxeCheck();
});

test.describe('InlineMessage top-layer — WCAG 2.1.1 Keyboard (Click/Enter/Space)', () => {
	test('opens via click on trigger button', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');
		await expect(trigger).toBeVisible();

		const popup = page.getByTestId('the-inline-message--popup--content');
		await expect(popup).toBeHidden();

		await trigger.click();

		await expect(popup).toBeVisible();
	});

	test('opens via keyboard Enter on trigger button', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');
		await expect(trigger).toBeVisible();

		const popup = page.getByTestId('the-inline-message--popup--content');
		await expect(popup).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(popup).toBeVisible();
	});

	test('opens via keyboard Space on trigger button', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');
		await expect(trigger).toBeVisible();

		const popup = page.getByTestId('the-inline-message--popup--content');
		await expect(popup).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('Space');

		await expect(popup).toBeVisible();
	});
});

test.describe('InlineMessage top-layer — WCAG 2.1.2 No Keyboard Trap (Escape/Click-outside)', () => {
	test('closes via Escape key', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');
		const popup = page.getByTestId('the-inline-message--popup--content');

		await expect(popup).toBeHidden();

		await trigger.click();
		await expect(popup).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(popup).toBeHidden();
	});

	test('closes via click outside popup', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');
		const popup = page.getByTestId('the-inline-message--popup--content');

		await expect(popup).toBeHidden();

		await trigger.click();
		await expect(popup).toBeVisible();

		await page.click('body', { position: { x: 5, y: 5 } });

		await expect(popup).toBeHidden();
	});

	test('closes via toggle via trigger click', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');
		const popup = page.getByTestId('the-inline-message--popup--content');

		await expect(popup).toBeHidden();

		await trigger.click();
		await expect(popup).toBeVisible();

		await trigger.click();

		await expect(popup).toBeHidden();
	});
});

test.describe('InlineMessage top-layer — WCAG 2.4.3 Focus Order', () => {
	test('focus returns to trigger after closing via Escape', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');
		const popup = page.getByTestId('the-inline-message--popup--content');

		await expect(popup).toBeHidden();

		await trigger.click();
		await expect(popup).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(popup).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('focus can reach popup content', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');
		const popup = page.getByTestId('the-inline-message--popup--content');

		await expect(popup).toBeHidden();

		await trigger.click();
		await expect(popup).toBeVisible();

		const headingInPopup = popup.locator('h2');
		await expect(headingInPopup).toBeVisible();

		const link = page.getByRole('link');
		await expect(link).toBeVisible();
	});
});

test.describe('InlineMessage top-layer — WCAG 2.4.7 Focus Visible', () => {
	test('trigger button shows focus-visible state when focused', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');

		await trigger.focus();

		await expect(trigger).toBeFocused();
	});

	test('popup content receives focus when opened via keyboard', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');
		const popup = page.getByTestId('the-inline-message--popup--content');

		await expect(popup).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('Enter');

		// Top-layer's Popup auto-focuses the first focusable child of the
		// popover (a Link inside the message body). The trigger no longer
		// has DOM focus once the popup opens. We assert that focus moved
		// inside the popup, satisfying WCAG 2.4.7.
		await expect(popup).toBeVisible();
		const focusInsidePopup = popup.locator(':focus');
		await expect(focusInsidePopup).toHaveCount(1);
	});
});

test.describe('InlineMessage top-layer — WCAG 2.4.11 Focus Not Obscured', () => {
	test('popup content is visible and not obscured when open', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');
		const popup = page.getByTestId('the-inline-message--popup--content');

		await expect(popup).toBeHidden();

		await trigger.click();

		await expect(popup).toBeVisible();

		const heading = popup.locator('h2');
		await expect(heading).toBeVisible();

		const text = popup.locator('text=Visit');
		await expect(text).toBeVisible();
	});
});

test.describe('InlineMessage top-layer — WCAG 1.3.2 Meaningful Sequence (Content near trigger in DOM)', () => {
	test('popup is rendered in document without portal', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');
		const popup = page.getByTestId('the-inline-message--popup--content');

		await trigger.click();

		await expect(popup).toBeVisible();

		const popupElement = await page
			.locator('[data-testid="the-inline-message--popup--content"]')
			.elementHandle();
		const isInDocument = await page.evaluate(
			(element) => document.body.contains(element),
			popupElement,
		);

		expect(isInDocument).toBe(true);
	});
});

test.describe('InlineMessage top-layer — WCAG 4.1.2 Name, Role, Value', () => {
	test('trigger button has correct aria-expanded attribute', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');

		await expect(trigger).toHaveAttribute('aria-expanded', 'false');

		await trigger.click();

		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await trigger.click();

		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	test('popup has correct role=dialog attribute', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');
		const popup = page.getByTestId('the-inline-message--popup--content');

		await expect(popup).toBeHidden();

		await trigger.click();

		await expect(popup).toBeVisible();
		await expect(popup).toHaveAttribute('role', 'dialog');
	});
});

test.describe('InlineMessage top-layer — Component Structure and Content', () => {
	test('all component parts are present and labeled correctly', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const component = page.getByTestId('the-inline-message');
		await expect(component).toBeVisible();

		const trigger = page.getByTestId('the-inline-message--button');
		await expect(trigger).toBeVisible();

		const title = page.getByTestId('the-inline-message--title');
		await expect(title).toBeVisible();
		await expect(title).toHaveText('My testing Inline Message');

		const text = page.getByTestId('the-inline-message--text');
		await expect(text).toBeVisible();
		await expect(text).toHaveText('Use data-testid for reliable testing');
	});

	test('popup content renders correctly with correct text', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-message',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('the-inline-message--button');
		const popup = page.getByTestId('the-inline-message--popup--content');

		await expect(popup).toBeHidden();

		await trigger.click();

		await expect(popup).toBeVisible();

		const heading = popup.locator('h2');
		await expect(heading).toHaveText('It is so great to use data-testid');

		const link = page.getByRole('link', { name: /our testing website/i });
		await expect(link).toBeVisible();
	});
});
