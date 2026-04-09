import { defineMessages } from 'react-intl-next';

export const siteSelectorMessages: {
    chooseSite: {
        id: string;
        description: string;
        defaultMessage: string;
    };
} = defineMessages({
	chooseSite: {
		id: 'linkDataSource.jira-issues.configmodal.chooseSite',
		description: 'Label for input letting user know they have to choose a site',
		defaultMessage: 'Select a site',
	},
});
