import { BROWSERS, expect, fixTest, test } from '@af/integration-testing';

import { JQLEditorPage } from './page';

test.describe('JQL Editor Autocomplete', () => {
	test('Autocomplete allows users to form queries', async ({ page }) => {
		fixTest({
			jiraIssueId: 'UTEST-1839',
			reason:
				'Skipped due to a timeout issue with locating elements in Chromium after upgrading to Playwright 1.44.1',
			browsers: [BROWSERS.chromium],
		});
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample('basic-editor');
		// Field
		await jqlEditor.input.clear();
		await jqlEditor.appendInputValue('as');
		await jqlEditor.selectAutocompleteOption('assignee');
		await expect(jqlEditor.input).toHaveText('assignee');
		// Operator
		await jqlEditor.appendInputValue(' I');
		await jqlEditor.selectAutocompleteOptionWithKeyboard('IN');
		await expect(jqlEditor.input).toHaveText('assignee IN');
		// Operand
		await jqlEditor.appendInputValue(' cu');
		await jqlEditor.selectAutocompleteOption('currentUser()');
		await jqlEditor.appendInputValue(')');
		await expect(jqlEditor.input).toHaveText('assignee IN (currentUser())');
	});

	test('Autocomplete allows users to form queries with Popper FF', async ({ page }) => {
		fixTest({
			jiraIssueId: 'UTEST-1839',
			reason:
				'Skipped due to a timeout issue with locating elements in Chromium after upgrading to Playwright 1.44.1',
			browsers: [BROWSERS.chromium],
		});
		
		// Enable Popper FF
		await page.addInitScript(() => {
			window.localStorage.setItem('platform.jql_editor_autocomplete_use_popper', 'true');
		});
		
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample('basic-editor');
		// Field
		await jqlEditor.input.clear();
		await jqlEditor.appendInputValue('as');
		await jqlEditor.selectAutocompleteOption('assignee');
		await expect(jqlEditor.input).toHaveText('assignee');
		// Operator
		await jqlEditor.appendInputValue(' I');
		await jqlEditor.selectAutocompleteOptionWithKeyboard('IN');
		await expect(jqlEditor.input).toHaveText('assignee IN');
		// Operand
		await jqlEditor.appendInputValue(' cu');
		await jqlEditor.selectAutocompleteOption('currentUser()');
		await jqlEditor.appendInputValue(')');
		await expect(jqlEditor.input).toHaveText('assignee IN (currentUser())');
	});

	test('Autocomplete replaces quoted string when inner text is selected', async ({ page }) => {
		fixTest({
			jiraIssueId: 'UTEST-1839',
			reason:
				'Skipped due to a timeout issue with locating elements in Chromium after upgrading to Playwright 1.44.1',
			browsers: [BROWSERS.chromium],
		});
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample('basic-editor');
		await jqlEditor.input.clear();
		await jqlEditor.appendInputValue('project = "JSW"');
		await jqlEditor.selectText('JSW');
		await jqlEditor.selectAutocompleteOption('Classic');
		await expect(jqlEditor.input).toHaveText('project = CLS');
	});

	test('Autocomplete replaces quoted string when inner text is selected with Popper FF', async ({ page }) => {
		fixTest({
			jiraIssueId: 'UTEST-1839',
			reason:
				'Skipped due to a timeout issue with locating elements in Chromium after upgrading to Playwright 1.44.1',
			browsers: [BROWSERS.chromium],
		});
		
		// Enable Popper FF
		await page.addInitScript(() => {
			window.localStorage.setItem('platform.jql_editor_autocomplete_use_popper', 'true');
		});
		
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample('basic-editor');
		await jqlEditor.input.clear();
		await jqlEditor.appendInputValue('project = "JSW"');
		await jqlEditor.selectText('JSW');
		await jqlEditor.selectAutocompleteOption('Classic');
		await expect(jqlEditor.input).toHaveText('project = CLS');
	});

	test('Autocomplete replaces only selected range when selection spans across multiple tokens', async ({
		page,
	}) => {
		fixTest({
			jiraIssueId: 'UTEST-1839',
			reason:
				'Skipped due to a timeout issue with locating elements in Chromium after upgrading to Playwright 1.44.1',
			browsers: [BROWSERS.chromium],
		});
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample('basic-editor');
		await jqlEditor.input.clear();
		await jqlEditor.appendInputValue('project = "JSW"');
		await jqlEditor.selectText('oject = "JS');
		await jqlEditor.selectAutocompleteOption('projectType');
		await expect(jqlEditor.input).toHaveText('projectTypeW"');
	});

	test('Autocomplete replaces only selected range when selection starts at beginning of token', async ({
		page,
	}) => {
		fixTest({
			jiraIssueId: 'UTEST-1839',
			reason:
				'Skipped due to a timeout issue with locating elements in Chromium after upgrading to Playwright 1.44.1',
			browsers: [BROWSERS.chromium],
		});
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample('basic-editor');
		await jqlEditor.input.clear();
		await jqlEditor.appendInputValue('project = "JSW"');
		await jqlEditor.selectText('"JS');
		await jqlEditor.selectAutocompleteOption('Classic');
		await expect(jqlEditor.input).toHaveText('project = CLSW"');
	});

	test('Autocomplete replaces quoted string when caret is positioned inside the token', async ({
		page,
	}) => {
		fixTest({
			jiraIssueId: 'UTEST-1839',
			reason:
				'Skipped due to a timeout issue with locating elements in Chromium after upgrading to Playwright 1.44.1',
			browsers: [BROWSERS.chromium],
		});
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample('basic-editor');
		await jqlEditor.input.clear();
		await jqlEditor.appendInputValue('project = "JSW"');
		await jqlEditor.setCursorAfter('"JS');
		await jqlEditor.selectAutocompleteOption('Classic');
		await expect(jqlEditor.input).toHaveText('project = CLS');
	});

	test('Autocomplete replaces only function name (leaving parentheses) when caret is positioned inside a function', async ({
		page,
	}) => {
		fixTest({
			jiraIssueId: 'UTEST-1839',
			reason:
				'Skipped due to a timeout issue with locating elements in Chromium after upgrading to Playwright 1.44.1',
			browsers: [BROWSERS.chromium],
		});
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample('basic-editor');
		await jqlEditor.input.clear();
		await jqlEditor.appendInputValue('project = projectsLeadByUser()');
		await jqlEditor.setCursorAfter('projectsLead');
		await jqlEditor.selectAutocompleteOption('Classic');
		await expect(jqlEditor.input).toHaveText('project = CLS()');
	});

	test('Autocomplete inserts parentheses when selecting a function that supports single value operators', async ({
		page,
	}) => {
		fixTest({
			jiraIssueId: 'UTEST-1839',
			reason:
				'Skipped due to a timeout issue with locating elements after upgrading to Playwright 1.44.1',
		});
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample('basic-editor');
		await jqlEditor.input.clear();
		await jqlEditor.appendInputValue('assignee IN ');
		await jqlEditor.selectAutocompleteOption('currentUser()');
		await expect(jqlEditor.input).toHaveText('assignee IN (currentUser()');
	});

	test('Autocomplete does not insert parentheses when selecting a function that supports list operators', async ({
		page,
	}) => {
		fixTest({
			jiraIssueId: 'UTEST-1839',
			reason:
				'Skipped due to a timeout issue with locating elements after upgrading to Playwright 1.44.1',
		});
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample('basic-editor');
		await jqlEditor.input.clear();
		await jqlEditor.appendInputValue('project IN ');
		await jqlEditor.selectAutocompleteOption('projectsLeadByUser()');
		await expect(jqlEditor.input).toHaveText('project IN projectsLeadByUser()');
	});

	test('Autocomplete does not insert parentheses when selecting a function that supports list or single value operators', async ({
		page,
	}) => {
		fixTest({
			jiraIssueId: 'UTEST-1839',
			reason:
				'Skipped due to a timeout issue with locating elements after upgrading to Playwright 1.44.1',
		});
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample('basic-editor');
		await jqlEditor.input.clear();
		await jqlEditor.appendInputValue('assignee IN ');
		await jqlEditor.selectAutocompleteOption('myForgeJqlFunction()');
		await expect(jqlEditor.input).toHaveText('assignee IN myForgeJqlFunction()');
	});
});
