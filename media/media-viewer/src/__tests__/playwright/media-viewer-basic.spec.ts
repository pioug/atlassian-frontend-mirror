import { expect, test } from '@af/integration-testing';
import { MediaViewerPageObject } from '../utils/_mediaViewerPageObject';

test.describe('MediaViewer', () => {
	test('basic media viewer test', async ({ page }) => {
		const viewer = new MediaViewerPageObject(page);
		await viewer.init('vr-mocked-viewer');
		await expect(viewer.fileName).toContainText('media-test-file-2.jpg');
		await expect(viewer.fileType).toContainText('image');
		await expect(viewer.size).toContainText('16 KB');
		await expect(viewer.icon).toHaveAttribute('data-type', 'image');

		await viewer.navigateNext();
		await expect(viewer.fileName).toContainText('media-test-file-3.png');
		await expect(viewer.fileType).toContainText('image');
		await expect(viewer.size).toContainText('57 KB');
		await expect(viewer.icon).toHaveAttribute('data-type', 'image');

		await viewer.navigatePrevious(2);
		await expect(viewer.fileName).toContainText('media-test-file-1.png');
		await expect(viewer.fileType).toContainText('image');
		await expect(viewer.size).toContainText('158 B');
		await expect(viewer.icon).toHaveAttribute('data-type', 'image');

		await viewer.navigateNext(3);
		await expect(viewer.fileName).toContainText(
			'https://wac-cdn.atlassian.com/dam/jcr:616e6748-ad8c-48d9-ae93-e49019ed5259/Atlassian-horizontal-blue-rgb.svg',
		);
		await expect(viewer.fileType).toContainText('image');
		await expect(viewer.icon).toHaveAttribute('data-type', 'image');
	});

	// eslint-disable-next-line playwright/expect-expect
	test('media-viewer-basic.ts: Should close on Close click', async ({ page }) => {
		const viewer = new MediaViewerPageObject(page);
		await viewer.init('vr-mocked-viewer');
		await viewer.closeMediaViewer(false);
	});

	// eslint-disable-next-line playwright/expect-expect
	test('media-viewer-basic.ts: Should close on Escape press', async ({ page }) => {
		const viewer = new MediaViewerPageObject(page);
		await viewer.init('vr-mocked-viewer');
		await viewer.closeMediaViewer(true);
		expect(await page.webdriverCompatUtils.isDetached('media-viewer-popup')).toBe(true);
	});

	test('media-viewer-basic.ts: Should open and close sidebar', async ({ page }) => {
		const viewer = new MediaViewerPageObject(page);
		await viewer.init('vr-mocked-viewer');
		await viewer.openSidebar();
		await expect(viewer.sidepannelContent).toBeVisible();
		await viewer.closeSidebar();
	});
});
