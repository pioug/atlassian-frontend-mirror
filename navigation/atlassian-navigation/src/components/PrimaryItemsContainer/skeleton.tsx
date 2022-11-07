/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import { gridSize } from '../../common/constants';
import { PrimaryButtonSkeleton } from '../PrimaryButton/skeleton';

import { PrimaryItemsContainerSkeletonProps } from './types';

const primaryButtonSkeletonStyles = css({
  marginRight: gridSize * 1.5,
  marginLeft: gridSize * 1.5,
});

// Internal only
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const PrimaryItemsContainerSkeleton = ({
  count,
}: PrimaryItemsContainerSkeletonProps) => (
  <Fragment>
    {Array.from({ length: count }, (_, index) => (
      <PrimaryButtonSkeleton key={index} css={primaryButtonSkeletonStyles} />
    ))}
  </Fragment>
);
