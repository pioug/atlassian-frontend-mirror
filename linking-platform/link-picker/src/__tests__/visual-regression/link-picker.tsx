import {
	disableAllAnimations,
	disableAllTransitions,
	disableScrollBehavior,
	getExampleUrl,
	loadPage,
	type LoadPageOptions,
	pageSelector,
	takeElementScreenShot,
	waitForTooltip,
} from '@atlaskit/visual-regression/helper';

export function getURL(testName: string, colorMode: 'dark' | 'light' | 'none' = 'none'): string {
	return getExampleUrl('linking-platform', 'link-picker', testName, global.__BASEURL__, colorMode);
}

const COLOR_MODES = ['dark', 'light', 'none'] as const;

export async function setup(url: string, options: LoadPageOptions = {}) {
	const { page } = global;
	await loadPage(page, url, {
		reloadSameUrl: true,
		...options,
		allowedSideEffects: {
			tooltips: true,
			...(options.allowedSideEffects ?? {}),
		},
	});
	await page.waitForSelector(pageSelector);

	// disable animations in TextField
	await disableAllAnimations(page);
	await disableAllTransitions(page);
	await disableScrollBehavior(page);
	return page;
}

describe('link-picker', () => {
	let testSelector: string;

	beforeEach(() => {
		testSelector = '[data-testid="link-picker"]';
	});

	it.skip.each(COLOR_MODES)(
		'should render component with results with %s tokens',
		async (colorMode) => {
			const url = getURL('vr-basic', colorMode);
			const page = await setup(url);
			const image = await takeElementScreenShot(page, testSelector);
			expect(image).toMatchProdImageSnapshot();
		},
	);

	it.skip('Should render component without display text field', async () => {
		const url = getURL('vr-hide-display-text');
		const page = await setup(url);
		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should render component without display text field with results', async () => {
		const url = getURL('vr-hide-display-text-with-plugin');
		const page = await setup(url);
		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should render component without display text field with plugins', async () => {
		const url = getURL('vr-hide-display-text-with-multiple-plugins');
		const page = await setup(url);
		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should render component to edit a link', async () => {
		const url = getURL('vr-edit-link');
		const page = await setup(url);

		await page.waitForSelector(testSelector);

		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip.each(COLOR_MODES)(
		'Should change list-item background on hover and selection with %s tokens',
		async (colorMode) => {
			const url = getURL('vr-basic', colorMode);
			const page = await setup(url);
			await page.keyboard.press('ArrowDown');
			await page.keyboard.press('ArrowDown');
			await page.hover('[data-testid="link-search-list-item"]');

			const image = await takeElementScreenShot(page, testSelector);
			expect(image).toMatchProdImageSnapshot();
		},
	);

	it.skip('should select the search list via keyboard tab and use arrows up/down to navigate', async () => {
		const url = getURL('vr-basic');
		const page = await setup(url);

		// Tab twice to reach the search results list
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// Press arrow down twice to select first and second items respectively
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');

		// Press arrow up to get back to the first item
		await page.keyboard.press('ArrowUp');

		// Finally, expects selected item to be the first one on the list
		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('should select the search list via keyboard tab and use Home key to select first item', async () => {
		const url = getURL('vr-basic');
		const page = await setup(url);

		// Tab twice to reach the search results list
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// Press arrow down twice to select first and second items respectively
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');

		// Press arrow up to get back to the first item
		await page.keyboard.press('Home');

		// Finally, expects selected item to be the first one on the list
		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('should select the search list via keyboard tab and use End key to select last item', async () => {
		const url = getURL('vr-basic');
		const page = await setup(url);

		// Tab twice to reach the search results list
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// Press arrow down once to select first item
		await page.keyboard.press('ArrowDown');

		// Press arrow up to get back to the last item
		await page.keyboard.press('End');

		// Finally, expects selected item to be the last one on the list
		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should not change the background of selected list-item on hover', async () => {
		const url = getURL('vr-basic');
		const page = await setup(url);
		await page.keyboard.press('ArrowDown');
		await page.hover('[data-testid="link-search-list-item"]');

		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should change input background on hover', async () => {
		const url = getURL('vr-basic');
		const page = await setup(url);
		await page.hover('[data-testid="link-text-container"]');

		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip.each(COLOR_MODES)(
		'Should change input border-color on focus with %s tokens',
		async (colorMode) => {
			const url = getURL('vr-basic', colorMode);
			const page = await setup(url);
			await page.focus('[data-testid="link-text"]');

			const image = await takeElementScreenShot(page, testSelector);
			expect(image).toMatchProdImageSnapshot();
		},
	);

	it.skip('Should display ClearText button when input has value', async () => {
		const url = getURL('vr-basic');
		const page = await setup(url);

		await page.keyboard.type('FAB');
		await page.waitForSelector('[data-testid="clear-text"]');

		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should display ClearText tooltip on hover', async () => {
		const url = getURL('vr-basic');
		const page = await setup(url);

		await page.keyboard.type('FAB');
		await page.hover('[data-testid="clear-text"]');
		await waitForTooltip(page);

		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should not display text under ClearText button', async () => {
		const url = getURL('vr-basic');
		const page = await setup(url);

		const longText = 'A text field is an input that allows a user to write or edit text';
		await page.type('[data-testid="link-text"]', longText);

		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should render Linkpicker within Popup with input focused', async () => {
		const url = getURL('vr-with-popup-integration');
		const page = await setup(url);

		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should display error message and highlight input border for invalid URLs', async () => {
		const url = getURL('vr-basic');
		const page = await setup(url);

		await page.type('[data-testid="link-url"]', 'FAB');
		await page.focus('[data-testid="link-text"]');
		await page.keyboard.press('Enter');
		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should display error message and highlight input border for empty URLs', async () => {
		const url = getURL('vr-basic');
		const page = await setup(url);

		await page.focus('[data-testid="link-text"]');
		await page.keyboard.press('Enter');
		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should render tabs with multiple plugins', async () => {
		const url = getURL('vr-with-multiple-plugins');
		const page = await setup(url);

		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should render tabs with multiple plugins and select second tab', async () => {
		const url = getURL('vr-with-multiple-plugins');
		const page = await setup(url);

		await page.click('#link-picker-tabs-1');

		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should render tabs with multiple plugins and click forward arrow to see more tabs', async () => {
		const url = getURL('vr-with-multiple-plugins');
		const page = await setup(url);

		await page.click('[data-test-id="forward"]');

		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should render tabs with multiple plugins and click forward arrow to see more tabs', async () => {
		const url = getURL('vr-with-multiple-plugins');
		const page = await setup(url);

		await page.click('[data-test-id="forward"]');

		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should render tabs with multiple plugins and go forwards and backwards through arrow controls', async () => {
		const url = getURL('vr-with-multiple-plugins');
		const page = await setup(url);

		await page.click('[data-test-id="forward"]');
		await page.waitForSelector('[data-test-id="back"]');
		await page.click('[data-test-id="back"]');

		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should render tabs with multiple plugins and go forwards clicking the forward arrow until the end', async () => {
		const url = getURL('vr-with-multiple-plugins');
		const page = await setup(url);

		await page.click('[data-test-id="forward"]');
		await page.click('[data-test-id="forward"]');
		await page.click('[data-test-id="forward"]');

		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('Should render tabs with multiple plugins and add more tabs', async () => {
		const url = getURL('vr-with-multiple-plugins');
		const page = await setup(url);

		await page.click('[data-test-id="add-tab"]');

		await page.click('[data-test-id="forward"]');
		await page.click('[data-test-id="forward"]');
		await page.click('[data-test-id="forward"]');
		await page.click('[data-test-id="forward"]');

		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});

	it.skip('should display action button when plugin', async () => {
		const url = getURL('vr-with-plugin-action');
		const page = await setup(url);

		const image = await takeElementScreenShot(page, testSelector);
		expect(image).toMatchProdImageSnapshot();
	});
});
