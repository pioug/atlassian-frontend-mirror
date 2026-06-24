import { defineMessages } from 'react-intl';

export const messages: {
	optionsFound: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	teamGroupTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	optionsFound: {
		id: 'jql-editor.plugins.autocomplete.options-found',
		defaultMessage: 'Choose from the suggested list of options below.',
		description:
			'This message is read by screen readers when autocomplete suggestions are available in the JQL editor.',
	},
	teamGroupTitle: {
		id: 'jql-editor.plugins.autocomplete.team-group-title',
		defaultMessage: 'Teams',
		description:
			'Section heading shown above team autocomplete suggestions when editing a membersOf() JQL function argument.',
	},
});
