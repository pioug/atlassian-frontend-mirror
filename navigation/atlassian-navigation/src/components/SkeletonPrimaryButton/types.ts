import { ReactNode } from 'react';

export type SkeletonPrimaryButtonProps = {
  text?: ReactNode;
  children?: ReactNode;
  isDropdownButton?: boolean;
  isHighlighted?: boolean;
  testId?: string;
};
