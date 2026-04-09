import { defineMessages } from 'react-intl-next';

export const displayViewDropDownMessages: {
    viewModeListLabel: {
        id: string;
        description: string;
        defaultMessage: string;
    }; viewModeListDescription: {
        id: string;
        description: string;
        defaultMessage: string;
    }; viewModeListDescriptionOld: {
        id: string;
        description: string;
        defaultMessage: string;
    }; viewModeInlineLinkLabel: {
        id: string;
        description: string;
        defaultMessage: string;
    }; viewModeInlineLinkDescription: {
        id: string;
        description: string;
        defaultMessage: string;
    }; viewModeInlineLinkDescriptionOld: {
        id: string;
        description: string;
        defaultMessage: string;
    };
} = defineMessages({
	viewModeListLabel: {
		id: 'linkDataSource.jira-issues.configmodal.viewModeListLabel',
		description: 'Display search results as a list',
		defaultMessage: 'List',
	},
	viewModeListDescription: {
		id: 'linkDataSource.jira-issues.configmodal.viewModeListDescription',
		description: 'Description for list view mode',
		defaultMessage: 'Display the number of search results as a list',
	},
	viewModeListDescriptionOld: {
		id: 'linkDataSource.jira-issues.configmodal.viewModeListDescriptionOld',
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
		defaultMessage: 'Display the number of search results or as an inline Smart Link',
	},
	viewModeInlineLinkDescriptionOld: {
		id: 'linkDataSource.jira-issues.configmodal.viewModeInlineLinkDescriptionOld',
		description: 'Description for inline link view mode',
		defaultMessage: 'Display the number of search results as an inline Smart Link',
	},
});
