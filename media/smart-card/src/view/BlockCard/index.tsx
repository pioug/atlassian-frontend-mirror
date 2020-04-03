import React from 'react';
import { FC } from 'react';
import {
  CardLinkView,
  BlockCardResolvingView,
  BlockCardErroredView,
  BlockCardUnauthorisedView,
  BlockCardForbiddenView,
  BlockCardResolvedView,
  AuthorizeAction,
  ForbiddenAction,
} from '@atlaskit/media-ui';
import { BlockCardProps } from './types';
import { extractBlockPropsFromJSONLD } from '../../extractors/block';

export const BlockCard: FC<BlockCardProps> = ({
  url,
  cardState: { status, details },
  handleAuthorize,
  handleErrorRetry,
  handleFrameClick,
  isSelected,
  onResolve,
  testId,
}) => {
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
      return <BlockCardResolvingView testId={testId} isSelected={isSelected} />;
    case 'resolved':
      const resolvedViewProps = extractBlockPropsFromJSONLD(
        (details && details.data) || {},
      );

      if (onResolve) {
        onResolve({ title: resolvedViewProps.title, url });
      }

      return (
        <BlockCardResolvedView
          {...resolvedViewProps}
          isSelected={isSelected}
          testId={testId}
        />
      );
    case 'unauthorized':
      const unauthorizedViewProps = extractBlockPropsFromJSONLD(
        (details && details.data) || {},
      );
      return (
        <BlockCardUnauthorisedView
          {...unauthorizedViewProps}
          isSelected={isSelected}
          testId={testId}
          actions={handleAuthorize ? [AuthorizeAction(handleAuthorize)] : []}
        />
      );
    case 'forbidden':
      return (
        <BlockCardForbiddenView
          isSelected={isSelected}
          actions={handleAuthorize ? [ForbiddenAction(handleAuthorize)] : []}
        />
      );
    case 'not_found':
      return (
        <BlockCardErroredView
          isSelected={isSelected}
          onRetry={handleFrameClick}
          testId={testId}
        />
      );
    case 'errored':
      return (
        <BlockCardErroredView
          isSelected={isSelected}
          onRetry={handleErrorRetry}
          testId={testId}
        />
      );
  }
};
