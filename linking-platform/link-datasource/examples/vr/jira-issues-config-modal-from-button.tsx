import React, { useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { SmartCardProvider } from '@atlaskit/link-provider';
import {
	defaultInitialVisibleJiraColumnKeys,
	mockDatasourceFetchRequests,
} from '@atlaskit/link-test-helpers/datasource';

import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '../../src';
import { JiraIssuesConfigModal } from '../../src/ui/jira-issues-modal/modal';

mockDatasourceFetchRequests({ delayedResponse: false });

const parameters = {
	cloudId: '67899',
	filter: '',
};

export const JiraIssuesConfigModalFromButton = () => {
	const [showModal, setShowModal] = useState(false);
	const toggleIsOpen = () => setShowModal((prevOpenState) => !prevOpenState);

	return (
		<IntlProvider locale="en">
			<SmartCardProvider client={new SmartLinkClient()}>
				<Button testId="toggle-modal" onClick={toggleIsOpen}>
					Toggle Modal
				</Button>
				{showModal && (
					<JiraIssuesConfigModal
						datasourceId={JIRA_LIST_OF_LINKS_DATASOURCE_ID}
						visibleColumnKeys={defaultInitialVisibleJiraColumnKeys}
						parameters={parameters}
						onCancel={() => setShowModal(false)}
						onInsert={() => {}}
					/>
				)}
			</SmartCardProvider>
		</IntlProvider>
	);
};

export default JiraIssuesConfigModalFromButton;
