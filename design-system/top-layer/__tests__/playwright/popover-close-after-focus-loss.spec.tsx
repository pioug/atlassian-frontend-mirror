import { expect, type Page, test } from '@af/integration-testing';

/**
 * When the content of a `Popover` removes, disables or hides its focused element, the browser moves
 * focus to `<body>`. No layer moves it back: not while the popover is open, and not when it closes
 * (native restoration needs focus inside the popover). The browser keeps the user's place, so Tab
 * continues from there. The keyboard presses the buttons, so every engine focuses them (Safari does
 * not focus a button on a mouse press).
 *
 * See notes/decisions/focus-loss-recovery.md
 */

async function openPopover(page: Page): Promise<void> {
	await page.visitExample<
		typeof import('../../examples/172-testing-popover-close-after-focus-loss.tsx')
	>('design-system', 'top-layer', 'testing-popover-close-after-focus-loss');
	const trigger = page.getByTestId('trigger');
	await trigger.focus();
	await page.keyboard.press('Enter');
	await expect(page.getByTestId('popover')).toBeVisible();
}

async function pressButton(page: Page, name: string): Promise<void> {
	await page.getByRole('button', { name, exact: true }).focus();
	await page.keyboard.press('Enter');
}

/**
 * Safari's default Tab reaches only text fields, and WebKit in Playwright does the same. Alt+Tab
 * reaches every control, as Tab does in the other engines.
 */
function getTabKey({ browserName, isBackward }: { browserName: string; isBackward: boolean }) {
	const key = isBackward ? 'Shift+Tab' : 'Tab';
	return browserName === 'webkit' ? `Alt+${key}` : key;
}

async function expectFocusOnBody(page: Page): Promise<void> {
	await expect.poll(() => page.evaluate(() => document.activeElement === document.body)).toBe(true);
}

test.describe('Popover: close after focus was lost from it', () => {
	test('leaves focus on <body> when the press that removes the focused button also closes it', async ({
		page,
	}) => {
		await openPopover(page);

		await pressButton(page, 'Cancel');

		await expect(page.getByTestId('popover')).toBeHidden();
		await expectFocusOnBody(page);
	});

	test('leaves focus on <body> while open and after Escape, when the focused button was removed', async ({
		page,
	}) => {
		await openPopover(page);

		await pressButton(page, 'Remove me');

		await expect(page.getByRole('button', { name: 'Remove me', exact: true })).toHaveCount(0);
		await expect(page.getByTestId('popover')).toBeVisible();
		await expectFocusOnBody(page);

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('popover')).toBeHidden();
		await expectFocusOnBody(page);
	});

	test('leaves focus on <body> after Escape, when the focused button became disabled', async ({
		page,
	}) => {
		await openPopover(page);

		await pressButton(page, 'Save');
		await expect(page.getByRole('button', { name: 'Save', exact: true })).toBeDisabled();
		await expectFocusOnBody(page);

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('popover')).toBeHidden();
		await expectFocusOnBody(page);
	});

	test('after a removal and a close, Tab goes to the next element after the popover', async ({
		page,
		browserName,
	}) => {
		await openPopover(page);
		await pressButton(page, 'Remove me');
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('popover')).toBeHidden();

		await page.keyboard.press(getTabKey({ browserName, isBackward: false }));

		await expect(page.getByRole('button', { name: 'Outside button', exact: true })).toBeFocused();
	});
});

/**
 * A popover with no role does not trap focus: Tab moves out of it in DOM order, and the popover
 * stays open (the platform behaviour). A later close does not pull focus back to the trigger.
 */
test.describe('Popover: Tab out of an open popover', () => {
	test('Tab from the last element moves focus to the next element after the popover, and a later Escape leaves it there', async ({
		page,
		browserName,
	}) => {
		await openPopover(page);
		await page.getByRole('button', { name: 'Save', exact: true }).focus();

		await page.keyboard.press(getTabKey({ browserName, isBackward: false }));

		const outsideButton = page.getByRole('button', { name: 'Outside button', exact: true });
		await expect(outsideButton).toBeFocused();
		await expect(page.getByTestId('popover')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('popover')).toBeHidden();
		await expect(outsideButton).toBeFocused();
	});

	test('Shift+Tab from the first element moves focus to the trigger, and the popover stays open', async ({
		page,
		browserName,
	}) => {
		await openPopover(page);
		await page.getByRole('button', { name: 'Cancel', exact: true }).focus();

		await page.keyboard.press(getTabKey({ browserName, isBackward: true }));

		await expect(page.getByTestId('trigger')).toBeFocused();
		await expect(page.getByTestId('popover')).toBeVisible();
	});
});
