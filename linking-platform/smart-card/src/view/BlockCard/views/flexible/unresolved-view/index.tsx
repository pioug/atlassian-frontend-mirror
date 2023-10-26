import {
  CustomBlock,
  PreviewBlock,
  TitleBlock,
} from '../../../../FlexibleCard/components/blocks';
import React, { type FC } from 'react';
import FlexibleCard from '../../../../FlexibleCard';
import { InternalFooterBlock } from '../../../../FlexibleCard/components/blocks';
import {
  FlexibleCardUiOptions,
  getFooterBlockOptions,
  PreviewBlockOptions,
  getTitleBlockOptions,
} from '../utils';
import { UnresolvedViewProps } from './types';

const UnresolvedView: FC<UnresolvedViewProps> = ({
  actions,
  cardState,
  children,
  onAuthorize,
  onClick,
  onError,
  showPreview = false,
  testId,
  title,
  url,
}) => (
  <FlexibleCard
    appearance="block"
    cardState={cardState}
    onAuthorize={onAuthorize}
    onClick={onClick}
    onError={onError}
    testId={testId}
    ui={FlexibleCardUiOptions}
    url={url}
  >
    <TitleBlock {...getTitleBlockOptions()} text={title} />
    <CustomBlock>{children}</CustomBlock>
    {showPreview && <PreviewBlock {...PreviewBlockOptions} />}
    <InternalFooterBlock
      {...getFooterBlockOptions()}
      actions={actions}
      testId="smart-block-card-footer"
    />
  </FlexibleCard>
);

export default UnresolvedView;
