import { SmartLinkSize } from '../../../../../constants';
import { Appearance } from '@atlaskit/button/types';
import { ReactChild } from 'react';

export type ActionProps = {
  size?: SmartLinkSize;
  testId?: string;
  content?: React.ReactNode;
  appearance?: Appearance;
  onClick: () => any;
  icon?: ReactChild;
  iconPosition?: 'before' | 'after';
  tooltipMessage?: React.ReactNode;
};

export type ActionIconProps = {
  size?: SmartLinkSize;
  testId?: string;
  icon?: ReactChild;
};
