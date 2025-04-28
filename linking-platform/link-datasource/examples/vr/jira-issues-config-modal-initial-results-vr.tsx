import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import {
	defaultInitialVisibleJiraColumnKeys,
	mockBasicFilterAGGFetchRequests,
	mockDatasourceFetchRequests,
} from '@atlaskit/link-test-helpers/datasource';

import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '../../src';
import { JiraIssuesConfigModal } from '../../src/ui/jira-issues-modal/modal';

mockDatasourceFetchRequests({ delayedResponse: false });
mockBasicFilterAGGFetchRequests();

export default () => (
	<IntlProvider locale="en">
		<SmartCardProvider client={new SmartLinkClient()}>
			<JiraIssuesConfigModal
				datasourceId={JIRA_LIST_OF_LINKS_DATASOURCE_ID}
				visibleColumnKeys={defaultInitialVisibleJiraColumnKeys}
				parameters={{
					cloudId: '67899',
					jql: 'project in ("My IT TEST", Test) and type in ("[System] Change", "[System] Incident") and status in (Authorize, "Awaiting approval") and assignee in (empty, "membersOf(administrators)") ORDER BY created DESC',
				}}
				onCancel={() => {}}
				onInsert={() => {}}
				disableDisplayDropdown
			/>
		</SmartCardProvider>
	</IntlProvider>
);
