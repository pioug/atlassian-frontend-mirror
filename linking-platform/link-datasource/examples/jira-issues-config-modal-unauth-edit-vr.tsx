import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import {
  defaultInitialVisibleColumnKeys,
  mockDatasourceFetchRequests,
  mockSiteData,
} from '@atlaskit/link-test-helpers/datasource';

import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '../src';
import { PlainJiraIssuesConfigModal } from '../src/ui/jira-issues-modal/modal';

mockDatasourceFetchRequests({
  delayedResponse: false,
  availableSitesOverride: mockSiteData.slice(0, 3),
});

const parameters = {
  cloudId: '44444',
  jql: 'order by created DESC',
};

export const JiraIssuesConfigModalUnauthorizedEditState = () => (
  <IntlProvider locale="en">
    <SmartCardProvider client={new SmartLinkClient()}>
      <PlainJiraIssuesConfigModal
        datasourceId={JIRA_LIST_OF_LINKS_DATASOURCE_ID}
        url="https://test7.atlassian.net"
        onCancel={() => {}}
        onInsert={() => {}}
        parameters={parameters}
        visibleColumnKeys={defaultInitialVisibleColumnKeys}
      />
    </SmartCardProvider>
  </IntlProvider>
);

export default JiraIssuesConfigModalUnauthorizedEditState;
