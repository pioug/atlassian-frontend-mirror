import React, { useState } from 'react';

import { IntlProvider } from 'react-intl';

import { mockBasicFilterAGGFetchRequests, mockSite } from '@atlaskit/link-test-helpers/datasource';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import { JiraSearchContainer } from '../src/ui/jira-issues-modal/jira-search-container/JiraSearchContainerWithWrappers';

mockBasicFilterAGGFetchRequests();

const SearchExample = ({ isKeyword }: { isKeyword: boolean }): React.JSX.Element => {
	const initialJql = isKeyword ? 'textfields ~ "login issues*"' : 'assignee = currentUser()';
	const [jql, setJql] = useState(initialJql);
	const [submitted, setSubmitted] = useState('');
	return (
		<Stack space="space.100">
			<Text weight="bold">
				{isKeyword ? 'Keyword intent — Basic' : 'Natural-language intent — JQL'}
			</Text>
			<JiraSearchContainer
				layout="inline"
				showBasicSearchButton={false}
				allowBasicModeReset
				initialBasicSearchTerm={isKeyword ? 'login issues' : ''}
				initialSearchMethod={isKeyword ? 'basic' : 'jql'}
				textSearchField="textfields"
				parameters={{ cloudId: mockSite.cloudId, jql: initialJql }}
				site={mockSite}
				searchBarJql={jql}
				setSearchBarJql={setJql}
				onSearch={(parameters) => setSubmitted(parameters.jql ?? '')}
				onSearchMethodChange={() => {}}
			/>
			{submitted && <Text>Submitted: {submitted}</Text>}
		</Stack>
	);
};

export default function InlineJiraSearchRecovery(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Stack space="space.400">
				<SearchExample isKeyword />
				<SearchExample isKeyword={false} />
			</Stack>
		</IntlProvider>
	);
}
