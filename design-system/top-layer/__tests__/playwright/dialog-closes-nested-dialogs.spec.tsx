import { expect, type Page, test } from '@af/integration-testing';

/**
 * When a `Dialog` closes, it closes the open dialogs inside it. Otherwise the inner modal stays open,
 * out of sight, and the rest of the page stays inert: product code that focuses a trigger after the
 * close cannot.
 *
 * Layers open by keyboard, so the trigger is the element that had focus at open in every browser.
 */

test.beforeEach(async ({ page }) => {
	await page.visitExample<
		typeof import('../../examples/179-testing-dialog-closes-nested-dialogs.tsx')
	>('design-system', 'top-layer', 'testing-dialog-closes-nested-dialogs');
});

async function pressWithKeyboard({ page, testId }: { page: Page; testId: string }): Promise<void> {
	await page.getByTestId(testId).focus();
	await page.keyboard.press('Enter');
}

async function openBothDialogs({ page }: { page: Page }): Promise<void> {
	await pressWithKeyboard({ page, testId: 'outer-trigger' });
	await expect(page.getByTestId('outer-dialog')).toBeVisible();
	await pressWithKeyboard({ page, testId: 'inner-trigger' });
	await expect(page.getByTestId('inner-dialog')).toBeVisible();
}

test('closing the outer dialog closes the inner one, so code can move focus when the exit finishes', async ({
	page,
}) => {
	await openBothDialogs({ page });

	await pressWithKeyboard({ page, testId: 'close-outer-then-focus-outside' });

	await expect(page.getByTestId('outer-dialog')).toBeHidden();
	await expect(page.getByTestId('inner-dialog')).toBeHidden();
	// The fixture focuses "Outside" in the outer `onExitFinish`.
	await expect(page.getByTestId('focus-after-exit')).toHaveText('outside');
	await expect(page.getByTestId('outside')).toBeFocused();
});

test('closing the outer dialog gives focus back to its trigger', async ({ page, browserName }) => {
	test.fixme(
		browserName === 'webkit',
		"Playwright's WebKit can drop focus to the body after a layer closes in a React commit; real Safari 27 returns it to the trigger",
	);
	await openBothDialogs({ page });

	await pressWithKeyboard({ page, testId: 'close-outer' });

	await expect(page.getByTestId('outer-dialog')).toBeHidden();
	await expect(page.getByTestId('outer-trigger')).toBeFocused();
});

/**
 * The inner dialog closes with a native `close()`, while its owner keeps `isOpen` `true`. `Dialog`
 * must handle that close: no `onClose`, a normal exit, and no show again inside the closed layer.
 */
test('the inner dialog closes for good: no onClose, one exit, and it does not show again', async ({
	page,
}) => {
	await openBothDialogs({ page });

	await pressWithKeyboard({ page, testId: 'close-outer' });

	await expect(page.getByTestId('outer-dialog')).toBeHidden();
	await expect(page.getByTestId('inner-exits')).toHaveText('1');
	await expect(page.getByTestId('inner-close-requests')).toHaveText('0');
	// After the closed `toggle` task, where `Dialog` shows a dialog again that closed unasked.
	await expect(page.locator('dialog')).toHaveCount(0);
	// No modal is left: the page takes a click. (Playwright fails the click on an inert element.
	// Safari does not focus a button on click, so focus is not the check.)
	await page.getByTestId('outside').click();
});

test('the inner dialog shows again with the outer one, and its Escape still asks its owner', async ({
	page,
}) => {
	await openBothDialogs({ page });
	await pressWithKeyboard({ page, testId: 'close-outer' });
	await expect(page.locator('dialog')).toHaveCount(0);

	// The inner owner still has `isOpen` `true`.
	await pressWithKeyboard({ page, testId: 'outer-trigger' });

	await expect(page.getByTestId('outer-dialog')).toBeVisible();
	await expect(page.getByTestId('inner-dialog')).toBeVisible();

	await page.keyboard.press('Escape');

	await expect(page.getByTestId('inner-dialog')).toBeHidden();
	await expect(page.getByTestId('outer-dialog')).toBeVisible();
	await expect(page.getByTestId('inner-close-requests')).toHaveText('1');
});
