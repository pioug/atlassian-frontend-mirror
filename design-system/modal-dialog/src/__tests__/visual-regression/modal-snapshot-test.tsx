import { getExampleUrl, loadPage, takeElementScreenShot } from '@atlaskit/visual-regression/helper';

import { openModal } from './_helper';

const openModalBtn = "[data-testid='modal-trigger']";
const modalDialog = "[data-testid='modal']";
const selectBtn = '.single-select';
const scrollToBottomBtn = "[data-testid='scrollDown']";
const visibilitySelector = '[data-testid="visibility--checkbox-label"]';
const scrollSelector = '[data-testid="scroll--checkbox-label"]';
const scrollIntoViewBtn = "[data-testid='scroll-into-view']";
const moreBorderRadiusSelector = '[data-testid="more--radio-label"]';

const defaultOptions = {
	triggerSelector: openModalBtn,
	modalSelector: modalDialog,
	viewport: { width: 800, height: 600 },
};

describe('Snapshot test', () => {
	it('Body scroll after horizontal scroll should match production example', async () => {
		const url = getExampleUrl(
			'design-system',
			'modal-dialog',
			'scroll-horizontal',
			global.__BASEURL__,
		);

		const { page } = global;
		await loadPage(page, url);

		await page.setViewport(defaultOptions.viewport);
		await page.click(scrollIntoViewBtn);

		await page.click(openModalBtn);
		await page.waitForSelector(modalDialog);

		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('Viewport scroll after horizontal scroll should match production example', async () => {
		const url = getExampleUrl(
			'design-system',
			'modal-dialog',
			'scroll-horizontal',
			global.__BASEURL__,
		);

		const { page } = global;
		await loadPage(page, url);

		await page.setViewport(defaultOptions.viewport);
		await page.click(scrollIntoViewBtn);

		await page.waitForSelector(scrollSelector);
		await page.click(scrollSelector);

		await page.click(openModalBtn);
		await page.waitForSelector(modalDialog);

		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('Two-column scroll should match production example', async () => {
		const url = getExampleUrl('design-system', 'modal-dialog', 'multi-column', global.__BASEURL__);

		const { page } = global;
		await loadPage(page, url);

		await page.click(openModalBtn);
		await page.waitForSelector(modalDialog);

		await page.click(scrollToBottomBtn);
		await page.waitForTimeout(1000);

		const image = await takeElementScreenShot(page, 'body');
		expect(image).toMatchProdImageSnapshot();
	});

	it('Footer should not come over select dropdown', async () => {
		const url = getExampleUrl(
			'design-system',
			'modal-dialog',
			'with-footer-and-select-option',
			global.__BASEURL__,
		);

		const page = await openModal(url, defaultOptions);

		await page.waitForSelector(selectBtn);
		await page.click(selectBtn);

		const image = await takeElementScreenShot(page, 'body');
		expect(image).toMatchProdImageSnapshot();
	});

	it('Scrollable modal without header/footer should match production example', async () => {
		const url = getExampleUrl('design-system', 'modal-dialog', 'scroll', global.__BASEURL__);
		const { page } = global;
		await loadPage(page, url);
		await page.setViewport(defaultOptions.viewport);

		await page.waitForSelector(visibilitySelector);
		await page.click(visibilitySelector);

		await page.click(openModalBtn);
		await page.waitForSelector(modalDialog);

		// Traps the focus on the modal
		await page.keyboard.press('Tab');

		const image = await takeElementScreenShot(page, 'body');
		expect(image).toMatchProdImageSnapshot();
	});

	it('Modal should prevent programmatic scroll when open', async () => {
		const url = getExampleUrl('design-system', 'modal-dialog', 'scroll', global.__BASEURL__);

		const { page } = global;
		await loadPage(page, url);

		await page.setViewport(defaultOptions.viewport);
		await page.evaluate(() => window.scrollBy(0, 100));

		await page.click(openModalBtn);
		await page.waitForSelector(modalDialog);

		await page.evaluate(() => window.scrollBy(0, 300));

		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('Modal with a child with an incorrect border radius should match production example', async () => {
		const url = getExampleUrl('design-system', 'modal-dialog', 'custom-child', global.__BASEURL__);

		const { page } = global;
		await loadPage(page, url);

		await page.setViewport(defaultOptions.viewport);
		await page.evaluate(() => window.scrollBy(0, 100));

		await page.waitForSelector(moreBorderRadiusSelector);
		await page.click(moreBorderRadiusSelector);

		await page.click(openModalBtn);
		await page.waitForSelector(modalDialog);

		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});
});
