import { expect, editorTestCase as test } from '@af/editor-libra';
import { EditorNodeContainerModel } from '@af/editor-libra/page-models';

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
	paragraphAdf,
	ruleNodeAdf,
	tableAdf,
	taskListAdf,
} from '../__fixtures__/first-block-node-styles-adfs';

test.describe('first block node styles', () => {
	test.use({
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
	});

	test.describe('panel', () => {
		test.use({
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

	test.describe('code block', () => {
		test.use({
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
			adf: expandAdf,
		});
		test('should have correct margin tops', async ({ editor }) => {
			const nodes = EditorNodeContainerModel.from(editor);
			const firstNode = nodes.expand.first();
			const secondNode = nodes.expand.nth(1);
			await expect(firstNode).toHaveCSS('margin-top', '0px');
			await expect(secondNode).toHaveCSS('margin-top', '4px');
		});
	});

	test.describe('layout', () => {
		test.use({
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
