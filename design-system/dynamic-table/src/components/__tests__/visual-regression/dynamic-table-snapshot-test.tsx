import { getExampleUrl, loadPage, takeElementScreenShot } from '@atlaskit/visual-regression/helper';

const table = "[data-testid='the-table--table']";
const tableHeadCell = "[data-testid='the-table--head--cell']";
const tableHeadParty = `${tableHeadCell}:nth-child(2)`;
const pagination = "[page='3']";
const selectRowsButtonSelector = "[data-testid='button-toggle-selected-rows']";
// FIXME: Skipping these tests as they have failing on master due to snapshot mis-match
// Build URL: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2395061/steps/%7Bd61db8d0-a816-4ff3-9509-fefde8a2a091%7D
describe.skip('Snapshot Test', () => {
	// You can't use other example as they create dynamic content and will fail the test
	it('Empty view example should match production example', async () => {
		const url = getExampleUrl(
			'design-system',
			'dynamic-table',
			'empty-view-with-body',
			global.__BASEURL__,
		);
		const { page } = global;
		// Move the mouse away from the top left corner to prevent the selected state
		// of the first heading cell from triggering.
		await page.mouse.move(0, 100);
		await loadPage(page, url);
		await page.waitForSelector('table');
		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('Testing example should match production example', async () => {
		const url = getExampleUrl('design-system', 'dynamic-table', 'testing', global.__BASEURL__);
		const { page } = global;

		await loadPage(page, url);
		await page.waitForSelector(table);
		await page.waitForSelector(selectRowsButtonSelector);
		await page.click(selectRowsButtonSelector);

		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('Testing example should match production example before and after sorting', async () => {
		const url = getExampleUrl('design-system', 'dynamic-table', 'testing', global.__BASEURL__);
		const { page } = global;

		await loadPage(page, url);
		await page.waitForSelector(table);
		// Take screenshot before sorting
		const tableBefore = await takeElementScreenShot(page, table);
		expect(tableBefore).toMatchProdImageSnapshot();
		// Take screenshot after going to page 3 and sorting
		await page.waitForSelector(pagination);
		await page.click(pagination);
		// We need to wait for the animation to finish.
		await page.waitForTimeout(1000);
		await page.waitForSelector(tableHeadCell);
		await page.click(tableHeadParty);
		const tableAfter = await takeElementScreenShot(page, table);
		expect(tableAfter).toMatchProdImageSnapshot();
	});

	it('Should show blue outline when table row is focused in a Rankable table', async () => {
		const url = getExampleUrl(
			'design-system',
			'dynamic-table',
			'with-lots-of-pages-rankable',
			global.__BASEURL__,
		);

		const { page } = global;

		await loadPage(page, url);
		await page.waitForSelector('tr');
		await page.focus('tr[tabindex="0"]');
		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('Should show correct background colour on hover of Rankable table', async () => {
		const url = getExampleUrl(
			'design-system',
			'dynamic-table',
			'with-lots-of-pages-rankable',
			global.__BASEURL__,
		);

		const { page } = global;

		await loadPage(page, url);
		await page.waitForSelector('tr');
		await page.hover('tr[tabindex="0"]');
		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('Highlighted row should have correct colours with dark theme', async () => {
		const url = getExampleUrl(
			'design-system',
			'dynamic-table',
			'highlighted-row',
			global.__BASEURL__,
			'dark',
		);

		const { page } = global;

		await loadPage(page, url);
		await page.waitForSelector('table');
		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('Should have correct highlighted row before and after sorting', async () => {
		const url = getExampleUrl(
			'design-system',
			'dynamic-table',
			'highlighted-row-with-sorting',
			global.__BASEURL__,
		);

		const { page } = global;

		await loadPage(page, url);
		await page.waitForSelector(table);
		// Take screenshot before sorting
		const tableBefore = await takeElementScreenShot(page, table);
		expect(tableBefore).toMatchProdImageSnapshot();
		// Take screenshot after sorting
		await page.click(tableHeadParty);
		const tableAfter = await takeElementScreenShot(page, table);
		expect(tableAfter).toMatchProdImageSnapshot();
	});

	it('Should show spinner and apply opacity to children when loading', async () => {
		const url = getExampleUrl(
			'design-system',
			'dynamic-table',
			'loading-state-many-rows',
			global.__BASEURL__,
		);

		const { page } = global;

		await loadPage(page, url);
		await page.waitForSelector(table);
		await page.click("[data-testid='toggle-loading']");
		await page.waitForSelector("[data-testid='the-table--loadingSpinner-wrapper']");
		const tableAfter = await takeElementScreenShot(page, table);
		expect(tableAfter).toMatchProdImageSnapshot();
	});
});
