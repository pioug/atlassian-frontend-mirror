/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import { Tab, TabList } from '@atlaskit/tabs';

export const messages = {
	detailsTab: {
		id: 'organization.audit.log.side-panel.tabs.details.tab',
		defaultMessage: 'Details',
		description: 'Title of the audit log side panel tab details',
	},
	jsonTab: {
		id: 'organization.audit.log.side-panel.tabs.json.tab',
		defaultMessage: 'JSON',
		description: 'Title of the audit log side panel tab json',
	},
};

export const TabListHeaders = () => {
	return (
		<TabList>
			<Tab>
				<FormattedMessage {...messages.detailsTab} />
			</Tab>
			<Tab>
				<FormattedMessage {...messages.jsonTab} />
			</Tab>
		</TabList>
	);
};
