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
import { extractInlinePropsFromJSONLD } from '../../extractors/inline';
import { getCollapsedIcon } from '../../utils';

export const InlineCard: FC<InlineCardProps> = ({
  url,
  cardState,
  handleAuthorize,
  handleFrameClick,
  isSelected,
  onResolve,
  testId,
}) => {
  const { status, details } = cardState;
  switch (status) {
    case 'pending':
      return (
        <CardLinkView
          link={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          testId={`${testId}-${status}`}
        />
      );
    case 'resolving':
      return (
        <InlineCardResolvingView
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          testId={`${testId}-${status}`}
        />
      );
    case 'resolved':
      const props = extractInlinePropsFromJSONLD(
        (details && details.data) || {},
      );

      if (onResolve) {
        onResolve({
          url,
          title: props.title,
        });
      }

      return (
        <InlineCardResolvedView
          {...props}
          link={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          testId={`${testId}-${status}`}
        />
      );
    case 'unauthorized':
      return (
        <InlineCardUnauthorizedView
          icon={getCollapsedIcon(details)}
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          onAuthorise={handleAuthorize}
          testId={`${testId}-${status}`}
        />
      );
    case 'forbidden':
      return (
        <InlineCardForbiddenView
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          onAuthorise={handleAuthorize}
          testId={`${testId}-${status}`}
        />
      );
    case 'not_found':
      return (
        <InlineCardErroredView
          url={url}
          isSelected={isSelected}
          message="We couldn't find this link"
          onClick={handleFrameClick}
          testId={`${testId}-${status}`}
        />
      );
    case 'errored':
      return (
        <CardLinkView
          link={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          testId={`${testId}-${status}`}
        />
      );
  }
};
