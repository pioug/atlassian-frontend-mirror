import React from 'react';

import { IntlProvider } from 'react-intl';

import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource/jira-issues-modal';
import DatasourceTableView from '@atlaskit/link-datasource/datasource-table-view';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';

export default function JiraIssuesTableExample(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<SmartCardProvider>
				<section aria-labelledby="open-issues-heading">
					<h2 id="open-issues-heading">Open demo project issues</h2>
					{/* Host integration snippet: use a cloud ID and JQL available to this user. */}
					<DatasourceTableView
						datasourceId={JIRA_LIST_OF_LINKS_DATASOURCE_ID}
						parameters={{
							cloudId: 'replace-with-an-accessible-cloud-id',
							jql: 'project = DEMO AND resolution is EMPTY ORDER BY created DESC',
						}}
					/>
				</section>
			</SmartCardProvider>
		</IntlProvider>
	);
}
