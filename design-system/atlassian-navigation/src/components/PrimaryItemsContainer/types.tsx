import { ComponentType, ReactNode, ReactNodeArray } from 'react';

export type PrimaryItemsContainerProps = {
  moreLabel: ReactNode;
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  items: ReactNodeArray;
  create?: ComponentType<{}>;
  testId?: string;
};

export type PrimaryItemsContainerSkeletonProps = {
  count: number;
};
