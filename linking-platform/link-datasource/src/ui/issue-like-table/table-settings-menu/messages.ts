import { defineMessages } from 'react-intl';

export const tableSettingsMenuMessages: {
	moreActions: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	tableSettings: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	wrapTextOnAllColumns: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	moreActions: {
		id: 'link-datasource.issue-like-table.table-settings-menu.moreActions',
		description: 'Tooltip and accessibility label for the table settings meatball menu button',
		defaultMessage: 'More actions',
	},
	tableSettings: {
		id: 'link-datasource.issue-like-table.table-settings-menu.tableSettings',
		description: 'Accessibility label for the table settings popup',
		defaultMessage: 'Table settings',
	},
	wrapTextOnAllColumns: {
		id: 'link-datasource.issue-like-table.table-settings-menu.wrapTextOnAllColumns',
		description: 'Label for the toggle that wraps text in every table column',
		defaultMessage: 'Wrap text in all columns',
	},
});
