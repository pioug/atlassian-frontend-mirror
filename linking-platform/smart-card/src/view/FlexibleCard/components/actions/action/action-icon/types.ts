import { ReactChild } from 'react';
import { SmartLinkSize } from '../../../../../../constants';

export type ActionIconProps = {
  size?: SmartLinkSize;
  icon?: ReactChild;
  testId?: string;
  isDisabled?: boolean;
};
