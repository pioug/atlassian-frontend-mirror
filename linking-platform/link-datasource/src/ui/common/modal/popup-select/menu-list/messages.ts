import { defineMessages } from 'react-intl-next';

export const asyncPopupSelectMessages = defineMessages({
	loadingMessage: {
		id: 'linkDataSource.basic-filter.loading-message',
		defaultMessage: 'Loading...',
		description: 'The text for when options are being loaded in dropdown',
	},
	noOptionsMessage: {
		id: 'linkDataSource.basic-filter.no-options-message',
		defaultMessage: 'No matches found',
		description: 'The text for when no matches are found in dropdown',
	},
	errorMessage: {
		id: 'linkDataSource.basic-filter.error-message',
		defaultMessage: 'Something went wrong',
		description: 'The text for when an error occurs when loading options',
	},
	showMoreMessage: {
		id: 'linkDataSource.basic-filter.showMoreButton',
		defaultMessage: 'Show more',
		description: 'The text to show more options in dropdown',
	},
});
