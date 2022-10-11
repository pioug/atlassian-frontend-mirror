/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import LoadingSkeleton from '../../FlexibleCard/components/common/loading-skeleton';
import FlexibleCard from '../../FlexibleCard';
import { TitleBlock } from '../../FlexibleCard/components/blocks';
import { HoverCardLoadingViewProps } from '../types';
import {
  CARD_WIDTH_REM,
  loadingViewContainer,
  skeletonContainer,
} from '../styled';

const HoverCardLoadingView: React.FC<HoverCardLoadingViewProps> = ({
  flexibleCardProps,
  titleBlockProps,
}) => {
  const lineHeightRem = 1.25;
  const skeletonWidth = CARD_WIDTH_REM - 2;

  return (
    <div css={loadingViewContainer} data-testid="hover-card-loading-view">
      <FlexibleCard {...flexibleCardProps}>
        <TitleBlock {...titleBlockProps} />
      </FlexibleCard>
      <div css={skeletonContainer}>
        <span />
        <LoadingSkeleton width={skeletonWidth} height={lineHeightRem} />
        <LoadingSkeleton width={skeletonWidth} height={lineHeightRem * 3} />
        <LoadingSkeleton width={skeletonWidth} height={lineHeightRem} />
      </div>
    </div>
  );
};

export default HoverCardLoadingView;
