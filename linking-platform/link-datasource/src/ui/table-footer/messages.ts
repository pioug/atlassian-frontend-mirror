import { defineMessages } from 'react-intl-next';

export const footerMessages = defineMessages({
	itemText: {
		id: 'linkDataSource.table-footer.item',
		description: 'Text that appears after item count number.',
		defaultMessage: '{itemCount, plural, one {item} other {items}}',
	},
	loadingText: {
		id: 'linkDataSource.table-footer.loading',
		description: 'Text that appears when table is loading.',
		defaultMessage: 'Loading...',
	},
	refreshLabel: {
		id: 'linkDataSource.table-footer.refresh',
		description: 'Label for refresh icon',
		defaultMessage: 'Refresh',
	},
	powerByJSM: {
		id: 'linkDataSource.table-footer.power-by-jsm',
		description: 'Displayed on the issue like table footer to increase JSM Assets visibility',
		defaultMessage: 'Powered by Assets in Jira Service Management',
	},
});
