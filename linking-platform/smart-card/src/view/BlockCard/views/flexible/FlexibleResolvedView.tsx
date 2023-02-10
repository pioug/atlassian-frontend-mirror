import React, { useEffect, useState } from 'react';
import FlexibleCard from '../../../FlexibleCard';
import TitleBlock from '../../../FlexibleCard/components/blocks/title-block';
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

  return (
    <FlexibleCard
      appearance="block"
      cardState={cardState}
      onClick={onClick}
      onError={onError}
      onResolve={onResolve}
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
      />
      <MetadataBlock
        primary={[
          { name: ElementName.ModifiedBy },
          { name: ElementName.ModifiedOn },
        ]}
        secondary={[
          { name: ElementName.AttachmentCount },
          { name: ElementName.CommentCount },
          { name: ElementName.ReactCount },
          { name: ElementName.SubscriberCount },
          { name: ElementName.ViewCount },
          { name: ElementName.VoteCount },
          { name: ElementName.ChecklistProgress },
          { name: ElementName.DueOn },
        ]}
        maxLines={1}
      />
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
