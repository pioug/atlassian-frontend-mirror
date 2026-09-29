import React from 'react';

import { IntlProvider } from 'react-intl';

import { mockBasicFilterAGGFetchRequests, mockSite } from '@atlaskit/link-test-helpers/datasource';

import { JiraSearchContainer } from '../../src/ui/jira-issues-modal/jira-search-container';

const parameters = {
	cloudId: '67899',
	jql: 'ORDER BY created DESC',
};

const noop = () => {};
mockBasicFilterAGGFetchRequests();

export const JiraSearchContainerVR = (): React.JSX.Element => (
	<IntlProvider locale="en">
		<JiraSearchContainer
			initialSearchMethod="basic"
			onSearch={noop}
			onSearchMethodChange={noop}
			parameters={parameters}
			searchBarJql={parameters.jql}
			setSearchBarJql={noop}
			site={mockSite}
		/>
	</IntlProvider>
);

export default JiraSearchContainerVR;
