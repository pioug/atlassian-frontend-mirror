import { defineMessages } from 'react-intl';

export const messages: {
    syntaxHelpDescription: {
        defaultMessage: string;
        description: string;
        id: string;
    }; syntaxHelpTooltip: {
        defaultMessage: string;
        description: string;
        id: string;
    };
} = defineMessages({
	syntaxHelpDescription: {
		id: 'jql-editor.ui.jql-editor-footer-content.jql-editor-help.syntax-help.description',
		defaultMessage: 'Open JQL syntax help in a new tab.',
		description: 'Description read when the syntax help link is focused.',
	},
	syntaxHelpTooltip: {
		id: 'jql-editor.ui.jql-editor-footer-content.jql-editor-help.syntax-help.tooltip',
		defaultMessage: 'Syntax help',
		description: 'Tooltip to show when the syntax help link is focused.',
	},
});
