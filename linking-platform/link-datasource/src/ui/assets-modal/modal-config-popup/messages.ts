import { defineMessages } from 'react-intl';

export const modalConfigPopupMessages: {
	configureTable: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	nestedReferenceAttributeSelection: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	objectsPerPage: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	tablePagination: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	configureTable: {
		id: 'linkDataSource.assets.configModal.configPopup.configureTable',
		description:
			'Tooltip and accessibility label for the icon button that opens the Assets table configuration popup',
		defaultMessage: 'Configure table',
	},
	nestedReferenceAttributeSelection: {
		id: 'linkDataSource.assets.configModal.configPopup.nestedReferenceAttributeSelection',
		description:
			'Label for the checkbox that allows users to select attributes of referenced objects (nested attributes) as table columns',
		defaultMessage: 'Enable nested reference attribute selection',
	},
	objectsPerPage: {
		id: 'linkDataSource.assets.configModal.configPopup.objectsPerPage',
		description:
			'Option label in the pagination select showing how many Assets objects are displayed per table page. {count} is the number of objects.',
		defaultMessage: '{count, plural, one {# object per page} other {# objects per page}}',
	},
	tablePagination: {
		id: 'linkDataSource.assets.configModal.configPopup.tablePagination',
		description:
			'Label for the select input where users choose how many Assets objects are displayed per table page',
		defaultMessage: 'Table pagination:',
	},
});
