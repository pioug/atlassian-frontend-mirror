import { defineMessages } from 'react-intl-next';

export const issueLikeTableMessages = defineMessages({
	goToResourceLink: {
		id: 'linkDataSource.issue-line-table.go-to-resource.nonfinal',
		description: 'Link to navigate to the resource page',
		defaultMessage: 'Go to item',
	},
	updateErrorGenericDescription: {
		id: 'linkDataSource.issue-line-table.error-generic-description.nonfinal',
		description: 'Generic error message description shown when updating issue field fails',
		defaultMessage:
			'We had an issue trying to complete the update. Refresh the page and try again.',
	},
	updateErrorGenericTitle: {
		id: 'linkDataSource.issue-line-table.error-generic-title.nonfinal',
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
