import type { ReactChild } from 'react';
import type { SmartLinkSize } from '../../../../../../constants';

export type ActionIconProps = {
  size?: SmartLinkSize;
  icon?: ReactChild;
  isDisabled?: boolean;
  showBackground?: boolean;
  testId?: string;
};
