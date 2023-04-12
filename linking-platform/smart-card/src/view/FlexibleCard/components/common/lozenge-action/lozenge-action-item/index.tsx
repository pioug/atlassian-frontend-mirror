import React, { useCallback } from 'react';

import { DropdownItem } from '@atlaskit/dropdown-menu';
import Lozenge from '@atlaskit/lozenge';

import type { FC } from 'react';
import type { LozengeActionItemProps } from './types';

const LozengeActionItem: FC<LozengeActionItemProps> = ({
  appearance,
  id,
  onClick,
  testId,
  text,
}) => {
  const handleClick = useCallback(
    (e) => {
      // Prevent dropdown to close on select item.
      // We want to show loading screen.
      e.stopPropagation();

      if (onClick) {
        onClick(id);
      }
    },
    [id, onClick],
  );

  const handleMouseEnter = useCallback((e) => {
    e.currentTarget?.firstElementChild?.focus();
  }, []);

  return (
    <span onMouseEnter={handleMouseEnter}>
      <DropdownItem onClick={handleClick} testId={testId}>
        <Lozenge appearance={appearance}>{text}</Lozenge>
      </DropdownItem>
    </span>
  );
};

export default LozengeActionItem;
