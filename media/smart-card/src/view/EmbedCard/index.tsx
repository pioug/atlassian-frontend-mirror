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
import { getEmptyJsonLd } from '../../utils';

export const EmbedCard: FC<EmbedCardProps> = ({
  url,
  cardState: { status, details },
  handleAuthorize,
  handleErrorRetry,
  handleFrameClick,
  isSelected,
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
      return <BlockCardResolvingView />;
    case 'resolved':
      const resolvedViewProps = extractEmbedProps(data);
      if (onResolve) {
        onResolve({ title: resolvedViewProps.title, url });
      }
      return <EmbedCardResolvedView {...resolvedViewProps} />;
    case 'unauthorized':
      const unauthorisedViewProps = extractEmbedProps(data);
      return (
        <EmbedCardUnauthorisedView
          {...unauthorisedViewProps}
          onAuthorise={handleAuthorize}
        />
      );
    case 'forbidden':
      const forbiddenViewProps = extractEmbedProps(data);
      return (
        <EmbedCardForbiddenView
          {...forbiddenViewProps}
          onAuthorise={handleAuthorize}
        />
      );
    case 'not_found':
      const notFoundViewProps = extractEmbedProps(data);
      return <EmbedCardNotFoundView {...notFoundViewProps} />;
    case 'errored':
      return <BlockCardErroredView onRetry={handleErrorRetry} />;
  }
};
