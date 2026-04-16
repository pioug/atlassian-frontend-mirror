import { defineMessages } from 'react-intl';

export const messages = defineMessages({
	deprecatedParentReplacementMessage: {
		id: 'jql-editor.ui.jql-warning-message.deprecated-epic-link-or-parent-link-field',
		defaultMessage:
			'{deprecatedField} will soon be replaced with {parentReplacement}. <link>Update to {parentReplacement}</link> to prepare for these changes.',
		description: 'Warning message for Epic Link and Parent Link deprecation, with link to docs',
	},
	deprecatedBothParentReplacementMessage: {
		id: 'jql-editor.ui.jql-warning-message.deprecated-both-epic-link-parent-link-field',
		defaultMessage:
			'{receivedFirst} and {receivedSecond} will soon be replaced with {parentReplacement}. <link>Update to {parentReplacement}</link> to prepare for these changes.',
		description:
			'Warning message for both Epic Link and Parent Link deprecation, with link to docs',
	},
	defaultWarning: {
		id: 'jql-editor.ui.jql-warning-message.default',
		defaultMessage: '{deprecatedField} has been deprecated and may stop working in the future.',
		description: 'The text is shown as a warning message in the JQL editor footer when a deprecated field is used in the query. The placeholder {deprecatedField} will be substituted with the name of the deprecated JQL field.',
	},
});
