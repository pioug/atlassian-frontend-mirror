import React from 'react';

import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';

import { JiraSiteSelector } from '../src/ui/jira-issues-modal/site-selector';

export default () => (
  <JiraSiteSelector
    testId={`jira-jql-datasource-modal--site-selector`}
    availableSites={mockSiteData}
    onSiteSelection={() => {}}
    selectedJiraSite={mockSiteData[0]}
  />
);
