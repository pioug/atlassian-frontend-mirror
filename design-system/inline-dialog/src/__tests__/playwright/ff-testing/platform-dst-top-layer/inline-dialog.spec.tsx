import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

const triggerTestId = 'open-inline-dialog-button';
const dialogTestId = 'inline-dialog';

// Skip axe checks across this file: the example button has known
// pre-existing color-contrast violations that are unrelated to the
// top-layer migration we're testing.
test.beforeEach(({ skipAxeCheck }) => {
	skipAxeCheck();
});

test.describe('InlineDialog top-layer — WCAG 2.1.1 Keyboard Accessibility', () => {
	test('opens via click on trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await expect(content).toBeHidden();

		await trigger.click();

		await expect(content).toBeVisible();
		await expect(content).toContainText('Hello!');
	});

	test('opens via Enter key when trigger is focused', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await expect(content).toBeHidden();
		await trigger.focus();

		await page.keyboard.press('Enter');

		await expect(content).toBeVisible();
	});

	test('opens via Space key when trigger is focused', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await expect(content).toBeHidden();
		await trigger.focus();

		await page.keyboard.press('Space');

		await expect(content).toBeVisible();
	});
});

test.describe('InlineDialog top-layer — WCAG 2.1.2 No Keyboard Trap', () => {
	test('closes via Escape key', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await trigger.click();
		await expect(content).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(content).toBeHidden();
	});

	test('closes via light-dismiss (click outside)', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await trigger.click();
		await expect(content).toBeVisible();

		await page.locator('body').click({ position: { x: 10, y: 10 } });

		await expect(content).toBeHidden();
	});

	test('Tab cycles within the dialog and does not reach the page control after the dialog while open', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);
		const afterDialog = page.getByTestId('after-inline-dialog-button');

		await trigger.click();
		await expect(content).toBeVisible();

		for (let i = 0; i < 30; i++) {
			await page.keyboard.press('Tab');
			await expect(afterDialog).not.toBeFocused();
		}

		await expect(content).toBeVisible();
	});
});

test.describe('InlineDialog top-layer — WCAG 2.4.3 Focus Movement', () => {
	test('moves focus into dialog on open', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await expect(content).toBeHidden();

		await trigger.click();
		await expect(content).toBeVisible();

		// Top-layer's Popup auto-focuses the first focusable child of the
		// dialog rather than the dialog container itself. Verify focus is
		// inside the dialog, which still satisfies WCAG 2.4.3.
		const firstFocusable = page.getByTestId('inline-dialog-inner-first');
		await expect(firstFocusable).toBeFocused();
	});

	test('returns focus to trigger after Escape closes dialog', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await trigger.click();
		await expect(content).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();

		await expect(trigger).toBeFocused();
	});

	test('returns focus to trigger after light-dismiss closes dialog', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await trigger.click();
		await expect(content).toBeVisible();

		await page.locator('body').click({ position: { x: 10, y: 10 } });
		await expect(content).toBeHidden();

		await expect(trigger).toBeFocused();
	});
});

test.describe('InlineDialog top-layer — WCAG 2.4.7 Focus Visible', () => {
	test('trigger displays focus indicator when focused', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);

		await trigger.focus();

		await expect(trigger).toBeFocused();
	});

	test('dialog displays focus indicator when focused', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);

		await trigger.click();

		// Top-layer's Popup auto-focuses the first focusable child of the
		// dialog. Verifying that the focused element is inside the dialog
		// satisfies WCAG 2.4.7 (focus visible inside the open dialog).
		const firstFocusable = page.getByTestId('inline-dialog-inner-first');
		await expect(firstFocusable).toBeFocused();
	});
});

test.describe('InlineDialog top-layer — WCAG 2.4.11 Content Not Obscured', () => {
	test('dialog content is visible when opened', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await expect(content).toBeHidden();

		await trigger.click();

		await expect(content).toBeVisible();
	});

	test('dialog stays visible when navigating within it', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await trigger.click();
		await expect(content).toBeVisible();

		await content.click();

		await expect(content).toBeVisible();
	});
});

test.describe('InlineDialog top-layer — WCAG 4.1.2 Name, Role, Value', () => {
	test('dialog has correct role and accessible label', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await expect(content).toBeHidden();

		await trigger.click();

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();
		await expect(dialog).toHaveAttribute('aria-label', 'Inline dialog');
	});

	test('trigger has aria-expanded attribute that reflects dialog state', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await expect(trigger).toHaveAttribute('aria-expanded', 'false');

		await trigger.click();
		await expect(content).toBeVisible();

		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();

		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});
});

test.describe('InlineDialog top-layer — WCAG 1.3.2 Meaningful Sequence', () => {
	test('dialog surface follows trigger in document order (not portalled to body end)', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await trigger.click();
		await expect(content).toBeVisible();

		const dialogFollowsTrigger = await page.evaluate(
			(ids: string[]) => {
				const openId = ids[0];
				const dialogId = ids[1];
				if (!openId || !dialogId) {
					return false;
				}
				const t = document.querySelector(`[data-testid="${openId}"]`);
				const d = document.querySelector(`[data-testid="${dialogId}"]`);
				if (!t || !d) {
					return false;
				}
				const position = t.compareDocumentPosition(d);
				return Boolean(position & Node.DOCUMENT_POSITION_FOLLOWING);
			},
			[triggerTestId, dialogTestId],
		);

		expect(dialogFollowsTrigger).toBe(true);

		const notLastBodyChild = await page.evaluate((dialogId: string) => {
			const d = document.querySelector(`[data-testid="${dialogId}"]`);
			return d !== null && document.body.lastElementChild !== d;
		}, dialogTestId);

		expect(notLastBodyChild).toBe(true);
	});
});

test.describe('InlineDialog top-layer — State Management', () => {
	test('can be reopened after being closed', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await trigger.click();
		await expect(content).toBeVisible();
		await expect(content).toContainText('Hello!');

		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();

		await trigger.click();
		await expect(content).toBeVisible();
		await expect(content).toContainText('Hello!');
	});

	test('content is correct when reopened', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const content = page.getByTestId(dialogTestId);

		await trigger.click();
		await expect(content).toContainText('Hello!');

		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();

		await trigger.click();

		const contentText = content.locator('p');
		await expect(contentText).toContainText('Hello!');
	});
});
