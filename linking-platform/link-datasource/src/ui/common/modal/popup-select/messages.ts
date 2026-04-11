import { defineMessages } from 'react-intl-next';

export const asyncPopupSelectMessages: {
	selectPlaceholder: {
		id: string;
		description: string;
		defaultMessage: string;
	};
	paginationDetails: {
		id: string;
		description: string;
		defaultMessage: string;
	};
} = defineMessages({
	selectPlaceholder: {
		id: 'linkDataSource.basic-filter.dropdown.select.placeholder',
		description: 'Placeholder text to be displayed for the search input box.',
		defaultMessage: 'Search',
	},
	paginationDetails: {
		id: 'linkDataSource.basic-filter.footer.pagination-details',
		description: 'Text to indicate page count and total count information.',
		defaultMessage: '{currentDisplayCount} of {totalCount}',
	},
});
