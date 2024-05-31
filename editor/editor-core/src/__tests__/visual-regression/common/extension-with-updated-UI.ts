// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	clickGoWideButton,
	clickOnExtension,
	hoverOverCopyButton,
	hoverOverExtension,
	hoverOverTrashButton,
	waitForExtensionToolbar,
} from '@atlaskit/editor-test-helpers/page-objects/extensions';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	Appearance,
	initEditorWithAdf,
	snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { waitForResolvedInlineCard } from '@atlaskit/media-integration-test-helpers';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import blockExtensionAdf from './__fixtures__/block-extension-with-paragraph-above.adf.json';
import blockExtensionSmartlinkAdf from './__fixtures__/block-extension-with-smartlink.adf.json';
import bodiedExtensionAdf from './__fixtures__/bodied-extension-with-paragraph-above.adf.json';
import bodiedExtensionSmartlinkAdf from './__fixtures__/bodied-extension-with-smartlink.adf.json';
import inlineExtensionCenterAlignedAdf from './__fixtures__/inline-extension-center-aligned.adf.json';
import inlineExtensionRightAlignedAdf from './__fixtures__/inline-extension-right-aligned.adf.json';
import inlineExtensionAdf from './__fixtures__/inline-extension-with-paragraph-above.adf.json';
import inlineExtensionSmartlinkAdf from './__fixtures__/inline-extension-with-smartlink.adf.json';

describe('Extension with updated UI:', () => {
	const initEditor = async (
		adf?: Object,
		viewport:
			| {
					width: number;
					height: number;
			  }
			| undefined = { width: 1040, height: 400 },
	) => {
		await initEditorWithAdf(page, {
			appearance: Appearance.fullPage,
			viewport,
			adf,
			editorProps: {
				featureFlags: {
					'macro-interaction-updates': true,
				},
			},
		});
	};

	let page: PuppeteerPage;
	beforeEach(async () => {
		page = global.page;
	});

	afterEach(async () => {
		await animationFrame(page);
		await snapshot(page);
	});

	describe('block', () => {
		it('should show proper default state for block Extension with new UI', async () => {
			await initEditor(blockExtensionAdf);
		});

		it('should show proper selected state for block Extension with new UI', async () => {
			await initEditor(blockExtensionAdf);
			await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'block-eh');
			await waitForExtensionToolbar(page);
		});

		it('should show proper danger state for block Extension with new UI', async () => {
			await initEditor(blockExtensionAdf);
			await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'block-eh');
			await waitForExtensionToolbar(page);
			await hoverOverTrashButton(page);
		});

		it('should show proper hovered state for block Extension with new UI', async () => {
			await page.waitForTimeout(1000);
			await initEditor(blockExtensionAdf);
			await page.waitForTimeout(1000);
			await hoverOverExtension(page, 'com.atlassian.confluence.macro.core', 'block-eh');
		});

		it('should show label on top of inline smart link for for block Extension with new UI', async () => {
			await initEditor(blockExtensionSmartlinkAdf);
			await waitForResolvedInlineCard(page);
			await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'block-eh');
		});

		it('should show label on top of inline smart link when width is changed for block Extension with new UI', async () => {
			await initEditor(blockExtensionSmartlinkAdf, { width: 800, height: 400 });
			await waitForResolvedInlineCard(page);
			await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'block-eh');
			await waitForExtensionToolbar(page);
			await clickGoWideButton(page);
		});
	});

	describe('inline', () => {
		it('should show proper default state for inline Extension with new UI', async () => {
			await initEditor(inlineExtensionAdf);
		});

		it('should show proper selected state for inline Extension with new UI', async () => {
			await initEditor(inlineExtensionAdf);
			await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'inline-eh');
			await waitForExtensionToolbar(page);
		});

		it('should show proper danger state for inline Extension with new UI', async () => {
			await initEditor(inlineExtensionAdf);
			await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'inline-eh');
			await waitForExtensionToolbar(page);
			await hoverOverTrashButton(page);
		});

		it('should show proper hovered state for inline Extension with new UI', async () => {
			await initEditor(inlineExtensionAdf);
			await hoverOverExtension(page, 'com.atlassian.confluence.macro.core', 'inline-eh');
		});

		it('should show label on top of inline smart link for for inline Extension with new UI', async () => {
			await initEditor(inlineExtensionSmartlinkAdf);
			await waitForResolvedInlineCard(page);
			await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'inline-eh');
		});

		it('should show label in proper position for center aligned inline extension', async () => {
			await initEditor(inlineExtensionCenterAlignedAdf);
			await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'inline-eh');
		});

		it('should show label in proper position for right (end) aligned inline extension', async () => {
			await initEditor(inlineExtensionRightAlignedAdf);
			await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'inline-eh');
		});
	});

	describe('bodied', () => {
		it('should show proper default state for bodied Extension with new UI', async () => {
			await initEditor(bodiedExtensionAdf);
		});

		it('should show proper selected state for bodied Extension with new UI', async () => {
			await initEditor(bodiedExtensionAdf);
			await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'bodied-eh');
			await waitForExtensionToolbar(page);
			// Bodied extensions are a bit finicky for triggering selected state so using copy button to trigger it
			await hoverOverCopyButton(page);
		});

		it('should show proper danger state for bodied Extension with new UI', async () => {
			await initEditor(bodiedExtensionAdf);
			await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'bodied-eh');
			await waitForExtensionToolbar(page);
			await hoverOverTrashButton(page);
		});

		it('should show proper hovered state for bodied Extension with new UI', async () => {
			await page.waitForTimeout(1000);
			await initEditor(bodiedExtensionAdf);
			await page.waitForTimeout(1000);
			await hoverOverExtension(page, 'com.atlassian.confluence.macro.core', 'bodied-eh');
		});

		it('should show label on top of inline smart link for for bodied Extension with new UI', async () => {
			await initEditor(bodiedExtensionSmartlinkAdf);
			await waitForResolvedInlineCard(page);
			await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'bodied-eh');
			await waitForExtensionToolbar(page);
			await hoverOverCopyButton(page);
		});

		it('should show label on top of inline smart link when width is changed for bodied Extension with new UI', async () => {
			await initEditor(bodiedExtensionSmartlinkAdf, { width: 800, height: 400 });
			await waitForResolvedInlineCard(page);
			await clickOnExtension(page, 'com.atlassian.confluence.macro.core', 'bodied-eh');
			await waitForExtensionToolbar(page);
			await clickGoWideButton(page);
		});
	});
});
