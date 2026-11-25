/* eslint-disable testing-library/prefer-screen-queries */
import { expect, type Page, test } from '@af/integration-testing';

type TVariant = 'nothing-focusable' | 'with-button' | 'full-viewport';

type TFocusOutline = { outlineStyle: string; isFocusVisible: boolean };

async function visitExample({ page }: { page: Page }): Promise<void> {
	await page.visitExample<typeof import('../../examples/178-testing-dialog-outline.tsx')>(
		'design-system',
		'top-layer',
		'testing-dialog-outline',
	);
}

// Opens with the keyboard, so the focused element matches `:focus-visible`.
async function openWithKeyboard({
	page,
	variant,
}: {
	page: Page;
	variant: TVariant;
}): Promise<void> {
	await page.getByTestId(`${variant}-trigger`).focus();
	await page.keyboard.press('Enter');
}

function getFocusOutline({ page, testId }: { page: Page; testId: string }): Promise<TFocusOutline> {
	return page.getByTestId(testId).evaluate((element) => ({
		outlineStyle: getComputedStyle(element).outlineStyle,
		isFocusVisible: element.matches(':focus-visible'),
	}));
}

function getPageScroll({ page }: { page: Page }): Promise<Record<string, number>> {
	return page.evaluate(() => {
		const scrollingElement = document.scrollingElement ?? document.documentElement;
		return {
			scrollWidth: scrollingElement.scrollWidth,
			scrollHeight: scrollingElement.scrollHeight,
			clientWidth: scrollingElement.clientWidth,
			clientHeight: scrollingElement.clientHeight,
			// Space taken by scrollbars.
			scrollbarWidth: window.innerWidth - scrollingElement.clientWidth,
			scrollbarHeight: window.innerHeight - scrollingElement.clientHeight,
		};
	});
}

test.describe('Dialog - outline', () => {
	test('the dialog has no outline when focus rests on it', async ({ page }) => {
		await visitExample({ page });
		await openWithKeyboard({ page, variant: 'nothing-focusable' });

		await expect(page.getByTestId('nothing-focusable-dialog')).toBeFocused();
		expect(await getFocusOutline({ page, testId: 'nothing-focusable-dialog' })).toEqual({
			outlineStyle: 'none',
			isFocusVisible: true,
		});
	});

	test('a focused control inside keeps its own ring', async ({ page }) => {
		await visitExample({ page });
		await openWithKeyboard({ page, variant: 'with-button' });

		const button = page.getByTestId('with-button-dialog').getByRole('button', { name: 'Close' });
		await expect(button).toBeFocused();
		expect(
			await button.evaluate((element) => ({
				outlineStyle: getComputedStyle(element).outlineStyle,
				isFocusVisible: element.matches(':focus-visible'),
			})),
		).toEqual({ outlineStyle: 'solid', isFocusVisible: true });
		expect((await getFocusOutline({ page, testId: 'with-button-dialog' })).outlineStyle).toBe(
			'none',
		);
	});

	test('a focused full viewport dialog adds no page scroll', async ({ page }) => {
		await visitExample({ page });
		const before = await getPageScroll({ page });

		await openWithKeyboard({ page, variant: 'full-viewport' });

		await expect(page.getByTestId('full-viewport-dialog')).toBeFocused();
		expect(await getFocusOutline({ page, testId: 'full-viewport-dialog' })).toEqual({
			outlineStyle: 'none',
			isFocusVisible: true,
		});
		expect(await getPageScroll({ page })).toEqual(before);
	});
});
