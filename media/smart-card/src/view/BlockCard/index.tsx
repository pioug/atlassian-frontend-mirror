import React from 'react';
import { FC } from 'react';
import {
  CardLinkView,
  BlockCardResolvingView,
  BlockCardErroredView,
  BlockCardUnauthorisedView,
  BlockCardForbiddenView,
  BlockCardResolvedView,
  BlockCardNotFoundView,
  AuthorizeAction,
  ForbiddenAction,
} from '@atlaskit/media-ui';
import { BlockCardProps } from './types';
import { JsonLd } from 'json-ld-types';
import { extractPreviewFromProps } from '../../extractors/common/actions/extractPreviewAction';
import { getDefinitionId } from '../../state/helpers';
import { extractBlockActionPropsFromJSONLD } from '../../extractors/common/actions/extractActions';
import { extractBlockProps } from '../../extractors/block';
import { getEmptyJsonLd } from '../../utils/jsonld';

export const BlockCard: FC<BlockCardProps> = ({
  url,
  cardState: { status, details },
  authFlow,
  handleAuthorize,
  handleErrorRetry,
  handleFrameClick,
  handlePreviewAnalytics,
  handleInvoke,
  isSelected,
  onResolve,
  testId,
  showActions,
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
      return <BlockCardResolvingView testId={testId} isSelected={isSelected} />;
    case 'resolved':
      const resolvedViewProps = extractBlockProps(data);
      const resolvedViewActionProps = extractBlockActionPropsFromJSONLD(
        data,
        handleInvoke,
      );
      const actions = (resolvedViewProps.actions || []).concat(
        resolvedViewActionProps,
      );
      // At this point, we always have the `definitionId`.
      const definitionId = getDefinitionId(details) as string;
      const previewAction = extractPreviewFromProps(
        definitionId,
        resolvedViewProps,
        data,
        handleInvoke,
        handlePreviewAnalytics,
        testId,
      );
      // The previewAction should always be the last action
      if (previewAction) {
        actions.push(previewAction);
      }

      resolvedViewProps.actions = actions;

      if (onResolve) {
        onResolve({
          title: resolvedViewProps.title,
          url,
        });
      }

      return (
        <BlockCardResolvedView
          {...resolvedViewProps}
          isSelected={isSelected}
          testId={testId}
          showActions={showActions}
          onClick={handleFrameClick}
        />
      );
    case 'unauthorized':
      const unauthorizedViewProps = extractBlockProps(data);
      return (
        <BlockCardUnauthorisedView
          {...unauthorizedViewProps}
          isSelected={isSelected}
          testId={testId}
          showActions={showActions}
          actions={handleAuthorize ? [AuthorizeAction(handleAuthorize)] : []}
          onClick={handleFrameClick}
        />
      );
    case 'forbidden':
      const forbiddenViewProps = extractBlockProps(data);
      return (
        <BlockCardForbiddenView
          {...forbiddenViewProps}
          isSelected={isSelected}
          showActions={showActions}
          actions={handleAuthorize ? [ForbiddenAction(handleAuthorize)] : []}
          onClick={handleFrameClick}
        />
      );
    case 'not_found':
      const notFoundViewProps = extractBlockProps(data);
      return (
        <BlockCardNotFoundView
          {...notFoundViewProps}
          isSelected={isSelected}
          testId={testId}
          onClick={handleFrameClick}
        />
      );
    case 'fallback':
    case 'errored':
      if (authFlow && authFlow === 'disabled') {
        return (
          <CardLinkView
            link={url}
            isSelected={isSelected}
            onClick={handleFrameClick}
            testId={`${testId}-${status}`}
          />
        );
      }
      return (
        <BlockCardErroredView
          isSelected={isSelected}
          onRetry={handleErrorRetry}
          testId={testId}
        />
      );
  }
};
