import { expect, editorTestCase as test } from '@af/editor-libra';
import { EditorNodeContainerModel } from '@af/editor-libra/page-models';
import { skipAutoA11yFile } from '@atlassian/a11y-playwright-testing';

import {
	blockCardAdf,
	blockquoteAdf,
	bodiedExtensionAdf,
	bulletListAdf,
	codeBlockAdf,
	decisionListAdf,
	embedCardAdf,
	expandAdf,
	extensionAdf,
	headingNodeAdf,
	layoutAndBigParagraphs,
	mediaGroupAdf,
	mediaSingleAdf,
	panelAdf,
	panelWithSmallFontSizeAdf,
	paragraphAdf,
	ruleNodeAdf,
	tableAdf,
	taskListAdf,
} from '../__fixtures__/first-block-node-styles-adfs';
// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:playwright
skipAutoA11yFile();

test.describe('first block node styles', () => {
	test.use({
		exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
		editorProps: {
			appearance: 'full-page',
			allowPanel: true,
			allowTables: true,
			allowExpand: true,
			allowTasksAndDecisions: true,
			allowRule: true,
			allowExtension: true,
			allowLayouts: true,
			media: {
				allowMediaSingle: true,
			},
			smartLinks: {
				allowBlockCards: true,
				allowEmbeds: true,
			},
		},
		initialPluginConfiguration: {
			blockTypePlugin: {
				allowFontSize: true,
			},
		},
	});

	test.describe('panel', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: panelAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstPanelNode = nodes.panel.first();
			const secondPanelNode = nodes.panel.nth(1);
			await expect(firstPanelNode).toHaveCSS('margin-top', '0px');
			await expect(secondPanelNode).toHaveCSS('margin-top', '12px');
		});

		test('should capture and report a11y violations', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstPanelNode = nodes.panel.first();
			await expect(firstPanelNode).toBeVisible();

			await expect(editor.page).toBeAccessible();
		});
	});

	test.describe('panel with small font size block mark', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: panelWithSmallFontSizeAdf,
			editorExperiments: {
				platform_editor_small_font_size: true,
			},
		});

		test('should preserve top margin on the second paragraph with small font size applied within a panel', async ({
			editor,
		}) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const panelNode = nodes.panel.first();
			const firstParagraph = panelNode.locator('p').first();
			const secondParagraph = panelNode.locator('p').nth(1);

			await expect(firstParagraph).toHaveCSS('margin-top', '0px');
			await expect(secondParagraph).toHaveCSS('margin-top', '12px');
		});
	});

	test.describe('code block', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: codeBlockAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.codeBlock.first();
			const secondNode = nodes.codeBlock.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '12px');
		});
	});

	test.describe('taskList', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: taskListAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.actionList.first();
			const secondNode = nodes.actionList.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '12px');
		});
	});

	test.describe('rules', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: ruleNodeAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.divider.first();
			const secondNode = nodes.divider.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '24px');
		});
	});

	test.describe('expand', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: expandAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.expand.first();
			const secondNode = nodes.expand.nth(1);
			await editor.openExpands();
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '4px');
		});
	});

	test.describe('layout', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: layoutAndBigParagraphs,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.layout.first();
			const secondNode = nodes.layout.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '8px');
		});
	});

	test.describe('blockCard', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: blockCardAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.blockCard.first();
			const secondNode = nodes.blockCard.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '12px');
		});
	});

	test.describe('mediaSingle', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: mediaSingleAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.mediaSingle.first();
			const secondNode = nodes.mediaSingle.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '0px');
		});
	});

	test.describe('mediaGroup', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: mediaGroupAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.mediaGroup.first();
			const secondNode = nodes.mediaGroup.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '0px');
		});
	});

	test.describe('BodiedExtension', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: bodiedExtensionAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.bodiedExtension.first();
			const secondNode = nodes.bodiedExtension.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '12px');
		});
	});

	test.describe('Extension', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: extensionAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.extension.first();
			const secondNode = nodes.extension.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '12px');
		});
	});

	test.describe('embedCard', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: embedCardAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.embedCard.first();
			const secondNode = nodes.embedCard.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '0px');
		});
	});

	test.describe('decisionList', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: decisionListAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.decisionList.first();
			const secondNode = nodes.decisionList.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '12px');
		});
	});

	test.describe('paragraph', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: paragraphAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.paragraph.first();
			const secondNode = nodes.paragraph.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '12px');
		});
	});

	test.describe('bullet list', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: bulletListAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.bulletList.first();
			const secondNode = nodes.bulletList.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '12px');
		});
	});

	test.describe('headings', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: headingNodeAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.h1.first();
			const secondNode = nodes.h1.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			const marginTop = secondNode.evaluate((element) => {
				return window.getComputedStyle(element).marginTop;
			});
			expect(parseFloat(await marginTop)).toBeGreaterThan(0);
		});
	});

	test.describe('blockquote', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: blockquoteAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.blockquote.first();
			const secondNode = nodes.blockquote.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '12px');
		});
	});

	test.describe('table', () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			adf: tableAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.table.first();
			const secondNode = nodes.table.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '0px');
		});

		test('should capture and report a11y violations', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.table.first();
			await expect(firstNode).toBeVisible();

			await expect(editor.page).toBeAccessible({ violationCount: 1 });
		});
	});
});
