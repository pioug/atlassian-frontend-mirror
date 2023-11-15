import React, { useCallback, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { mockBasicFilterAGGFetchRequests } from '@atlaskit/link-test-helpers/datasource';
import { Flex, xcss } from '@atlaskit/primitives';

import { BasicFilterFieldType } from '../src/ui/jira-issues-modal/basic-filters/types';
import AsyncPopupSelect from '../src/ui/jira-issues-modal/basic-filters/ui/async-popup-select';

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
  const [selection, setSelection] = useState({
    project: [],
    issuetype: [],
    status: [],
    assignee: [],
  });

  const handleSelectionChange = useCallback(
    (options, filter) => {
      const updatedSelection = {
        ...selection,
        [filter]: options,
      };
      setSelection(updatedSelection);
    },
    [selection],
  );

  return (
    <IntlProvider locale="en">
      <SmartCardProvider client={new CardClient()}>
        <Flex gap="space.400" xcss={flexContainerStyles}>
          {filters.map(filter => (
            <AsyncPopupSelect
              filterType={filter}
              cloudId="my-cloud-id"
              key={filter}
              selection={selection[filter]}
              onSelectionChange={options =>
                handleSelectionChange(options, filter)
              }
            />
          ))}
        </Flex>
      </SmartCardProvider>
    </IntlProvider>
  );
};
