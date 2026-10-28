import { defineMessages } from 'react-intl';

export const modalMessages: {
	assetsConfigModalTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	filterObjectsText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	insertIssuesButtonText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	insertObjectsTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	tablePreviewText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	updateObjectsButtonText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	updateObjectsButtonText: {
		id: 'linkDataSource.assets.configmodal.updateObjectsButtonText',
		description: 'Button text to update the displayed content',
		defaultMessage: 'Update table',
	},
	insertIssuesButtonText: {
		id: 'linkDataSource.assets.configmodal.insertIssuesButtonText',
		description: 'Button text to insert the displayed content',
		defaultMessage: 'Insert {objectsCount, plural, one {object} other {objects}}',
	},
	insertObjectsTitle: {
		id: 'linkDataSource.assets.configmodal.insertObjectsTitle',
		description:
			'Title for the Assets Objects Datasource config modal which prefixes a select picker',
		defaultMessage: 'Insert objects from',
	},
	assetsConfigModalTitle: {
		id: 'linkDataSource.assets.configmodal.title',
		description: 'Title for the Assets Objects Datasource config modal',
		defaultMessage: 'Assets table macro configuration',
	},
	filterObjectsText: {
		id: 'linkDataSource.assets.configmodal.filterObjectsText',
		description: 'Text for the filter option using aql search',
		defaultMessage: 'Filter',
	},
	tablePreviewText: {
		id: 'linkDataSource.assets.configmodal.tablePreviewText',
		description: 'Heading above the table preview in the Assets configuration modal',
		defaultMessage: 'Table preview',
	},
});
