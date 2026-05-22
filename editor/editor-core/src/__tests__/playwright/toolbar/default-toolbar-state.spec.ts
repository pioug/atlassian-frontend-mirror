import { expect, editorNoFocusedTestCase as test } from '@af/editor-libra';
import { EditorHeadingMenu, EditorMainToolbarModel } from '@af/editor-libra/page-models';

import {
	headingAndFormattingAdf,
	highlightAdf,
	rightAlignedAdf,
	taskListAdf,
} from './default-toolbar-state.spec.ts-fixtures';

const testConfig = {
	exampleName: 'testing' as keyof typeof import('../../../../examples/99-testing.tsx'),
	initialPluginConfiguration: {
		toolbarPlugin: {
			enableNewToolbarExperience: true,
		},
	},
	editorExperiments: {
		platform_editor_default_toolbar_state: true,
		platform_editor_no_cursor_on_edit_page_init: true,
	},
};

test.describe('Initial toolbar should be disabled', () => {
	test.use({
		...testConfig,
		adf: headingAndFormattingAdf,
		editorProps: {
			appearance: 'full-page',
			allowTextAlignment: true,
			allowTasksAndDecisions: true,
			allowTextColor: true,
			plugins: [['highlightPlugin']],
		},
	});

	test('should disable every visible toolbar button before the user interacts with the editor', async ({
		editor,
	}) => {
		const toolbar = EditorMainToolbarModel.from(editor);
		const toolbarButtons = toolbar.wrapper.getByRole('button');

		await expect(toolbar.wrapper).toBeVisible();
		const buttonCount = await toolbarButtons.count();
		expect(buttonCount).toBeGreaterThan(0);

		for (let index = 0; index < buttonCount; index++) {
			await expect(toolbarButtons.nth(index)).toBeDisabled();
		}
	});
});

test.describe('Block type dropdown', () => {
	test.use({
		...testConfig,
		adf: headingAndFormattingAdf,
		editorProps: {
			appearance: 'full-page',
			allowTextAlignment: true,
			allowTasksAndDecisions: true,
			allowTextColor: true,
			plugins: [['highlightPlugin']],
		},
	});

	test('should show "Normal text" in the heading menu as disabled before interaction, even when doc starts with heading', async ({
		editor,
	}) => {
		const headingMenu = EditorHeadingMenu.from(editor);
		await expect(headingMenu.headingMenu).toContainText('Normal text');
		await expect(headingMenu.headingMenu).toBeDisabled();
	});

	test('should update heading menu to "Heading 3" after user clicks into the heading', async ({
		editor,
	}) => {
		const headingMenu = EditorHeadingMenu.from(editor);
		await editor.page.getByText('Heading content').click();
		await expect(headingMenu.headingMenu).toContainText('Heading 3');
		await expect(headingMenu.headingMenu).toBeEnabled();
	});
});

test.describe('Alignment button', () => {
	test.use({
		...testConfig,
		adf: rightAlignedAdf,
		editorProps: {
			appearance: 'full-page',
			allowTextAlignment: true,
			allowTasksAndDecisions: true,
			allowTextColor: true,
			plugins: [['highlightPlugin']],
		},
	});

	test('should show left-aligned button as disabled before interaction, even when doc starts with right-aligned content', async ({
		editor,
	}) => {
		const toolbar = EditorMainToolbarModel.from(editor);
		const alignButton = toolbar.wrapper.getByRole('button', { name: /Text alignment/iu });
		await expect(alignButton).toBeVisible();
		await expect(alignButton).toBeDisabled();
		await expect(alignButton.getByTestId('text-alignment-menu-start-icon')).toBeVisible();
	});

	test('should update to right-align icon after user clicks into right-aligned content', async ({
		editor,
	}) => {
		const toolbar = EditorMainToolbarModel.from(editor);
		const alignButton = toolbar.wrapper.getByRole('button', { name: /Text alignment/iu });
		await expect(alignButton.getByTestId('text-alignment-menu-start-icon')).toBeVisible();
		await editor.page.getByText('Right aligned text').click();
		await expect(alignButton).toBeEnabled();
		await expect(alignButton.getByTestId('text-alignment-menu-end-icon')).toBeVisible();
		await expect(alignButton.getByTestId('text-alignment-menu-start-icon')).toBeHidden();
	});
});

test.describe('List button', () => {
	test.use({
		...testConfig,
		adf: taskListAdf,
		editorProps: {
			appearance: 'full-page',
			allowTextAlignment: true,
			allowTasksAndDecisions: true,
			allowTextColor: true,
			plugins: [['highlightPlugin']],
		},
	});

	test('should show unordered list icon as disabled before interaction, even when doc starts with task list', async ({
		editor,
	}) => {
		const toolbar = EditorMainToolbarModel.from(editor);
		const listButton = toolbar.wrapper.getByRole('button', { name: /Bulleted list/iu });
		await expect(listButton).toBeVisible();
		await expect(listButton).toBeDisabled();
	});

	test('should show task list icon after user clicks into task list', async ({ editor }) => {
		const toolbar = EditorMainToolbarModel.from(editor);
		await editor.page.getByText('Task item').click();
		const listButton = toolbar.wrapper.getByRole('button', { name: /Task list/iu });
		await expect(listButton).toBeEnabled();
	});
});

test.describe('Highlight color button', () => {
	test.use({
		...testConfig,
		adf: highlightAdf,
		editorProps: {
			appearance: 'full-page',
			allowTextAlignment: true,
			allowTasksAndDecisions: true,
			allowTextColor: true,
			plugins: [['highlightPlugin']],
		},
	});

	test('should not show highlight color before interaction, even when doc starts with highlighted text', async ({
		editor,
	}) => {
		const highlightButton = editor.page.getByTestId('text-color-highlight-menu');
		const highlightSwatch = editor.page.getByTestId('toolbar-color-swatch');
		await expect(highlightButton).toBeDisabled();
		await expect(highlightSwatch).toBeVisible();
		await expect(highlightSwatch).not.toHaveAttribute('style', /background-color/iu);
	});

	test('should show highlight color after user clicks into highlighted text', async ({
		editor,
	}) => {
		const highlightButton = editor.page.getByTestId('text-color-highlight-menu');
		const highlightSwatch = editor.page.getByTestId('toolbar-color-swatch');
		await editor.page.getByText('world!').click();
		await expect(highlightButton).toBeEnabled();
		await expect(highlightSwatch).toHaveAttribute('style', /background-color:/iu);
	});
});
