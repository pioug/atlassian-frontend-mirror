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
  cloudId: string;
}

const BasicFilterContainer = ({ jql, cloudId }: BasicFilterContainerProps) => {
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
          cloudId={cloudId}
          filterType={filter}
          key={filter}
          selection={selection}
          isDisabled={!cloudId}
          onSelectionChange={handleSelectionChange}
        />
      ))}
    </Flex>
  );
};

export default BasicFilterContainer;
