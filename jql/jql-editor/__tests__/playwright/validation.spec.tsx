import { expect, test } from '@af/integration-testing';

import { mockIntl } from '../../mocks';
import { errorMessages } from '../../src/plugins/jql-ast/messages';

import { JQLEditorPage } from './page';

test.describe('JQL Editor validations', () => {
	test('Shows a tooltip when hovering an invalid token', async ({ page }) => {
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample<typeof import('../../examples/00-basic-editor.tsx')>(
			'basic-editor',
		);
		await jqlEditor.setInputValue('somefield == somevalue');
		// The invalid query has been parsed, so the highlighted error token belongs to it.
		await expect(jqlEditor.errorToken).toHaveCount(1);
		await jqlEditor.hoverErrorToken();
		const expectedMessage = mockIntl.formatMessage(
			errorMessages.expectingValueOrFunctionButReceived,
			{
				received: '=',
			},
		);
		await expect(jqlEditor.validationTooltip).toHaveText(expectedMessage);
	});

	test('Shows an error message when invalid query is submitted', async ({ page }) => {
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample<typeof import('../../examples/00-basic-editor.tsx')>(
			'basic-editor',
		);
		await jqlEditor.setInputValue('ORDER BY created des');
		// The invalid query has been parsed, so submitting it validates the query under test rather
		// than the one it replaced.
		await expect(jqlEditor.errorToken).toHaveCount(1);
		// Submit the invalid query
		await jqlEditor.searchButton.click();
		const expectedMessage = mockIntl.formatMessage(
			errorMessages.expectingMultipleTokensButReceived,
			{
				firstExpectedTokens: "'ASC'",
				lastExpectedToken: 'DESC',
				received: 'des',
			},
		);
		// Check if validation message exists and includes the expected message
		await expect(jqlEditor.validation).toBeVisible();
		await expect(jqlEditor.validation).toContainText(expectedMessage);
		// Append to the error token to correct the sort direction ('des' → 'desc')
		await jqlEditor.appendInputValue('c');
		// The corrected query has been parsed and no longer has an error to highlight.
		await expect(jqlEditor.errorToken).toHaveCount(0);
		// Submit the valid query
		await jqlEditor.searchButton.click();
		// Validation message should disappear
		await expect(jqlEditor.validation).toBeHidden();
	});
});
