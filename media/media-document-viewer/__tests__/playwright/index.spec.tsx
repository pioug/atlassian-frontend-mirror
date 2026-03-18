import { expect, test } from '@af/integration-testing';

const documentViewer = "[data-testid='document-viewer']";

test('MediaDocumentViewer should be able to be identified by data-testid', async ({ page }) => {
	await page.visitExample<typeof import('../../examples/basic.tsx')>('media', 'media-document-viewer', 'basic');
	await expect(page.locator(documentViewer).first()).toBeVisible();
});
