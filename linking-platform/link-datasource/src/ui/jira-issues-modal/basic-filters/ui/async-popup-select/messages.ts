import { defineMessages } from 'react-intl-next';

export const asyncPopupSelectMessages = defineMessages({
	projectLabel: {
		id: 'linkDataSource.basic-filter.project.label',
		description: 'Label to be displayed for project filter dropdown button.',
		defaultMessage: 'Project',
	},
	statusLabel: {
		id: 'linkDataSource.basic-filter.status.label',
		description: 'Label to be displayed for status filter dropdown button.',
		defaultMessage: 'Status',
	},
	typeLabel: {
		id: 'linkDataSource.basic-filter.type.label',
		description: 'Label to be displayed for type filter dropdown button.',
		defaultMessage: 'Type',
	},
	assigneeLabel: {
		id: 'linkDataSource.basic-filter.assignee.label',
		description: 'Label to be displayed for assignee filter dropdown button.',
		defaultMessage: 'Assignee',
	},
});
