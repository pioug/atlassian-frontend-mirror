/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/core';

import { PrimaryButtonSkeleton } from '../PrimaryButton/skeleton';

import { primaryButtonSkeletonCSS } from './styles';
import { PrimaryItemsContainerSkeletonProps } from './types';

export const PrimaryItemsContainerSkeleton = ({
  count,
}: PrimaryItemsContainerSkeletonProps) => (
  <Fragment>
    {Array.from({ length: count }, (_, index) => (
      <PrimaryButtonSkeleton key={index} css={primaryButtonSkeletonCSS} />
    ))}
  </Fragment>
);
