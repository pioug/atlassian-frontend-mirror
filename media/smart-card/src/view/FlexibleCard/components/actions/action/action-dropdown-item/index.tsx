import React from 'react';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import { handleOnClick } from '../../../../../../utils';
import { ActionDropdownItemProps } from './types';

const ActionDropdownItem: React.FC<ActionDropdownItemProps> = ({
  content,
  iconAfter,
  iconBefore,
  onClick,
  testId,
}) => (
  <DropdownItem
    elemAfter={iconAfter}
    elemBefore={iconBefore}
    onClick={handleOnClick(onClick)}
    testId={testId}
  >
    {content}
  </DropdownItem>
);

export default ActionDropdownItem;
