/* eslint-disable testing-library/prefer-screen-queries */
import { expect, type Locator, type Page, test } from '@af/integration-testing';

/**
 * Modal focus ring, on the legacy and the top-layer path.
 *
 * When nothing inside the modal can take focus, focus rests on the modal itself. After a keyboard
 * open, the modal surface shows the design system focus ring, as the legacy modal section did.
 * On the top layer the focus is on the `<dialog>`, which `Dialog` leaves unstyled, so the ring is
 * drawn on the surface inside it.
 */

type TVariant = 'body-scroll' | 'viewport-scroll' | 'with-button';

type TRing = {
	outlineStyle: string;
	outlineWidth: string;
	outlineOffset: string;
	outlineColor: string;
};

const featureFlag = 'platform-dst-top-layer';

async function visitExample({
	page,
	isTopLayer,
}: {
	page: Page;
	isTopLayer: boolean;
}): Promise<void> {
	await page.visitExample<typeof import('../../examples/107-testing-focus-ring.tsx')>(
		'design-system',
		'modal-dialog',
		'testing-focus-ring',
		isTopLayer ? { featureFlag } : undefined,
	);
}

async function openWithKeyboard({
	page,
	variant,
}: {
	page: Page;
	variant: TVariant;
}): Promise<void> {
	await page.getByTestId(`${variant}-modal-trigger`).focus();
	await page.keyboard.press('Enter');
}

// The modal itself: a `<dialog>` on the top layer, a `section` on legacy.
function getModal({ page, variant }: { page: Page; variant: TVariant }): Locator {
	return page.getByTestId(`${variant}-modal`);
}

// The element that draws the ring: the surface inside the `<dialog>` on the top layer, the modal
// section itself on legacy.
function getSurface({
	page,
	variant,
	isTopLayer,
}: {
	page: Page;
	variant: TVariant;
	isTopLayer: boolean;
}): Locator {
	const modal = getModal({ page, variant });
	return isTopLayer ? modal.locator(':scope > * > div').first() : modal;
}

function getRing({ surface }: { surface: Locator }): Promise<TRing> {
	return surface.evaluate((element) => {
		const style = getComputedStyle(element);
		return {
			outlineStyle: style.outlineStyle,
			outlineWidth: style.outlineWidth,
			outlineOffset: style.outlineOffset,
			outlineColor: style.outlineColor,
		};
	});
}

async function getExpectedRing({ page }: { page: Page }): Promise<TRing> {
	const tokens = await page.getByTestId('focus-ring-tokens').evaluate((element) => {
		const style = getComputedStyle(element);
		return { color: style.color, width: style.borderTopWidth };
	});
	return {
		outlineStyle: 'solid',
		outlineWidth: tokens.width,
		outlineOffset: tokens.width,
		outlineColor: tokens.color,
	};
}

function getPageScroll({ page }: { page: Page }): Promise<Record<string, number>> {
	return page.evaluate(() => {
		const scrollingElement = document.scrollingElement ?? document.documentElement;
		return {
			scrollWidth: scrollingElement.scrollWidth,
			scrollHeight: scrollingElement.scrollHeight,
			scrollbarWidth: window.innerWidth - scrollingElement.clientWidth,
			scrollbarHeight: window.innerHeight - scrollingElement.clientHeight,
		};
	});
}

/**
 * Whether a programmatic focus matches `:focus-visible` is the browser's call. On the top layer,
 * Playwright WebKit treats the `showModal()` focus after a mouse open as focus-visible, so the
 * surface shows the ring. Chromium and Firefox do not. Legacy showed no ring there in every engine.
 * Real Safari is not checked yet: Playwright WebKit can differ from it (see D17 and
 * `top-layer/notes/safari-firefox-focus-verification-report.md`).
 */
function getMouseOpenExpectation({
	isTopLayer,
	browserName,
}: {
	isTopLayer: boolean;
	browserName: string;
}): { isFocusVisible: boolean; outlineStyle: string } {
	if (isTopLayer && browserName === 'webkit') {
		return { isFocusVisible: true, outlineStyle: 'solid' };
	}
	return { isFocusVisible: false, outlineStyle: 'none' };
}

[false, true].forEach((isTopLayer) => {
	test.describe(`ModalDialog focus ring (top layer ${isTopLayer ? 'on' : 'off'})`, () => {
		(['body-scroll', 'viewport-scroll'] as const).forEach((variant) => {
			test(`${variant}: the surface shows the ring after a keyboard open with nothing focusable`, async ({
				page,
			}) => {
				await visitExample({ page, isTopLayer });
				const pageScrollBefore = await getPageScroll({ page });
				await openWithKeyboard({ page, variant });

				await expect(getModal({ page, variant })).toBeFocused();
				expect(await getRing({ surface: getSurface({ page, variant, isTopLayer }) })).toEqual(
					await getExpectedRing({ page }),
				);
				expect(await getPageScroll({ page })).toEqual(pageScrollBefore);
			});

			test(`${variant}: after a mouse open, the ring follows the browser's :focus-visible`, async ({
				page,
				browserName,
			}) => {
				await visitExample({ page, isTopLayer });
				await page.getByTestId(`${variant}-modal-trigger`).click();

				const modal = getModal({ page, variant });
				await expect(modal).toBeFocused();
				const expected = getMouseOpenExpectation({ isTopLayer, browserName });
				expect(await modal.evaluate((element) => element.matches(':focus-visible'))).toBe(
					expected.isFocusVisible,
				);
				expect(
					(await getRing({ surface: getSurface({ page, variant, isTopLayer }) })).outlineStyle,
				).toBe(expected.outlineStyle);
			});
		});

		test('a focused control inside keeps its own ring, and the surface shows none', async ({
			page,
		}) => {
			await visitExample({ page, isTopLayer });
			await openWithKeyboard({ page, variant: 'with-button' });

			const button = page.getByTestId('with-button-modal-close');
			await expect(button).toBeFocused();
			expect(
				await button.evaluate((element) => {
					const style = getComputedStyle(element);
					return (
						element.matches(':focus-visible') &&
						(style.outlineStyle !== 'none' || style.boxShadow !== 'none')
					);
				}),
			).toBe(true);
			expect(
				(await getRing({ surface: getSurface({ page, variant: 'with-button', isTopLayer }) }))
					.outlineStyle,
			).toBe('none');
		});
	});
});
