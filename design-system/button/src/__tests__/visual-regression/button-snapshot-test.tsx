import {
	getExampleUrl,
	loadPage,
	takeElementScreenShot,
	waitForElementCount,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
	it('Button appearance should match snapshot', async () => {
		const url = getExampleUrl(
			'design-system',
			'button',
			'appearances-old-button',
			global.__BASEURL__,
		);
		const { page } = global;
		await loadPage(page, url);
		// Wait for page content
		await waitForElementCount(page, 'button[type="button"]', 21);
		await waitForElementCount(page, 'button[type="button"][disabled]', 7);
		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('Loading Button appearance should match snapshot', async () => {
		const url = getExampleUrl(
			'design-system',
			'button',
			'vr-loading-button-appearances-old-button',
			global.__BASEURL__,
		);
		const { page } = global;
		await loadPage(page, url, { allowedSideEffects: { animation: true } });
		// Wait for page content
		await waitForElementCount(page, 'button[type="button"]', 21);
		await waitForElementCount(page, 'button[type="button"][disabled]', 7);
		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('focus should match snapshot', async () => {
		const url = getExampleUrl(
			'design-system',
			'button',
			'button-focus-old-button',
			global.__BASEURL__,
		);
		const { page } = global;
		await loadPage(page, url);
		// Wait for page content
		const image = await takeElementScreenShot(page, '[data-testid="button"]');
		expect(image).toMatchProdImageSnapshot();
	});

	it.each(Array.from({ length: 26 }).map((_, i) => i))(
		'other configurations should match snapshot %s',
		async (i) => {
			const url = getExampleUrl(
				'design-system',
				'button',
				'more-options-old-button',
				global.__BASEURL__,
				'light',
			);
			const { page } = global;
			await loadPage(page, url);
			// Wait for page content
			const image = await takeElementScreenShot(
				page,
				`[data-testid="combinations"] > :nth-child(${i + 1})`,
			);
			expect(image).toMatchProdImageSnapshot();
		},
	);
});
