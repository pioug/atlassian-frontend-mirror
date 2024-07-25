import {
	EditorBlockCardModel,
	EditorNodeContainerModel,
	expect,
	editorViewModeTestCase as test,
} from '@af/editor-libra';
import { blockCard, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { viewModeBlockAdf } from './view-mode.spec.ts-fixtures';

test.describe('block cards in view mode', () => {
	test.use({
		adf: viewModeBlockAdf,
		editorProps: {
			appearance: 'full-page',
			allowTextAlignment: true,
			smartLinks: {
				allowBlockCards: true,
			},
		},
	});

	test.describe('when view mode is enabled and FF is on', () => {
		test.use({
			platformFeatureFlags: { 'platform.linking-platform.smart-links-in-live-pages': true },
		});

		test('and FF is on, clicking on description does not let you change text', async ({
			editor,
		}) => {
			await editor.setViewMode('view');

			const nodes = EditorNodeContainerModel.from(editor);
			const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);
			await blockCardModel.waitForStable();

			// click on description of block card and attempt to edit text
			await blockCardModel.blockCardDescription.click();
			await editor.keyboard.type('this text should not exist');

			const expectedBlockCard = blockCard({
				data: {
					'@context': 'https://www.w3.org/ns/activitystreams',
					'@type': 'Document',
					generator: {
						icon: 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
					},
					name: 'Welcome to Atlassian!',
					url: 'http://www.atlassian.com',
					summary: "Recently, we've been talking to Tesla about how they use JIRA. Read on!",
				},
			});

			await expect(editor).toMatchDocument(doc(p(' '), expectedBlockCard()));
			await expect(editor.content).not.toContainText('this text should not exist');
		});
	});

	test.describe('when view mode is disabled', () => {
		test('clicking block card and typing should replace the block card with text', async ({
			editor,
		}) => {
			await editor.setViewMode('edit');

			const nodes = EditorNodeContainerModel.from(editor);
			const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);

			await blockCardModel.waitForStable();
			await blockCardModel.click();
			await editor.keyboard.type('this text should exist');

			await expect(editor).toMatchDocument(doc(p(' '), p('this text should exist')));
		});
	});
});
