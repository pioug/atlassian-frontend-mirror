import React, { FC } from 'react';
import {
  BlockCardResolvingView,
  CardLinkView,
  BlockCardErroredView,
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

export const EmbedCard: FC<EmbedCardProps> = ({
  url,
  cardState: { status, details },
  handleAuthorize,
  handleErrorRetry,
  handleFrameClick,
  isSelected,
  isFrameVisible,
  onResolve,
  testId,
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
      return <BlockCardResolvingView isSelected={isSelected} />;
    case 'resolved':
      const resolvedViewProps = extractEmbedProps(data);
      if (onResolve) {
        onResolve({
          title: resolvedViewProps.title,
          url,
        });
      }
      return (
        <EmbedCardResolvedView
          {...resolvedViewProps}
          isSelected={isSelected}
          isFrameVisible={isFrameVisible}
        />
      );
    case 'unauthorized':
      const unauthorisedViewProps = extractEmbedProps(data);
      return (
        <EmbedCardUnauthorisedView
          {...unauthorisedViewProps}
          isSelected={isSelected}
          onAuthorise={handleAuthorize}
        />
      );
    case 'forbidden':
      const forbiddenViewProps = extractEmbedProps(data);
      return (
        <EmbedCardForbiddenView
          {...forbiddenViewProps}
          isSelected={isSelected}
          onAuthorise={handleAuthorize}
        />
      );
    case 'not_found':
      const notFoundViewProps = extractEmbedProps(data);
      return (
        <EmbedCardNotFoundView {...notFoundViewProps} isSelected={isSelected} />
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
