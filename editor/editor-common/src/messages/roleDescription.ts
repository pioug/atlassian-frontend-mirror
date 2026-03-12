import { defineMessages } from 'react-intl-next';

export const roleDescriptionMessages = defineMessages({
	codeSnippetTextBox: {
		id: 'fabric.editor.ariaRoleDescription.codeSnippetTextBox',
		defaultMessage: 'codesnippet textbox',
		description:
			'Aria role description for code snippet textbox. We are overriding the HTML role textbox so the translation should match the translation of the HTML role textbox in the language being used, but with "code snippet" added to the beginning to differentiate it from a regular textbox.',
	},
});
