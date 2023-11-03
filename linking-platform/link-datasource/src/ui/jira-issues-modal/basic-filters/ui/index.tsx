import React, { useEffect, useState } from 'react';

import { Flex } from '@atlaskit/primitives';

import type { BasicFilterFieldType, SelectOption } from '../types';
import { isValidJql } from '../utils';

import AsyncPopupSelect from './async-popup-select';

const availableBasicFilterTypes: BasicFilterFieldType[] = [
  'project',
  'issuetype',
  'status',
  'assignee',
];

interface BasicFilterContainerProps {
  jql: string;
}

const BasicFilterContainer = ({ jql }: BasicFilterContainerProps) => {
  const [selection] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (isValidJql(jql)) {
      // hydrate hook call goes in here
    }
  }, [jql]);

  const handleSelectionChange = () => {};

  return (
    <Flex gap="space.100" testId="jlol-basic-filter-container">
      {availableBasicFilterTypes.map(filter => (
        <AsyncPopupSelect
          filterType={filter}
          key={filter}
          selection={selection}
          onSelectionChange={handleSelectionChange}
        />
      ))}
    </Flex>
  );
};

export default BasicFilterContainer;
