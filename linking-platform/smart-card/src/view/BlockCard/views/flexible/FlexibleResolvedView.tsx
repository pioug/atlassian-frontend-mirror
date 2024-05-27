import React, { useEffect, useMemo, useState } from 'react';
import FlexibleCard from '../../../FlexibleCard';
import {
  FooterBlock,
  MetadataBlock,
  PreviewBlock,
  SnippetBlock,
  TitleBlock,
} from '../../../FlexibleCard/components/blocks';
import { metadataBlockCss } from './styled';
import {
  ActionName,
  ElementName,
  SmartLinkPosition,
} from '../../../../constants';
import { type FlexibleBlockCardProps } from './types';
import {
  getSimulatedBetterMetadata,
  titleBlockOptions,
  PreviewBlockOptions,
  FlexibleCardUiOptions,
  FooterBlockOptions,
} from './utils';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';
import type { ActionItem } from '../../../FlexibleCard/components/blocks/types';

/**
 * This view represents a Block card that has an 'Resolved' status.
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const FlexibleResolvedView = ({
  cardState,
  onClick,
  onError,
  onResolve,
  actionOptions,
  testId = 'smart-block-resolved-view',
  url,
  analytics,
}: FlexibleBlockCardProps) => {
  const [isPreviewBlockErrored, setIsPreviewBlockErrored] =
    useState<boolean>(false);

  useEffect(() => {
    setIsPreviewBlockErrored(false);
  }, [url, cardState]);

  const { titleMetadata, topMetadata, bottomMetadata } =
    getSimulatedBetterMetadata(cardState.details);

  const footerActions: ActionItem[] = useMemo(
    () => [
      { name: ActionName.FollowAction, hideIcon: true },
      { name: ActionName.PreviewAction, hideIcon: true },
      { name: ActionName.DownloadAction, hideIcon: true },
    ],
    [],
  );

  return (
    <FlexibleCard
      analytics={analytics}
      appearance="block"
      cardState={cardState}
      onClick={onClick}
      onError={onError}
      onResolve={onResolve}
      actionOptions={actionOptions}
      testId={testId}
      ui={FlexibleCardUiOptions}
      url={url}
    >
      <TitleBlock
        {...titleBlockOptions}
        metadata={titleMetadata}
        subtitle={[{ name: ElementName.Location }]}
        metadataPosition={SmartLinkPosition.Top}
      />
      <MetadataBlock
        primary={topMetadata}
        maxLines={1}
        overrideCss={metadataBlockCss}
      />
      <SnippetBlock />
      <MetadataBlock
        primary={bottomMetadata}
        maxLines={1}
        overrideCss={metadataBlockCss}
      />
      {!isPreviewBlockErrored ? (
        <PreviewBlock
          {...PreviewBlockOptions}
          onError={() => {
            setIsPreviewBlockErrored(true);
          }}
        />
      ) : null}
      <FooterBlock {...FooterBlockOptions} actions={footerActions} />
    </FlexibleCard>
  );
};

export default withFlexibleUIBlockCardStyle(FlexibleResolvedView);
