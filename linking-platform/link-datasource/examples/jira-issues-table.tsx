import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { ExampleJiraIssuesTableView } from '../examples-helpers/buildJiraIssuesTable';
import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';

export default () => (
  <IntlProvider locale="en">
    <SmartCardProvider client={new SmartLinkClient()}>
      <ExampleJiraIssuesTableView />
    </SmartCardProvider>
  </IntlProvider>
);
