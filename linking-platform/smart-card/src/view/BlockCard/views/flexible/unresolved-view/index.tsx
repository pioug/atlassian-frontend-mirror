import {
  CustomBlock,
  PreviewBlock,
  TitleBlock,
} from '../../../../FlexibleCard/components/blocks';
import React from 'react';
import FlexibleCard from '../../../../FlexibleCard';
import { InternalFooterBlock } from '../../../../FlexibleCard/components/blocks';
import {
  FlexibleCardUiOptions,
  PreviewBlockOptions,
  titleBlockOptions,
  FooterBlockOptions,
} from '../utils';
import { UnresolvedViewProps } from './types';

const UnresolvedView = ({
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
}: UnresolvedViewProps) => (
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
    <TitleBlock {...titleBlockOptions} hideIcon={!!title} text={title} />
    <CustomBlock>{children}</CustomBlock>
    {showPreview && <PreviewBlock {...PreviewBlockOptions} />}
    <InternalFooterBlock
      {...FooterBlockOptions}
      actions={actions}
      testId="smart-block-card-footer"
    />
  </FlexibleCard>
);

export default UnresolvedView;
