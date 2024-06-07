import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	jqlErrorPosition: {
		id: 'jql-editor.ui.jql-validation-message.jql-error-position',
		defaultMessage: '(line {lineNumber}, character {charPosition})',
		description:
			'Show the line and character position that an error occurs in the JQL string, e.g. (line 1, character 23)',
	},
});
