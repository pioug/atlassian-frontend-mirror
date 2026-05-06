import { defineMessages } from 'react-intl';

export const sortingIconMessages: {
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
		// eslint-disable-next-line @atlassian/i18n/no-multiple-whitespaces
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	noOrderLabel: {
		id: 'fabric.editor.headingLink.noOrderLabel',
		defaultMessage: 'Sort column A to Z',
		description:
			'Label shown on a table column header sort button to sort the column alphabetically from A to Z (ascending order).',
	},
	ascOrderLabel: {
		id: 'fabric.editor.headingLink.ascOrderLabel',
		defaultMessage: 'Sort column Z to A',
		description:
			'Label shown on a table column header sort button to sort the column alphabetically from Z to A (descending order).',
	},
	descOrderLabel: {
		id: 'fabric.editor.headingLink.descOrderLabel',
		defaultMessage: 'Clear sorting',
		description:
			'Label shown on a table column header sort button to remove any active sorting and restore the default column order.',
	},
	invalidLabel: {
		id: 'fabric.editor.headingLink.invalidLabel',
		// eslint-disable-next-line @atlassian/i18n/no-multiple-whitespaces
		defaultMessage: `⚠️  You can't sort a table with merged cells`,
		description:
			'Warning message shown in a table column header when sorting cannot be applied because the table contains merged cells.',
	},
});

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
