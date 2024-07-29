import {
	EditorFloatingToolbarModel,
	EditorHyperlinkModel,
	EditorLinkOverlayModel,
	EditorNodeContainerModel,
	expect,
	editorViewModeTestCase as test,
} from '@af/editor-libra';

import { viewModeHyperlinkAdf } from './view-mode.spec.ts-fixtures';

test.describe('hyperlink in view mode', () => {
	test.use({
		adf: viewModeHyperlinkAdf,
	});

	test.describe('when rendered inside a live page and ff is on', () => {
		test.use({
			platformFeatureFlags: { 'platform.linking-platform.smart-links-in-live-pages': true },
		});

		test('link should navigate on click in view mode', async ({ editor, page }) => {
			await editor.setViewMode('view');

			const nodes = EditorNodeContainerModel.from(editor);

			const previousUrl = page.url();

			const link = EditorHyperlinkModel.from(nodes.link.first());
			await link.click({ pointer: 'middle' });

			expect(page.url()).not.toBe(previousUrl);
		});

		test('link should navigate on click in edit mode', async ({ editor, page }) => {
			await editor.setViewMode('edit');

			const nodes = EditorNodeContainerModel.from(editor);

			const previousUrl = page.url();

			const link = EditorHyperlinkModel.from(nodes.link.first());
			await link.click({ pointer: 'middle' });

			expect(page.url()).not.toBe(previousUrl);
		});

		test('toolbar does not disappear when hover over link', async ({ editor }) => {
			await editor.setViewMode('edit');

			const nodes = EditorNodeContainerModel.from(editor);
			const link = nodes.link.first();
			await link.hover();

			const overlayModel = EditorLinkOverlayModel.from(link);
			await overlayModel.click();

			const hyperlinkModel = EditorHyperlinkModel.from(link);
			const floatingToolbarModel = EditorFloatingToolbarModel.from(editor, hyperlinkModel);
			await floatingToolbarModel.waitForStable();
			await floatingToolbarModel.clickEditLink();
			await floatingToolbarModel.clickLabelField();

			await link.hover();

			await expect(floatingToolbarModel.toolbar).toBeVisible();
		});
	});

	test.describe('when rendered inside a live page and ff is off', () => {
		test.use({
			platformFeatureFlags: { 'platform.linking-platform.smart-links-in-live-pages': false },
		});

		test('link should navigate on click in view mode', async ({ editor, page }) => {
			await editor.setViewMode('view');

			const nodes = EditorNodeContainerModel.from(editor);

			const previousUrl = page.url();

			const link = EditorHyperlinkModel.from(nodes.link.first());
			await link.click({ pointer: 'middle' });

			expect(page.url()).not.toBe(previousUrl);
		});

		test('link should not navigate on click in edit mode', async ({ editor, page }) => {
			await editor.setViewMode('edit');

			const nodes = EditorNodeContainerModel.from(editor);

			const previousUrl = page.url();

			const link = EditorHyperlinkModel.from(nodes.link.first());
			await link.click({ pointer: 'middle' });

			expect(page.url()).toBe(previousUrl);
		});
	});
});
