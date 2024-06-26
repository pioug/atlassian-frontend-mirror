import {
	getExampleUrl,
	loadPage,
	type PuppeteerPage,
	takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const checkbox = "[data-testid='cb-basic--checkbox-label']";
const invalidCheckbox = "[data-testid='cb-invalid--checkbox-label']";

async function waitForCheckboxes(page: PuppeteerPage) {
	await page.waitForSelector(checkbox);
	await page.waitForSelector(invalidCheckbox);
}

describe('Snapshot Test', () => {
	it('Default checkbox should render correctly under all interactions', async () => {
		const { __BASEURL__, page } = global;
		const url = getExampleUrl('design-system', 'checkbox', 'basic-usage', __BASEURL__);
		await loadPage(page, url);
		await waitForCheckboxes(page);

		const defaultImg = await takeElementScreenShot(page, checkbox);
		expect(defaultImg).toMatchProdImageSnapshot();

		await page.focus(checkbox);
		const focusedImg = await takeElementScreenShot(page, checkbox);
		expect(focusedImg).toMatchProdImageSnapshot();

		await page.click(checkbox);
		const focusedAndSelectedImg = await takeElementScreenShot(page, checkbox);
		expect(focusedAndSelectedImg).toMatchProdImageSnapshot();

		await page.click(invalidCheckbox); //blur the default checkbox
		const selectedImg = await takeElementScreenShot(page, checkbox);
		expect(selectedImg).toMatchProdImageSnapshot();
	});

	it('Invalid checkbox should render correctly under all interactions', async () => {
		const { __BASEURL__, page } = global;
		const url = getExampleUrl('design-system', 'checkbox', 'basic-usage', __BASEURL__);
		await loadPage(page, url);
		await waitForCheckboxes(page);

		const defaultImg = await takeElementScreenShot(page, invalidCheckbox);
		expect(defaultImg).toMatchProdImageSnapshot();

		await page.focus(invalidCheckbox);
		const focusedImg = await takeElementScreenShot(page, invalidCheckbox);
		expect(focusedImg).toMatchProdImageSnapshot();

		await page.click(invalidCheckbox);
		const focusedAndSelectedImg = await takeElementScreenShot(page, invalidCheckbox);
		expect(focusedAndSelectedImg).toMatchProdImageSnapshot();

		await page.click(checkbox); //blur the default invalidCheckbox
		const selectedImg = await takeElementScreenShot(page, invalidCheckbox);
		expect(selectedImg).toMatchProdImageSnapshot();
	});

	// Need to investigate. Continuesly failing on branch build https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/3027371/steps/%7Bb57c83a3-a660-400f-8d8e-9c81094fd8a6%7D/test-report
	it.skip('Indeterminate examples should match production example', async () => {
		const url = getExampleUrl('design-system', 'checkbox', 'indeterminate', global.__BASEURL__);
		const { page } = global;
		await loadPage(page, url);
		await page.waitForSelector("[data-testid='parent--checkbox-label']");

		await page.click("[data-testid='child-1--checkbox-label']");

		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});
});
