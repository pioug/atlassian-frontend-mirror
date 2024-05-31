// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	animationFrame,
	clickEditableContent,
	scrollToBottom,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	initCommentEditorWithAdf,
	snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

import { createDocumentWithParagraphs } from '../__fixtures/paragraph-content';

describe('Comment with sticky toolbar', () => {
	let page: PuppeteerPage;
	beforeAll(() => {
		page = global.page;
	});

	afterEach(async () => {
		await snapshot(page);
	});

	describe('disabled', () => {
		test('without scroll', async () => {
			await initCommentEditorWithAdf(page, createDocumentWithParagraphs(10), undefined, undefined, {
				useStickyToolbar: false,
			});
		});

		test('with scroll', async () => {
			await initCommentEditorWithAdf(page, createDocumentWithParagraphs(10), undefined, undefined, {
				useStickyToolbar: false,
			});
			await clickEditableContent(page);
			await scrollToBottom(page);
			await animationFrame(page);
		});
	});

	describe('enabled', () => {
		test('without scroll', async () => {
			await initCommentEditorWithAdf(page, createDocumentWithParagraphs(10), undefined, undefined, {
				useStickyToolbar: true,
			});
		});

		test('with scroll', async () => {
			const url = getExampleUrl('editor', 'editor-core', 'jira-clone');
			const { page } = global;

			await loadPage(page, url);
			await page.waitForSelector('div[data-testid="ak-editor-main-toolbar"]');

			await clickEditableContent(page);
			await scrollToBottom(page);
			await animationFrame(page);
		});

		test('offsetTop can set offset of sticky toolbar', async () => {
			const url = getExampleUrl('editor', 'editor-core', 'jira-clone-right-panel');
			const { page } = global;

			await loadPage(page, url);
			await page.waitForSelector('div[data-testid="ak-editor-main-toolbar"]');

			await clickEditableContent(page);
			await scrollToBottom(page);
			await animationFrame(page);
		});
	});
});
