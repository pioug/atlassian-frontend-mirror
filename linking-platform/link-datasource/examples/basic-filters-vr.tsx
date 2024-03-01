import React, { useCallback, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import {
  mockBasicFilterAGGFetchRequests,
  mockSite,
} from '@atlaskit/link-test-helpers/datasource';
import { Flex, xcss } from '@atlaskit/primitives';

import {
  BasicFilterFieldType,
  SelectedOptionsMap,
  SelectOption,
} from '../src/ui/jira-issues-modal/basic-filters/types';
import AsyncPopupSelect from '../src/ui/jira-issues-modal/basic-filters/ui/async-popup-select';

const flexContainerStyles = xcss({
  margin: 'space.400',
});

mockBasicFilterAGGFetchRequests();

export default () => {
  const filters: BasicFilterFieldType[] = [
    'project',
    'type',
    'status',
    'assignee',
  ];

  const [selection, setSelection] = useState<SelectedOptionsMap>({
    project: [],
    type: [],
    status: [],
    assignee: [],
  });

  const handleSelectionChange = useCallback(
    (filter: BasicFilterFieldType, options: SelectOption[]) => {
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
              site={mockSite}
              key={filter}
              selection={selection[filter] || []}
              onSelectionChange={handleSelectionChange}
              isJQLHydrating={false}
            />
          ))}
        </Flex>
      </SmartCardProvider>
    </IntlProvider>
  );
};
