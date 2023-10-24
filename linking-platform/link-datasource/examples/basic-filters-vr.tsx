import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { mockBasicFilterAGGFetchRequests } from '@atlaskit/link-test-helpers/datasource';
import { Flex, xcss } from '@atlaskit/primitives';

import AsyncPopupSelect from '../src/ui/jira-issues-modal/basic-filters/ui/async-popup-select';
import { BasicFilterFieldType } from '../src/ui/jira-issues-modal/basic-filters/ui/async-popup-select/types';

const flexContainerStyles = xcss({
  margin: 'space.400',
});

mockBasicFilterAGGFetchRequests();

export default () => {
  const filters: BasicFilterFieldType[] = [
    'project',
    'issuetype',
    'status',
    'assignee',
  ];

  return (
    <IntlProvider locale="en">
      <Flex gap="space.400" xcss={flexContainerStyles}>
        {filters.map(filter => (
          <AsyncPopupSelect filterType={filter} key={filter} selection={[]} />
        ))}
      </Flex>
    </IntlProvider>
  );
};
