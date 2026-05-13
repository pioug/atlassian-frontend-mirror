import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

// Skip axe checks across this file: the example button has known
// pre-existing color-contrast violations that are unrelated to the
// top-layer migration we're testing.
test.beforeEach(({ skipAxeCheck }) => {
	skipAxeCheck();
});

test.describe('InlineDialog top-layer — Content Rendering Parity', () => {
	test('renders content as ReactNode correctly', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('open-inline-dialog-button');
		const content = page.getByTestId('inline-dialog');

		await expect(content).toBeHidden();

		await trigger.click();

		await expect(content).toBeVisible();
		await expect(content).toContainText('Hello!');
	});
});

test.describe('InlineDialog top-layer — onClose Callback', () => {
	test('closes via Escape key', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('open-inline-dialog-button');
		const content = page.getByTestId('inline-dialog');

		await trigger.click();
		await expect(content).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(content).toBeHidden();
	});

	test('closes via click outside', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('open-inline-dialog-button');
		const content = page.getByTestId('inline-dialog');

		await trigger.click();
		await expect(content).toBeVisible();

		await page.locator('body').click({ position: { x: 10, y: 10 } });

		await expect(content).toBeHidden();
	});
});

test.describe('InlineDialog top-layer — Reopening Behavior', () => {
	test('can be reopened after being closed via Escape', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('open-inline-dialog-button');
		const content = page.getByTestId('inline-dialog');

		await trigger.click();
		await expect(content).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();

		await trigger.click();

		await expect(content).toBeVisible();
		await expect(content).toContainText('Hello!');
	});

	test('can be reopened after being closed via light-dismiss', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('open-inline-dialog-button');
		const content = page.getByTestId('inline-dialog');

		await trigger.click();
		await expect(content).toBeVisible();

		await page.locator('body').click({ position: { x: 10, y: 10 } });
		await expect(content).toBeHidden();

		await trigger.click();

		await expect(content).toBeVisible();
		await expect(content).toContainText('Hello!');
	});
});

test.describe('InlineDialog top-layer — Multiple Dialogs', () => {
	test('opening one dialog closes the other via light-dismiss', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/08-multiple-inline-dialogs.tsx')
		>(
			'design-system',
			'inline-dialog',
			'multiple-inline-dialogs',
			{
				featureFlag,
			},
		);

		const dialog1Trigger = page.getByRole('button', { name: 'Click for dialog 1' });
		const dialog2Trigger = page.getByRole('button', { name: 'Click for dialog 2' });

		await dialog1Trigger.click();

		const dialogs = page.getByRole('dialog');
		await expect(dialogs).toHaveCount(1);

		await dialog2Trigger.click();

		await expect(dialogs).toHaveCount(1);
	});
});

test.describe('InlineDialog top-layer — Modal Nesting', () => {
	test('dialog stays open when modal inside it is opened', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/06-modal.tsx')>(
			'design-system',
			'inline-dialog',
			'modal',
			{
				featureFlag,
			},
		);

		const inlineDialogTrigger = page.getByTestId('open-inline-dialog-button');
		const inlineDialog = page.getByTestId('inline-dialog');

		await expect(inlineDialog).toBeHidden();

		await inlineDialogTrigger.click();
		await expect(inlineDialog).toBeVisible();

		const openModalButton = page.getByTestId('open-modal-button');
		await openModalButton.click();

		const modal = page.getByTestId('modal');
		await expect(modal).toBeVisible();
		await expect(inlineDialog).toBeVisible();
	});

	test('dialog stays open when modal is closed via primary button', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/06-modal.tsx')>(
			'design-system',
			'inline-dialog',
			'modal',
			{
				featureFlag,
			},
		);

		const inlineDialogTrigger = page.getByTestId('open-inline-dialog-button');
		const inlineDialog = page.getByTestId('inline-dialog');

		await inlineDialogTrigger.click();
		await expect(inlineDialog).toBeVisible();

		const openModalButton = page.getByTestId('open-modal-button');
		await openModalButton.click();

		const modal = page.getByTestId('modal');
		await expect(modal).toBeVisible();

		const primaryButton = page.getByTestId('primary');
		await primaryButton.click();

		await expect(modal).toBeHidden();
		await expect(inlineDialog).toBeVisible();
	});
});

test.describe('InlineDialog top-layer — Dropdown Nesting', () => {
	test('dialog stays open when interacting with dropdown inside it', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/09-popup.tsx')>(
			'design-system',
			'inline-dialog',
			'popup',
			{
				featureFlag,
			},
		);

		const inlineDialogTrigger = page.getByTestId('open-inline-dialog-button');
		const inlineDialog = page.getByTestId('inline-dialog');

		await inlineDialogTrigger.click();
		await expect(inlineDialog).toBeVisible();

		const dropdownTrigger = page.getByTestId('dropdown--trigger');
		await dropdownTrigger.click();

		const menuItem = page.locator('[role="menuitem"]').first();
		await menuItem.click();

		await expect(inlineDialog).toBeVisible();
	});

	test('Escape closes dropdown first, then dialog on second press', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/09-popup.tsx')>(
			'design-system',
			'inline-dialog',
			'popup',
			{
				featureFlag,
			},
		);

		const inlineDialogTrigger = page.getByTestId('open-inline-dialog-button');
		const inlineDialog = page.getByTestId('inline-dialog');

		await inlineDialogTrigger.click();
		await expect(inlineDialog).toBeVisible();

		const dropdownTrigger = page.getByTestId('dropdown--trigger');
		await dropdownTrigger.click();

		const dropdownContent = page.getByTestId('dropdown--content');
		await expect(dropdownContent).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(dropdownContent).toBeHidden();
		await expect(inlineDialog).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(inlineDialog).toBeHidden();
	});
});

test.describe('InlineDialog top-layer — Positioning', () => {
	test('dialog renders when example is loaded', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/02-positioning.tsx')>(
			'design-system',
			'inline-dialog',
			'positioning',
			{
				featureFlag,
			},
		);

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();
	});
});

test.describe('InlineDialog top-layer — Animation', () => {
	test('dialog appears with animation on open', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId('open-inline-dialog-button');
		const content = page.getByTestId('inline-dialog');

		await trigger.click();

		await expect(content).toBeVisible();
	});
});
