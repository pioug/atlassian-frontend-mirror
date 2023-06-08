import React, { useEffect, useState } from 'react';
import FlexibleCard from '../../../FlexibleCard';
import TitleBlock from '../../../FlexibleCard/components/blocks/title-block';
import { ElementItem } from '../../../FlexibleCard/components/blocks/types';
import {
  FooterBlock,
  MetadataBlock,
  PreviewBlock,
  SnippetBlock,
} from '../../../FlexibleCard/components/blocks';
import {
  ActionName,
  CardDisplay,
  ElementName,
  MediaPlacement,
  SmartLinkPosition,
} from '../../../../constants';
import { FlexibleBlockCardProps } from './types';
import uuid from 'uuid';
import { extractOwnedBy } from '../../../../extractors/flexible/utils';
import { JsonLd } from 'json-ld-types';

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
  ui,
  url,
  analytics,
}: FlexibleBlockCardProps) => {
  const [isPreviewBlockErrored, setIsPreviewBlockErrored] =
    useState<boolean>(false);

  useEffect(() => {
    setIsPreviewBlockErrored(false);
  }, [url, cardState]);

  const [analyticsId] = useState(() => (id ? id : uuid()));

  const baseMetadata: ElementItem[] = [
    { name: ElementName.ModifiedOn },
    { name: ElementName.AttachmentCount },
    { name: ElementName.CommentCount },
    { name: ElementName.ReactCount },
    { name: ElementName.SubscriberCount },
    { name: ElementName.ViewCount },
    { name: ElementName.VoteCount },
    { name: ElementName.ChecklistProgress },
    { name: ElementName.DueOn },
  ];
  const metadata: ElementItem[] =
    cardState?.details?.data &&
    extractOwnedBy(cardState?.details?.data as JsonLd.Data.BaseData)
      ? [{ name: ElementName.OwnedBy }, ...baseMetadata]
      : [{ name: ElementName.ModifiedBy }, ...baseMetadata];

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
      ui={ui}
      url={url}
    >
      <TitleBlock
        position={SmartLinkPosition.Center}
        metadata={[
          { name: ElementName.AuthorGroup },
          { name: ElementName.Priority },
          { name: ElementName.State },
        ]}
        hideRetry={true}
        subtitle={[{ name: ElementName.Location }]}
        metadataPosition={SmartLinkPosition.Top}
        anchorTarget={anchorTarget}
      />
      <MetadataBlock primary={metadata} maxLines={1} />

      <SnippetBlock />
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

export default FlexibleResolvedView;
