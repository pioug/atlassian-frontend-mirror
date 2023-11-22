import React from 'react';

import { Flex, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import type {
  BasicFilterFieldType,
  SelectedOptionsMap,
  SelectOption,
} from '../types';

import AsyncPopupSelect from './async-popup-select';

export const availableBasicFilterTypes: BasicFilterFieldType[] = [
  'project',
  'issuetype',
  'status',
  'assignee',
];

export interface BasicFilterContainerProps {
  cloudId: string;
  selections: SelectedOptionsMap;
  onChange: (filterType: BasicFilterFieldType, options: SelectOption[]) => void;
  onReset: () => void;
  isJQLHydrating: boolean;
}

const basicFilterContainerStyles = xcss({
  paddingLeft: token('space.100', '8px'),
});

const BasicFilterContainer = ({
  cloudId,
  onChange,
  selections,
  onReset,
  isJQLHydrating,
}: BasicFilterContainerProps) => {
  return (
    <Flex
      xcss={basicFilterContainerStyles}
      gap="space.100"
      testId="jlol-basic-filter-container"
    >
      {availableBasicFilterTypes.map((filter: BasicFilterFieldType) => {
        return (
          <AsyncPopupSelect
            cloudId={cloudId}
            filterType={filter}
            key={filter}
            selection={selections[filter] || []}
            isJQLHydrating={isJQLHydrating}
            isDisabled={!cloudId}
            onSelectionChange={onChange}
            onReset={onReset}
          />
        );
      })}
    </Flex>
  );
};

export default BasicFilterContainer;
