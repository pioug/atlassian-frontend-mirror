import { getExampleUrl, loadPage, takeElementScreenShot } from '@atlaskit/visual-regression/helper';

describe('Grid', () => {
	it('hidden-item example should match snapshot', async () => {
		const url = getExampleUrl('design-system', 'grid', 'grid-hidden-item', global.__BASEURL__);
		const { page } = global;

		await loadPage(page, url);

		const image = await takeElementScreenShot(page, `[id="examples"]`);
		expect(image).toMatchProdImageSnapshot();
	});

	it('jsm-grid example should match snapshot', async () => {
		const url = getExampleUrl('design-system', 'grid', 'jsm-grid', global.__BASEURL__);
		const { page } = global;

		await loadPage(page, url);

		const image = await takeElementScreenShot(page, `[id="examples"]`);
		expect(image).toMatchProdImageSnapshot();
	});
});
