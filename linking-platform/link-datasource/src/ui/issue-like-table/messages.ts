import { defineMessages } from 'react-intl';

export const issueLikeTableMessages: {
	fetchActionErrorGenericDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	fetchActionErrorGenericDescriptionGalaxia: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	fetchActionErrorGenericTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	sortByColumnAscendingAction: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	sortByColumnDescendingAction: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	unwrapText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	updateError403Description: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	updateError403Title: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	updateErrorGenericDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	updateErrorGenericTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	wrapText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	updateError403Description: {
		id: 'linkDataSource.issue-line-table.error-403-description',
		description:
			'Generic error message description shown when updating issue field fails due to user does not have permission to update.',
		defaultMessage: 'You need the right permissions to edit this item.',
	},
	updateError403Title: {
		id: 'linkDataSource.issue-line-table.error-403-title',
		description:
			'Generic error message title shown when updating issue field fails due to user does not have permission to update.',
		defaultMessage: 'Changes not saved',
	},
	updateErrorGenericDescription: {
		id: 'linkDataSource.issue-line-table.error-generic-description',
		description: 'Generic error message description shown when updating issue field fails',
		defaultMessage:
			'We had an issue trying to complete the update. Wait a few minutes, then try again. Contact support if this keeps happening.',
	},
	updateErrorGenericTitle: {
		id: 'linkDataSource.issue-line-table.error-generic-title',
		description: 'Generic error message title shown when updating issue field fails',
		defaultMessage: 'Something went wrong',
	},
	fetchActionErrorGenericDescription: {
		id: 'linkDataSource.issue-line-table.fetch-action-error-generic-description',
		description:
			'Generic error message description shown when fetching inline edit dropdown field fails',
		defaultMessage:
			'Wait a few minutes, then try again. Check your project settings or contact support if this keeps happening.',
	},
	fetchActionErrorGenericTitle: {
		id: 'linkDataSource.issue-line-table.fetch-action-error-generic-title',
		description: 'Generic error message title shown when fetching inline edit dropdown field fails',
		defaultMessage: 'We’re having trouble fetching options',
	},
	wrapText: {
		id: 'linkDataSource.issue-line-table.wrap-text',
		description: 'Table header Dropdown item for making whole column to wrap text',
		defaultMessage: 'Wrap text',
	},
	unwrapText: {
		id: 'linkDataSource.issue-line-table.unwrap-text',
		description: 'Table header Dropdown item for making whole column to not wrap text',
		defaultMessage: 'Unwrap text',
	},
	sortByColumnAscendingAction: {
		id: 'linkDataSource.issue-line-table.sort-by-column-ascending-action',
		description: 'Accessible label for sorting a table column in ascending order',
		defaultMessage: 'Sort by {column} ascending.',
	},
	sortByColumnDescendingAction: {
		id: 'linkDataSource.issue-line-table.sort-by-column-descending-action',
		description: 'Accessible label for sorting a table column in descending order',
		defaultMessage: 'Sort by {column} descending.',
	},
	fetchActionErrorGenericDescriptionGalaxia: {
		id: 'linkDataSource.issue-line-table.fetch-action-error-generic-description-galaxia',
		description:
			'Generic error message description shown when fetching inline edit dropdown field fails',
		defaultMessage:
			'Wait a few minutes, then try again. Check your space settings or contact support if this keeps happening.',
	},
});
