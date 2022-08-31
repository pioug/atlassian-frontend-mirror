import React, { FC } from 'react';
import { BlockCardProps } from './types';
import { JsonLd } from 'json-ld-types';
import { getExtensionKey } from '../../state/helpers';
import { extractBlockProps } from '../../extractors/block';
import { getEmptyJsonLd, getUnauthorizedJsonLd } from '../../utils/jsonld';
import { ExtractBlockOpts } from '../../extractors/block/types';
import { extractRequestAccessContext } from '../../extractors/common/context';
import { CardLinkView } from '../LinkView';
import { AuthorizeAction } from './actions/AuthorizeAction';
import { ForbiddenAction } from './actions/ForbiddenAction';

import { ResolvedView as BlockCardResolvedView } from './views/ResolvedView';
import { NotFoundView as BlockCardNotFoundView } from './views/NotFoundView';
import { ResolvingView as BlockCardResolvingView } from './views/ResolvingView';
import { UnauthorizedView as BlockCardUnauthorisedView } from './views/UnauthorizedView';
import { ForbiddenView as BlockCardForbiddenView } from './views/ForbiddenView';
import { ErroredView as BlockCardErroredView } from './views/ErroredView';
import { useFeatureFlag } from '@atlaskit/link-provider';
import { LinkingPlatformFeatureFlags } from '@atlaskit/linking-common';

export { default as PreviewAction } from './actions/PreviewAction';
export type { ResolvedViewProps as BlockCardResolvedViewProps } from './views/ResolvedView';

export {
  ForbiddenAction,
  AuthorizeAction,
  BlockCardResolvedView,
  BlockCardResolvingView,
  BlockCardUnauthorisedView,
  BlockCardForbiddenView,
  BlockCardErroredView,
  BlockCardNotFoundView,
};

export const BlockCard: FC<BlockCardProps> = ({
  url,
  cardState: { status, details },
  authFlow,
  handleAuthorize,
  handleErrorRetry,
  handleFrameClick,
  handleInvoke,
  renderers,
  isSelected,
  onResolve,
  onError,
  testId,
  showActions,
  platform,
  analytics,
}) => {
  // Actions do not have access to the react tree, so we need to obtain
  // feature flags here where we still can access SmartLinkContext context
  // and pass the flags down to the extractor. See PreviewAction.tsx for details.
  const embedModalSize = useFeatureFlag('embedModalSize');
  const featureFlags = { embedModalSize } as Partial<
    LinkingPlatformFeatureFlags
  >;

  const data =
    ((details && details.data) as JsonLd.Data.BaseData) || getEmptyJsonLd();
  const meta = (details && details.meta) as JsonLd.Meta.BaseMeta;
  const extractorOpts: ExtractBlockOpts = {
    analytics,
    origin: 'smartLinkCard',
    featureFlags,
    handleInvoke,
    extensionKey: getExtensionKey(details),
  };

  switch (status) {
    case 'pending':
    case 'resolving':
      return <BlockCardResolvingView testId={testId} isSelected={isSelected} />;
    case 'resolved':
      const resolvedViewProps = extractBlockProps(
        data,
        meta,
        extractorOpts,
        renderers,
        platform,
      );
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
      if (onError) {
        onError({ url, status });
      }

      const unauthorizedViewProps = extractBlockProps(
        data,
        meta,
        extractorOpts,
      );
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
      if (onError) {
        onError({ url, status });
      }

      const forbiddenViewProps = extractBlockProps(data, meta, extractorOpts);
      const cardMetadata = details?.meta ?? getUnauthorizedJsonLd().meta;
      const requestAccessContext = extractRequestAccessContext({
        jsonLd: cardMetadata,
        url,
        context: forbiddenViewProps.context?.text,
      });
      return (
        <BlockCardForbiddenView
          {...forbiddenViewProps}
          isSelected={isSelected}
          showActions={showActions}
          actions={handleAuthorize ? [ForbiddenAction(handleAuthorize)] : []}
          onClick={handleFrameClick}
          requestAccessContext={requestAccessContext}
        />
      );
    case 'not_found':
      if (onError) {
        onError({ url, status });
      }

      const notFoundViewProps = extractBlockProps(data, meta, extractorOpts);
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
      if (onError) {
        onError({ url, status });
      }

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
          link={url}
          isSelected={isSelected}
          onRetry={handleErrorRetry}
          onClick={handleFrameClick}
          testId={testId}
        />
      );
  }
};
