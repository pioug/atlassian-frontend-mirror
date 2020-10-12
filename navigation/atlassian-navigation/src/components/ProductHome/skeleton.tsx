/** @jsx jsx */

import { Fragment } from 'react';

import { jsx } from '@emotion/core';

import { useTheme } from '../../theme';

import {
  productHomeButtonSkeletonCSS,
  productIconSkeletonCSS,
  productLogoSkeletonCSS,
  siteTitleSkeletonCSS,
} from './styles';

export const ProductHomeSkeleton = ({
  showSiteName,
}: {
  showSiteName: boolean;
}) => {
  const theme = useTheme();

  return (
    <Fragment>
      <div css={productHomeButtonSkeletonCSS(theme)}>
        <div css={productLogoSkeletonCSS(theme)} />
        <div css={productIconSkeletonCSS(theme)} />
      </div>
      {showSiteName && <div css={siteTitleSkeletonCSS(theme)} />}
    </Fragment>
  );
};
