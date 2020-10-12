/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

import { useTheme } from '../../theme';
import { IconButtonSkeleton } from '../IconButton/skeleton';

import { createButtonSkeletonCSS, createIconSkeletonCSS } from './styles';

export const CreateSkeleton = () => {
  const theme = useTheme();
  return (
    <Fragment>
      <div css={createButtonSkeletonCSS(theme)} />
      <IconButtonSkeleton
        css={createIconSkeletonCSS}
        size={gridSize() * 3.25}
      />
    </Fragment>
  );
};
