import React, { useEffect, useMemo, useState } from 'react';
import FlexibleCard from '../../../FlexibleCard';
import {
  FooterBlock,
  MetadataBlock,
  PreviewBlock,
  SnippetBlock,
  TitleBlock,
} from '../../../FlexibleCard/components/blocks';
import { metadataBlockCss, footerBlockCss } from './styled';
import {
  ActionName,
  ElementName,
  MediaPlacement,
  SmartLinkPosition,
} from '../../../../constants';
import { FlexibleBlockCardProps } from './types';
import { getSimulatedMetadata, getSimulatedBetterMetadata } from './utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';
import type { ActionItem } from '../../../FlexibleCard/components/blocks/types';

/**
 * This view represents a Block card that has an 'Resolved' status.
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const FlexibleResolvedView = ({
  id,
  cardState,
  onClick,
  onError,
  onResolve,
  showServerActions,
  anchorTarget,
  testId = 'smart-block-resolved-view',
  url,
  analytics,
  titleBlockProps,
}: FlexibleBlockCardProps) => {
  const [isPreviewBlockErrored, setIsPreviewBlockErrored] =
    useState<boolean>(false);

  useEffect(() => {
    setIsPreviewBlockErrored(false);
  }, [url, cardState]);

  const { titleMetadata, topMetadata, bottomMetadata } = getBooleanFF(
    'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
  )
    ? getSimulatedBetterMetadata(cardState.details)
    : getSimulatedMetadata(cardState.details);

  const footerActions: ActionItem[] = useMemo(
    () => [
      { name: ActionName.FollowAction, hideIcon: true },
      { name: ActionName.PreviewAction, hideIcon: true },
      { name: ActionName.ViewAction, hideIcon: true },
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
      showServerActions={showServerActions}
      testId={testId}
      ui={{ hideElevation: true }}
      url={url}
    >
      <TitleBlock
        position={SmartLinkPosition.Center}
        metadata={titleMetadata}
        hideRetry={true}
        subtitle={[{ name: ElementName.Location }]}
        metadataPosition={SmartLinkPosition.Top}
        anchorTarget={anchorTarget}
        {...titleBlockProps}
      />
      <MetadataBlock
        primary={topMetadata}
        maxLines={1}
        {...(getBooleanFF(
          'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
        ) && { overrideCss: metadataBlockCss })}
      />
      <SnippetBlock />

      {getBooleanFF(
        'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
      ) && (
        <MetadataBlock
          primary={bottomMetadata}
          maxLines={1}
          overrideCss={metadataBlockCss}
        />
      )}

      {!isPreviewBlockErrored ? (
        <PreviewBlock
          placement={MediaPlacement.Right}
          ignoreContainerPadding={true}
          onError={() => {
            setIsPreviewBlockErrored(true);
          }}
        />
      ) : null}
      <FooterBlock
        {...(getBooleanFF(
          'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
        ) && { overrideCss: footerBlockCss })}
        actions={footerActions}
      />
    </FlexibleCard>
  );
};

export default withFlexibleUIBlockCardStyle(FlexibleResolvedView);
