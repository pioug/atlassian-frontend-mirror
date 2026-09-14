import React from 'react';

import { IntlProvider } from 'react-intl';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '../../src/ui/jira-issues-modal';
import { JiraIssuesConfigModal } from '../../src/ui/jira-issues-modal/modal';

mockDatasourceFetchRequests({ delayedResponse: false });

export const JiraIssuesConfigModalNoJiraInstancesState = (): React.JSX.Element => (
	<IntlProvider locale="en">
		<SmartCardProvider client={new SmartLinkClient()}>
			<JiraIssuesConfigModal
				datasourceId={JIRA_LIST_OF_LINKS_DATASOURCE_ID}
				onCancel={() => {}}
				onInsert={() => {}}
				disableDisplayDropdown
			/>
		</SmartCardProvider>
	</IntlProvider>
);

export default JiraIssuesConfigModalNoJiraInstancesState;
