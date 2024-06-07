import { disableCaretCursor, disableAllTransitions } from '@atlaskit/visual-regression/helper';

import { CONTROL_SELECTOR, INPUT_SELECTOR } from './_constants';

export async function hoverOverUserPicker(page: PuppeteerPage) {
	// Disable CSS transitions so the hover styles are applied immediately
	await disableAllTransitions(page);
	await page.hover(CONTROL_SELECTOR);
}

export function inputTypingFactory(inputText: string, customInputSelector?: string) {
	return async (page: PuppeteerPage) => {
		const inputSelector = customInputSelector ?? INPUT_SELECTOR;
		await disableCaretCursor(page);
		await page.focus(inputSelector);
		await page.type(inputSelector, inputText);
	};
}

export function selectItemFactory(inputText: string, customInputSelector?: string) {
	return async (page: PuppeteerPage) => {
		await inputTypingFactory(inputText, customInputSelector)(page);
		await page.keyboard.press('Enter');
	};
}
