import React, { FC } from 'react';
import {
  BlockCardResolvingView,
  CardLinkView,
  BlockCardErroredView,
  BlockCardResolvedView,
} from '@atlaskit/media-ui';
import {
  EmbedCardResolvedView,
  EmbedCardUnauthorisedView,
  EmbedCardForbiddenView,
  EmbedCardNotFoundView,
} from '@atlaskit/media-ui/embeds';
import { JsonLd } from 'json-ld-types';

import { EmbedCardProps } from './types';
import { extractEmbedProps } from '../../extractors/embed';
import { getEmptyJsonLd } from '../../utils/jsonld';
import { extractBlockProps } from '../../extractors/block';
import { getDefinitionId } from '../../state/helpers';

export const EmbedCard: FC<EmbedCardProps> = ({
  url,
  cardState: { status, details },
  handleAuthorize,
  handleErrorRetry,
  handleFrameClick,
  handleAnalytics,
  handleInvoke,
  showActions,
  isSelected,
  isFrameVisible,
  platform,
  onResolve,
  testId,
  inheritDimensions,
}) => {
  const data =
    ((details && details.data) as JsonLd.Data.BaseData) || getEmptyJsonLd();
  switch (status) {
    case 'pending':
      return (
        <CardLinkView
          testId={testId}
          link={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
        />
      );
    case 'resolving':
      return (
        <BlockCardResolvingView
          testId="embed-card-resolving-view"
          inheritDimensions={inheritDimensions}
          isSelected={isSelected}
        />
      );
    case 'resolved':
      const resolvedViewProps = extractEmbedProps(data, platform);
      if (onResolve) {
        onResolve({
          title: resolvedViewProps.title,
          url,
        });
      }
      if (resolvedViewProps.preview) {
        return (
          <EmbedCardResolvedView
            {...resolvedViewProps}
            isSelected={isSelected}
            isFrameVisible={isFrameVisible}
            inheritDimensions={inheritDimensions}
            onClick={handleFrameClick}
          />
        );
      } else {
        const resolvedBlockViewProps = extractBlockProps(data, {
          handleAnalytics,
          handleInvoke,
          definitionId: getDefinitionId(details),
        });
        return (
          <BlockCardResolvedView
            {...resolvedBlockViewProps}
            isSelected={isSelected}
            testId={testId}
            showActions={showActions}
            onClick={handleFrameClick}
          />
        );
      }
    case 'unauthorized':
      const unauthorisedViewProps = extractEmbedProps(data, platform);
      return (
        <EmbedCardUnauthorisedView
          {...unauthorisedViewProps}
          isSelected={isSelected}
          onAuthorise={handleAuthorize}
          inheritDimensions={inheritDimensions}
          onClick={handleFrameClick}
        />
      );
    case 'forbidden':
      const forbiddenViewProps = extractEmbedProps(data, platform);
      return (
        <EmbedCardForbiddenView
          {...forbiddenViewProps}
          isSelected={isSelected}
          onAuthorise={handleAuthorize}
          inheritDimensions={inheritDimensions}
          onClick={handleFrameClick}
        />
      );
    case 'not_found':
      const notFoundViewProps = extractEmbedProps(data, platform);
      return (
        <EmbedCardNotFoundView
          {...notFoundViewProps}
          isSelected={isSelected}
          inheritDimensions={inheritDimensions}
          onClick={handleFrameClick}
        />
      );
    case 'fallback':
    case 'errored':
      return (
        <BlockCardErroredView
          onRetry={handleErrorRetry}
          isSelected={isSelected}
        />
      );
  }
};
