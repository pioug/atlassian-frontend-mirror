import React, { useMemo } from 'react';

import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

import type { FC } from 'react';
import type { LozengeActionErrorProps } from './types';

const LozengeActionError: FC<LozengeActionErrorProps> = ({
  errorCode,
  testId,
}) => {
  // TODO: EDM-5746 and EDM-5782
  const content = useMemo(() => errorCode, [errorCode]);

  return (
    <DropdownItemGroup>
      <DropdownItem testId={`${testId}-error`}>{content}</DropdownItem>
    </DropdownItemGroup>
  );
};

export default LozengeActionError;
