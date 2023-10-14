import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import {
  defaultInitialVisibleColumnKeys,
  mockDatasourceFetchRequests,
} from '@atlaskit/link-test-helpers/datasource';

import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '../src';
import { PlainJiraIssuesConfigModal } from '../src/ui/jira-issues-modal/modal';

mockDatasourceFetchRequests({ delayedResponse: false });

export const JiraIssuesConfigModalNoInitialJQL = () => (
  <IntlProvider locale="en">
    <SmartCardProvider client={new SmartLinkClient()}>
      <PlainJiraIssuesConfigModal
        datasourceId={JIRA_LIST_OF_LINKS_DATASOURCE_ID}
        visibleColumnKeys={defaultInitialVisibleColumnKeys}
        parameters={undefined}
        onCancel={() => {}}
        onInsert={() => {}}
      />
    </SmartCardProvider>
  </IntlProvider>
);

export default JiraIssuesConfigModalNoInitialJQL;
