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
  ElementName,
  MediaPlacement,
  SmartLinkPosition,
} from '../../../../constants';
import { FlexibleBlockCardProps } from './types';

/**
 * This view represents a Block card that has an 'Resolved' status.
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const FlexibleResolvedView = ({
  cardState,
  onClick,
  onError,
  testId = 'smart-block-resolved-view',
  ui,
  url,
}: FlexibleBlockCardProps) => {
  const [isPreviewBlockErrored, setIsPreviewBlockErrored] =
    useState<boolean>(false);

  useEffect(() => {
    setIsPreviewBlockErrored(false);
  }, [url, cardState]);

  return (
    <FlexibleCard
      appearance="block"
      cardState={cardState}
      onClick={onClick}
      onError={onError}
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
          { name: ElementName.DueOn },
        ]}
        maxLines={1}
      />
      <MetadataBlock />
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
          { name: ActionName.PreviewAction },
          { name: ActionName.ViewAction },
          { name: ActionName.DownloadAction },
        ]}
      />
    </FlexibleCard>
  );
};

export default FlexibleResolvedView;
