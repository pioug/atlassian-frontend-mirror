import React, { useCallback, useEffect, useState } from 'react';

import { Flex, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import type {
  BasicFilterFieldType,
  SelectedOptionsMap,
  SelectOption,
} from '../types';
import { isValidJql } from '../utils';

import AsyncPopupSelect from './async-popup-select';

const availableBasicFilterTypes: BasicFilterFieldType[] = [
  'project',
  'issuetype',
  'status',
  'assignee',
];

export interface BasicFilterContainerProps {
  jql: string;
  cloudId: string;
  onChange: (selection: SelectedOptionsMap) => void;
}

const basicFilterContainerStyles = xcss({
  paddingLeft: token('space.100', '8px'),
});

const BasicFilterContainer = ({
  jql,
  cloudId,
  onChange,
}: BasicFilterContainerProps) => {
  const [selection, setSelection] = useState<SelectedOptionsMap>({});

  useEffect(() => {
    if (isValidJql(jql)) {
      // hydrate hook call goes in here
    }
  }, [jql]);

  const handleSelectionChange = useCallback(
    (filterType: BasicFilterFieldType, options: SelectOption[]) => {
      const updatedSelection: SelectedOptionsMap = {
        ...selection,
        [filterType]: options,
      };
      setSelection(updatedSelection);
      onChange(updatedSelection);
    },
    [onChange, selection],
  );

  const handleReset = useCallback(() => {
    if (Object.keys(selection).length > 0) {
      setSelection({});
    }
  }, [selection]);

  return (
    <Flex
      xcss={basicFilterContainerStyles}
      gap="space.100"
      testId="jlol-basic-filter-container"
    >
      {availableBasicFilterTypes.map((filter: BasicFilterFieldType) => (
        <AsyncPopupSelect
          cloudId={cloudId}
          filterType={filter}
          key={filter}
          selection={selection[filter] || []}
          isDisabled={!cloudId}
          onSelectionChange={handleSelectionChange}
          onReset={handleReset}
        />
      ))}
    </Flex>
  );
};

export default BasicFilterContainer;
