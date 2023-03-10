import React, { useCallback } from 'react';

import { DropdownItem } from '@atlaskit/dropdown-menu';
import Lozenge from '@atlaskit/lozenge';

import type { FC } from 'react';
import type { LozengeActionItemProps } from './types';

const LozengeActionItem: FC<LozengeActionItemProps> = ({
  appearance,
  testId,
  text,
}) => {
  const onMouseEnter = useCallback((e) => {
    e.currentTarget?.firstElementChild?.focus();
  }, []);

  return (
    <span onMouseEnter={onMouseEnter}>
      <DropdownItem testId={testId}>
        <Lozenge appearance={appearance}>{text}</Lozenge>
      </DropdownItem>
    </span>
  );
};

export default LozengeActionItem;
