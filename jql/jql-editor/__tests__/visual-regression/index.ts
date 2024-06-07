import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

const loadExample = async (example: string, testId: string = 'jql-editor-input') => {
	const url = getExampleUrl('jql', 'jql-editor', example, global.__BASEURL__);
	const { page } = global;
	await loadPage(page, url);
	await page.waitForSelector(`[data-testid="${testId}"]`);
	return page;
};

describe('Snapshot Test', () => {
	it('Basic editor should match snapshot', async () => {
		const page = await loadExample('basic-editor');
		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('Editor with user nodes should match snapshot', async () => {
		const page = await loadExample('user-nodes');
		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('Editor with external errors should match snapshot', async () => {
		const page = await loadExample('external-errors');
		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('Editor without search button should match snapshot', async () => {
		const page = await loadExample('no-search-button');
		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('Compact editor should match snapshot', async () => {
		const page = await loadExample('compact-editor');
		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});

	it('Read only editor should match snapshot', async () => {
		const page = await loadExample('read-only', 'jql-editor-read-only');
		const image = await page.screenshot();
		expect(image).toMatchProdImageSnapshot();
	});
});
