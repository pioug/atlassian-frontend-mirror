import { getExampleUrl, loadPage, takeElementScreenShot } from '@atlaskit/visual-regression/helper';

// Css-selectors
const next = "[data-testid='button--next']";
const prev = "[data-testid='button--prev']";
const add = "[data-testid='button--add']";
const remove = "[data-testid='button--remove']";
const tracker = "[data-testid='tracker']";

describe('Snapshot Test for Progress Tracker', () => {
	it('should handle stages being added', async () => {
		const { __BASEURL__, page } = global;
		const url = getExampleUrl('design-system', 'progress-tracker', 'dynamic-stages', __BASEURL__);

		await loadPage(page, url, {
			allowedSideEffects: { animation: true, transition: true },
		});
		await page.waitForSelector(next);
		await page.waitForSelector(prev);
		await page.waitForSelector(add);
		await page.waitForSelector(remove);

		await page.click(next);
		await page.click(add);
		await page.click(add);
		await page.click(next);

		await page.waitForTimeout(500);
		const image = await takeElementScreenShot(page, tracker);
		expect(image).toMatchProdImageSnapshot();
	});

	it('should handle stages being removed', async () => {
		const { __BASEURL__, page } = global;

		const url = getExampleUrl('design-system', 'progress-tracker', 'dynamic-stages', __BASEURL__);

		await loadPage(page, url, {
			reloadSameUrl: true,
			allowedSideEffects: { animation: true, transition: true },
		});
		await page.waitForSelector(next);
		await page.waitForSelector(prev);
		await page.waitForSelector(add);
		await page.waitForSelector(remove);

		// page loads with three
		await page.click(add);
		await page.click(add);
		// max five allowed (in the example implementation)
		await page.click(remove);
		await page.click(remove);
		await page.click(remove);

		await page.waitForTimeout(500);
		const image = await takeElementScreenShot(page, tracker);
		expect(image).toMatchProdImageSnapshot();
	});
});
