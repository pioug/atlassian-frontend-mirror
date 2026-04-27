import { defineMessages } from 'react-intl';

export const messages: {
    fieldNewLineCommand: {
        defaultMessage: string;
        description: string;
        id: string;
    }; newLineCommand: {
        defaultMessage: string;
        description: string;
        id: string;
    }; searchCommand: {
        defaultMessage: string;
        description: string;
        id: string;
    };
} = defineMessages({
	searchCommand: {
		id: 'jql-editor.ui.jql-editor-help.search-command',
		defaultMessage: '<b>Enter</b> to search',
		description: `Message to inform users to press the 'Enter' key on the keyboard to search a query.`,
	},
	newLineCommand: {
		id: 'jql-editor.ui.jql-editor-help.new-line-command',
		defaultMessage: '<b>Shift+Enter</b> to add a new line',
		description: `In search mode, message to inform users to press the 'Shift' and 'Enter' keys on the keyboard to add a new line into the query.`,
	},
	fieldNewLineCommand: {
		id: 'jql-editor.ui.jql-editor-help.field-new-line-command',
		defaultMessage: '<b>Enter</b> to add a new line',
		description: `In field mode, message to inform users to press the 'Enter' key on the keyboard to add a new line into the query.`,
	},
});
