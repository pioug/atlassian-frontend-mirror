import { defineMessages } from 'react-intl-next';

export const displayViewDropDownMessages = defineMessages({
	viewModeListLabel: {
		id: 'linkDataSource.jira-issues.configmodal.viewModeListLabel',
		description: 'Display search results as a list',
		defaultMessage: 'List',
	},
	viewModeListDescription: {
		id: 'linkDataSource.jira-issues.configmodal.viewModeListDescription',
		description: 'Description for list view mode',
		defaultMessage: 'Display search results as a list',
	},
	viewModeInlineLinkLabel: {
		id: 'linkDataSource.jira-issues.configmodal.viewModeInlineLinkLabel',
		description: 'Display the number of search results as an inline smart link',
		defaultMessage: 'Inline link',
	},
	viewModeInlineLinkDescription: {
		id: 'linkDataSource.jira-issues.configmodal.viewModeInlineLinkDescription',
		description: 'Description for inline link view mode',
		defaultMessage: 'Display the number of search results as an inline Smart Link',
	},
});
