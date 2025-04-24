import { defineMessages } from 'react-intl-next';

export const asyncPopupSelectMessages = defineMessages({
	loadingMessage: {
		id: 'linkDataSource.basic-filter.loading-message',
		defaultMessage: 'Loading...',
		description: 'The text for when options are being loaded in dropdown',
	},
	noOptionsMessage: {
		id: 'linkDataSource.basic-filter.no-options-message',
		defaultMessage: "We couldn't find anything matching your search",
		description: 'The text for when no matches are found in dropdown',
	},
	noOptionsMessageOld: {
		id: 'linkDataSource.basic-filter.no-options-message-old',
		defaultMessage: 'No matches found',
		description: 'The text for when no matches are found in dropdown',
	},
	noOptionsDescription: {
		id: 'linkDataSource.basic-filter.no-options-description',
		defaultMessage: 'Try again with a different term.',
		description: 'The helper text for when no matches are found in dropdown',
	},
	errorMessage: {
		id: 'linkDataSource.basic-filter.errorMessage',
		defaultMessage: 'We ran into an issue trying to load results',
		description: 'The text for when an error occurs when loading options',
	},
	errorMessageOld: {
		id: 'linkDataSource.basic-filter.errorMessageOld',
		defaultMessage: 'Something went wrong',
		description: 'The text for when an error occurs when loading options',
	},
	errorDescription: {
		id: 'linkDataSource.basic-filter.error-description',
		defaultMessage: 'Check your connection and refresh',
		description: 'The helper text for when no matches are found in dropdown',
	},
	showMoreMessage: {
		id: 'linkDataSource.basic-filter.showMoreButton',
		defaultMessage: 'Show more',
		description: 'The text to show more options in dropdown',
	},
});
