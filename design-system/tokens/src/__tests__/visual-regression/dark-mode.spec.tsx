import { getExampleUrl, loadPage, takeElementScreenShot } from '@atlaskit/visual-regression/helper';

// FIXME: This test was automatically skipped due to failure on 21/06/2023: https://product-fabric.atlassian.net/browse/DSP-11330
it.skip('should honour the dark theme', async () => {
	const url = getExampleUrl('design-system', 'tokens', 'color-roles', global.__BASEURL__, 'dark');

	await loadPage(global.page, url);

	const image = await takeElementScreenShot(global.page, '[data-testid="tokens"]');
	expect(image).toMatchProdImageSnapshot();
});
