import { defineMessages } from 'react-intl-next';

export const issueLikeTableMessages = defineMessages({
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
});
