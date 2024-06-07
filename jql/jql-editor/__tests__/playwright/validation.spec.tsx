import { expect, test } from '@af/integration-testing';

import { mockIntl } from '../../mocks';
import { errorMessages } from '../../src/plugins/jql-ast/messages';

import { JQLEditorPage } from './page';

test.describe('JQL Editor validations', () => {
	test('Shows a tooltip when hovering an invalid token', async ({ page }) => {
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample('basic-editor');
		await jqlEditor.input.clear();
		await jqlEditor.appendInputValue('somefield == somevalue');
		await jqlEditor.errorToken.hover();
		const expectedMessage = mockIntl.formatMessage(
			errorMessages.expectingValueOrFunctionButReceived,
			{
				received: '=',
			},
		);
		await expect(jqlEditor.validationTooltip).toBeVisible();
		await expect(jqlEditor.validationTooltip).toHaveText(expectedMessage);
	});

	test('Shows an error message when invalid query is submitted', async ({ page }) => {
		const jqlEditor = new JQLEditorPage(page);
		await jqlEditor.visitExample('basic-editor');
		await jqlEditor.input.clear();
		await jqlEditor.appendInputValue('ORDER BY created des');
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
		// Our invalid token will be selected so lets type the correct sort direction
		await jqlEditor.appendInputValue('c');
		// Submit the valid query
		await jqlEditor.searchButton.click();
		// Validation message should disappear
		await expect(jqlEditor.validation).toBeHidden();
	});
});
