import React from 'react';
import { FC } from 'react';
import {
  CardLinkView,
  InlineCardResolvedView,
  InlineCardResolvingView,
  InlineCardErroredView,
  InlineCardForbiddenView,
  InlineCardUnauthorizedView,
} from '@atlaskit/media-ui';
import { InlineCardProps } from './types';
import { getEmptyJsonLd, getUnauthorizedJsonLd } from '../../utils/jsonld';
import { extractInlineProps } from '../../extractors/inline';
import { JsonLd } from 'json-ld-types';
import {
  extractProvider,
  extractRequestAccessContext,
} from '../../extractors/common/context';

export const InlineCard: FC<InlineCardProps> = ({
  url,
  cardState,
  handleAuthorize,
  handleFrameClick,
  isSelected,
  renderers,
  onResolve,
  testId,
  inlinePreloaderStyle,
}) => {
  const { status, details } = cardState;
  const cardDetails = (details && details.data) || getEmptyJsonLd();
  const testIdWithStatus = testId ? `${testId}-${status}-view` : undefined;
  switch (status) {
    case 'pending':
    case 'resolving':
      return (
        <InlineCardResolvingView
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          testId={testIdWithStatus}
          inlinePreloaderStyle={inlinePreloaderStyle}
        />
      );
    case 'resolved':
      const resolvedProps = extractInlineProps(
        cardDetails as JsonLd.Data.BaseData,
        renderers,
      );

      if (onResolve) {
        onResolve({
          url,
          title: resolvedProps.title,
        });
      }

      return (
        <InlineCardResolvedView
          {...resolvedProps}
          link={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          testId={testIdWithStatus}
        />
      );
    case 'unauthorized':
      const provider = extractProvider(cardDetails as JsonLd.Data.BaseData);
      return (
        <InlineCardUnauthorizedView
          icon={provider && provider.icon}
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          onAuthorise={handleAuthorize}
          testId={testIdWithStatus}
        />
      );
    case 'forbidden':
      const providerForbidden = extractProvider(
        cardDetails as JsonLd.Data.BaseData,
      );
      const cardMetadata = details?.meta ?? getUnauthorizedJsonLd().meta;
      const requestAccessContext = extractRequestAccessContext({
        jsonLd: cardMetadata,
        url,
        context: providerForbidden?.text,
      });
      return (
        <InlineCardForbiddenView
          url={url}
          icon={providerForbidden && providerForbidden.icon}
          context={providerForbidden?.text}
          isSelected={isSelected}
          onClick={handleFrameClick}
          onAuthorise={handleAuthorize}
          testId={testIdWithStatus}
          requestAccessContext={requestAccessContext}
        />
      );
    case 'not_found':
      const providerNotFound = extractProvider(
        cardDetails as JsonLd.Data.BaseData,
      );
      return (
        <InlineCardErroredView
          url={url}
          icon={providerNotFound && providerNotFound.icon}
          isSelected={isSelected}
          message="Can't find link"
          onClick={handleFrameClick}
          testId={testIdWithStatus || 'inline-card-not-found-view'}
        />
      );
    case 'fallback':
    case 'errored':
      return (
        <CardLinkView
          link={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          testId={testIdWithStatus || 'inline-card-errored-view'}
        />
      );
  }
};
