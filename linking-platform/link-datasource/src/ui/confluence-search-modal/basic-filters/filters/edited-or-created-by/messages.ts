import { defineMessages } from 'react-intl';

export const editedOrCreatedByMessage: {
	buttonLabel: {
		id: string;
		description: string;
		defaultMessage: string;
	};
} = defineMessages({
	buttonLabel: {
		id: 'linkDataSource.clol-basic-filter.editedOrCreatedBy.label',
		description: 'Label to be displayed for "Edited or created by" filter dropdown button.',
		defaultMessage: 'Edited or created by',
	},
});
