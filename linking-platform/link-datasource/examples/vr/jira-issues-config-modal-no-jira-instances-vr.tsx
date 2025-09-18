import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '../../src';
import { JiraIssuesConfigModal } from '../../src/ui/jira-issues-modal/modal';

mockDatasourceFetchRequests({
	delayedResponse: false,
	availableSitesOverride: [],
	accessibleProductsOverride: [],
});

export const JiraIssuesConfigModalNoJiraInstancesState = () => (
	<IntlProvider locale="en">
		<SmartCardProvider client={new SmartLinkClient()}>
			<JiraIssuesConfigModal
				datasourceId={JIRA_LIST_OF_LINKS_DATASOURCE_ID}
				onCancel={() => {}}
				onInsert={() => {}}
			/>
		</SmartCardProvider>
	</IntlProvider>
);

export default JiraIssuesConfigModalNoJiraInstancesState;
