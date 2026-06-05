import { defineMessages } from 'react-intl';

export const sortingAriaLabelMessages: {
	noOrderLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	ascOrderLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	descOrderLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	invalidLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	defaultLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	noOrderLabel: {
		id: 'fabric.editor.tableHeader.sorting.no',
		defaultMessage: 'No sort applied to the column',
		description:
			'Aria-label for Sort column button when sorting was not applied or the sorting has been cleared',
	},
	ascOrderLabel: {
		id: 'fabric.editor.tableHeader.sorting.asc',
		defaultMessage: 'Ascending sort applied',
		description: 'Aria-label for Sort column button when ascending sorting was applied',
	},
	descOrderLabel: {
		id: 'fabric.editor.tableHeader.sorting.desc',
		defaultMessage: 'Descending sort applied',
		description: 'Aria-label for Sort column button when descending sorting was applied',
	},
	invalidLabel: {
		id: 'fabric.editor.tableHeader.sorting.invalid',
		defaultMessage: `You can't sort a table with merged cells`,
		description: 'Aria-label for Sort column button when sorting is not possible',
	},
	defaultLabel: {
		id: 'fabric.editor.tableHeader.sorting.default',
		defaultMessage: 'Sort the column',
		description: 'Default aria-label for Sort column button',
	},
});
