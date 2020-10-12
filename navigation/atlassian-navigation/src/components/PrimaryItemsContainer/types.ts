import { ComponentType, ReactNode, ReactNodeArray } from 'react';

export type PrimaryItemsContainerProps = {
  moreLabel: ReactNode;
  items: ReactNodeArray;
  create?: ComponentType<{}>;
  testId?: string;
};

export type PrimaryItemsContainerSkeletonProps = {
  count: number;
};
