import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';

import { JiraSiteSelector } from '../../src/ui/jira-issues-modal/site-selector';

export default () => (
  <IntlProvider locale="en">
    <JiraSiteSelector
      testId={`jira-jql-datasource-modal--site-selector`}
      availableSites={mockSiteData}
      onSiteSelection={() => {}}
      selectedJiraSite={mockSiteData[0]}
    />
  </IntlProvider>
);
