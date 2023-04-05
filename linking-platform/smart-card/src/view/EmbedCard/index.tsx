import React from 'react';
import { JsonLd } from 'json-ld-types';

import { EmbedCardProps } from './types';
import { extractEmbedProps } from '../../extractors/embed';
import { getEmptyJsonLd, getForbiddenJsonLd } from '../../utils/jsonld';
import { extractInlineProps } from '../../extractors/inline';
import { extractBlockProps } from '../../extractors/block';
import { getExtensionKey } from '../../state/helpers';
import { extractRequestAccessContext } from '../../extractors/common/context';
import { BlockCardResolvedView, BlockCardResolvingView } from '../BlockCard';
import { InlineCardResolvedView } from '../InlineCard/ResolvedView';
import { EmbedCardForbiddenView } from './views/ForbiddenView';
import { EmbedCardNotFoundView } from './views/NotFoundView';
import { EmbedCardResolvedView } from './views/ResolvedView';
import { EmbedCardUnauthorisedView } from './views/UnauthorisedView';
import { EmbedCardErroredView } from './views/ErroredView';

export const EmbedCard = React.forwardRef<HTMLIFrameElement, EmbedCardProps>(
  (
    {
      url,
      cardState: { status, details },
      handleAuthorize,
      handleErrorRetry,
      handleFrameClick,
      analytics,
      handleInvoke,
      showActions,
      isSelected,
      isFrameVisible,
      frameStyle,
      platform,
      onResolve,
      onError,
      testId,
      inheritDimensions,
      onIframeDwell,
      onIframeFocus,
      iframeUrlType,
    },
    iframeRef,
  ) => {
    const data =
      ((details && details.data) as JsonLd.Data.BaseData) || getEmptyJsonLd();
    const meta = (details && details.meta) as JsonLd.Meta.BaseMeta;
    const extensionKey = getExtensionKey(details);

    switch (status) {
      case 'pending':
      case 'resolving':
        return (
          <BlockCardResolvingView
            testId="embed-card-resolving-view"
            inheritDimensions={inheritDimensions}
            isSelected={isSelected}
          />
        );
      case 'resolved':
        const resolvedViewProps = extractEmbedProps(
          data,
          meta,
          platform,
          iframeUrlType,
        );
        if (onResolve) {
          onResolve({
            title: resolvedViewProps.title,
            url,
            aspectRatio: resolvedViewProps.preview?.aspectRatio,
          });
        }
        if (resolvedViewProps.preview) {
          return (
            <EmbedCardResolvedView
              {...resolvedViewProps}
              isSelected={isSelected}
              isFrameVisible={isFrameVisible}
              frameStyle={frameStyle}
              inheritDimensions={inheritDimensions}
              onClick={handleFrameClick}
              ref={iframeRef}
              onIframeDwell={onIframeDwell}
              onIframeFocus={onIframeFocus}
              testId={testId}
            />
          );
        } else {
          if (platform === 'mobile') {
            const resolvedInlineViewProps = extractInlineProps(data);
            return (
              <InlineCardResolvedView
                {...resolvedInlineViewProps}
                isSelected={isSelected}
                testId={testId}
                onClick={handleFrameClick}
              />
            );
          }
          const resolvedBlockViewProps = extractBlockProps(data, meta, {
            analytics,
            origin: 'smartLinkEmbed',
            handleInvoke,
            extensionKey,
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
        if (onError) {
          onError({ url, status });
        }
        const unauthorisedViewProps = extractEmbedProps(data, meta, platform);
        return (
          <EmbedCardUnauthorisedView
            {...unauthorisedViewProps}
            isSelected={isSelected}
            onAuthorise={handleAuthorize}
            inheritDimensions={inheritDimensions}
            onClick={handleFrameClick}
            analytics={analytics}
            extensionKey={extensionKey}
            testId={testId}
          />
        );
      case 'forbidden':
        if (onError) {
          onError({ url, status });
        }
        const forbiddenViewProps = extractEmbedProps(data, meta, platform);
        const cardMetadata = details?.meta ?? getForbiddenJsonLd().meta;
        const requestAccessContext = extractRequestAccessContext({
          jsonLd: cardMetadata,
          url,
          context: forbiddenViewProps.context?.text,
        });

        if (forbiddenViewProps.preview) {
          return (
            <EmbedCardResolvedView
              {...forbiddenViewProps}
              title={forbiddenViewProps.link}
              isSelected={isSelected}
              isFrameVisible={isFrameVisible}
              inheritDimensions={inheritDimensions}
              onClick={handleFrameClick}
              ref={iframeRef}
            />
          );
        }

        return (
          <EmbedCardForbiddenView
            {...forbiddenViewProps}
            isSelected={isSelected}
            onAuthorise={handleAuthorize}
            inheritDimensions={inheritDimensions}
            onClick={handleFrameClick}
            requestAccessContext={requestAccessContext}
          />
        );
      case 'not_found':
        if (onError) {
          onError({ url, status });
        }
        const notFoundViewProps = extractEmbedProps(data, meta, platform);
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
      default:
        if (onError) {
          onError({ url, status });
        }
        return (
          <EmbedCardErroredView
            onRetry={handleErrorRetry}
            inheritDimensions={inheritDimensions}
            isSelected={isSelected}
          />
        );
    }
  },
);
