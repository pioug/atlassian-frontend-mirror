import React, { useEffect, useState } from 'react';
import FlexibleCard from '../../../FlexibleCard';
import TitleBlock from '../../../FlexibleCard/components/blocks/title-block';
import {
  FooterBlock,
  MetadataBlock,
  PreviewBlock,
  SnippetBlock,
} from '../../../FlexibleCard/components/blocks';
import { metadataBlockCss } from './styled';
import {
  ActionName,
  CardDisplay,
  ElementName,
  MediaPlacement,
  SmartLinkPosition,
} from '../../../../constants';
import { FlexibleBlockCardProps } from './types';
import uuid from 'uuid';
import { getSimulatedMetadata, getSimulatedBetterMetadata } from './utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';

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

  const [analyticsId] = useState(() => (id ? id : uuid()));

  const { titleMetadata, topMetadata, bottomMetadata } = getBooleanFF(
    'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
  )
    ? getSimulatedBetterMetadata(cardState.details)
    : getSimulatedMetadata(cardState.details);

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
      ) && <MetadataBlock primary={bottomMetadata} maxLines={1} />}

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
        actions={[
          {
            name: ActionName.PreviewAction,
            hideIcon: true,
            onClick: () => {
              analytics.ui.actionClickedEvent({
                id: analyticsId,
                actionType: 'PreviewAction',
                display: CardDisplay.Block,
              });
              analytics.operational.invokeSucceededEvent({
                id: analyticsId,
                actionType: 'PreviewAction',
                display: CardDisplay.Block,
              });
            },
          },
          {
            name: ActionName.ViewAction,
            hideIcon: true,
            onClick: () => {
              analytics.ui.actionClickedEvent({
                id: analyticsId,
                actionType: 'ViewAction',
                display: CardDisplay.Block,
              });
              analytics.operational.invokeSucceededEvent({
                id: analyticsId,
                actionType: 'ViewAction',
                display: CardDisplay.Block,
              });
            },
          },
          {
            name: ActionName.DownloadAction,
            hideIcon: true,
            onClick: () => {
              analytics.ui.actionClickedEvent({
                id: analyticsId,
                actionType: 'DownloadAction',
                display: CardDisplay.Block,
              });
              analytics.operational.invokeSucceededEvent({
                id: analyticsId,
                actionType: 'DownloadAction',
                display: CardDisplay.Block,
              });
            },
          },
        ]}
      />
    </FlexibleCard>
  );
};

export default withFlexibleUIBlockCardStyle(FlexibleResolvedView);
