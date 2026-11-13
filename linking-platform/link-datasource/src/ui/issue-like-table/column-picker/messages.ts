import { defineMessages } from 'react-intl';

export const columnPickerMessages: {
	maximumItemsShownLine1: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	maximumItemsShownLine2: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	reorderHint: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	search: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	tooltip: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	maximumItemsShownLine1: {
		id: 'linkDataSource.column-picker.no-all-items-shown-message.line-1',
		description:
			'First line of the messages shown at the bottom of column dropdown options explaining why not all available options are shown and how to get to them.',
		defaultMessage: 'Your search returned too many results.',
	},
	maximumItemsShownLine2: {
		id: 'linkDataSource.column-picker.no-all-items-shown-message.line-2',
		description:
			'Second line of the messages shown at the bottom of column dropdown options explaining why not all available options are shown and how to get to them.',
		defaultMessage: 'Try again with more specific keywords.',
	},
	search: {
		id: 'linkDataSource.column-picker.search',
		description: 'Search bar message to look for more fields',
		defaultMessage: 'Search for fields',
	},
	reorderHint: {
		id: 'linkDataSource.column-picker.reorderHint',
		description:
			'Hint shown above the selected attributes in the column picker dropdown, explaining that they can be dragged to change the order the columns are displayed in the table.',
		defaultMessage: 'Drag attributes to change their display order',
	},
	tooltip: {
		id: 'linkDataSource.column-picker.tooltip',
		description: 'Tooltip message for the column picker button',
		defaultMessage: 'Configure columns',
	},
});
