import {
	getExampleUrl,
	loadPage,
	pageSelector,
	type PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

describe('Archive sidebar', () => {
	let page: PuppeteerPage;
	const url = getExampleUrl('media', 'media-viewer', 'vr-archive-side-bar', global.__BASEURL__);

	/*
    - ArchiveSidebarFolderWrapper has its `opacity` set to `0` and `transform` set to `translateY(-100%)` by default and relies on keyframe animation to turn it to `1` and `translateY(0)` respectively
    - However, we are disabling the animation side effects with loadPage() helper, therefore its opacity and transform will not change without the push from animation
    - To mitigate this, we "normalise" those properties to a snapshot-worthy values
    - Styles are located in: packages/media/media-viewer/src/viewers/archiveSidebar/styles.ts
  */

	const normaliseArchiveViewerFolderWrapperStyles = async (page: PuppeteerPage) => {
		const css = `
    [data-testid="archive-sidebar-folder-wrapper"] {
        opacity: 1 !important;
        transform: none !important;
    }
`;
		await page.addStyleTag({ content: css });
	};

	beforeEach(async () => {
		({ page } = global);
		await loadPage(page, url);
		await normaliseArchiveViewerFolderWrapperStyles(page);
		await page.waitForSelector(pageSelector);
		await page.click('button[data-testid="media-native-preview"]');
		await page.waitForSelector('span[aria-label="Folder"]');
	});

	// FIXME: This test was automatically skipped due to failure on 23/07/2022: https://product-fabric.atlassian.net/browse/MEX-1818
	it.skip('should have side bar for archive file', async () => {
		await page.hover('div[data-testid="media-viewer-popup"]');
		const image = await page.screenshot();

		expect(image).toMatchProdImageSnapshot();
	});

	// FIXME: This test was automatically skipped due to failure on 23/07/2022: https://product-fabric.atlassian.net/browse/MEX-1819
	it.skip('should show navigation back button on opening the folder', async () => {
		await page.click('span[aria-label="Folder"]');
		// Moving the mouse out of the way so it doesn't highlight the div when the screenshot is taken
		await page.mouse.move(0, 0);
		const image = await page.screenshot();

		expect(image).toMatchProdImageSnapshot();
	});
});
