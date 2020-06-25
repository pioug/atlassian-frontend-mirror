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
import { getEmptyJsonLd } from '../../utils/jsonld';
import { extractInlineProps } from '../../extractors/inline';
import { JsonLd } from 'json-ld-types';
import { extractProvider } from '../../extractors/common/context';

export const InlineCard: FC<InlineCardProps> = ({
  url,
  cardState,
  handleAuthorize,
  handleFrameClick,
  isSelected,
  onResolve,
  testId = 'inline-card',
}) => {
  const { status, details } = cardState;
  const cardDetails = (details && details.data) || getEmptyJsonLd();
  switch (status) {
    case 'pending':
      return (
        <CardLinkView
          link={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          testId={`${testId}-${status}-view`}
        />
      );
    case 'resolving':
      return (
        <InlineCardResolvingView
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          testId={`${testId}-${status}-view`}
        />
      );
    case 'resolved':
      const resolvedProps = extractInlineProps(
        cardDetails as JsonLd.Data.BaseData,
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
          testId={`${testId}-${status}-view`}
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
          testId={`${testId}-${status}-view`}
        />
      );
    case 'forbidden':
      return (
        <InlineCardForbiddenView
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          onAuthorise={handleAuthorize}
          testId={`${testId}-${status}-view`}
        />
      );
    case 'not_found':
      return (
        <InlineCardErroredView
          url={url}
          isSelected={isSelected}
          message="We couldn't find this link"
          onClick={handleFrameClick}
          testId={`${testId}-${status}-view`}
        />
      );
    case 'fallback':
    case 'errored':
      return (
        <CardLinkView
          link={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          testId={`${testId}-${status}-view`}
        />
      );
  }
};
