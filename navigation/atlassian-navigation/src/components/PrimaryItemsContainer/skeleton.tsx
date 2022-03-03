/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize } from '../../common/constants';
import { PrimaryButtonSkeleton } from '../PrimaryButton/skeleton';

import { PrimaryItemsContainerSkeletonProps } from './types';

const primaryButtonSkeletonStyles = css({
  marginRight: gridSize * 1.5,
  marginLeft: gridSize * 1.5,
});

export const PrimaryItemsContainerSkeleton = ({
  count,
}: PrimaryItemsContainerSkeletonProps) => (
  <Fragment>
    {Array.from({ length: count }, (_, index) => (
      <PrimaryButtonSkeleton key={index} css={primaryButtonSkeletonStyles} />
    ))}
  </Fragment>
);
