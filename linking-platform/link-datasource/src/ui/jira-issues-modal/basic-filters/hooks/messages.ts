import { defineMessages } from 'react-intl';

export const filterOptionMessages: {
	assigneeUnassignedFilterOption: {
		id: string;
		description: string;
		defaultMessage: string;
	};
} = defineMessages({
	assigneeUnassignedFilterOption: {
		id: 'linkDataSource.basic-filter.dropdown.select.assignee.unassigned',
		description: 'Text to display for Unassigned assignee filter option.',
		defaultMessage: 'Unassigned',
	},
});
