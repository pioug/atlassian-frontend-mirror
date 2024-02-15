import React from 'react';
import { JsonLd } from 'json-ld-types';
import { extractRequestAccessContextImproved } from '../../extractors/common/context/extractAccessContext';
import { EmbedCardProps } from './types';
import { extractEmbedProps } from '../../extractors/embed';
import { getEmptyJsonLd, getForbiddenJsonLd } from '../../utils/jsonld';
import { extractInlineProps } from '../../extractors/inline';
import { extractBlockProps } from '../../extractors/block';
import { getExtensionKey, hasAuthScopeOverrides } from '../../state/helpers';
import { BlockCardResolvedView, BlockCardResolvingView } from '../BlockCard';
import { InlineCardResolvedView } from '../InlineCard/ResolvedView';
import { EmbedCardResolvedView } from './views/ResolvedView';
import { EmbedCardErroredView } from './views/ErroredView';
import ForbiddenView from './views/forbidden-view';
import NotFoundView from './views/not-found-view';
import UnauthorizedView from './views/unauthorized-view';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';

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
      actionOptions,
    },
    iframeRef,
  ) => {
    const { createAnalyticsEvent } = useAnalyticsEvents();

    const data =
      ((details && details.data) as JsonLd.Data.BaseData) || getEmptyJsonLd();
    const meta = (details && details.meta) as JsonLd.Meta.BaseMeta;
    const extensionKey = getExtensionKey(details);
    const isProductIntegrationSupported = hasAuthScopeOverrides(details);

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
            actionOptions,
          });
          return (
            <BlockCardResolvedView
              {...resolvedBlockViewProps}
              isSelected={isSelected}
              testId={testId}
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
          <UnauthorizedView
            analytics={analytics}
            context={unauthorisedViewProps.context}
            extensionKey={extensionKey}
            isProductIntegrationSupported={isProductIntegrationSupported}
            inheritDimensions={inheritDimensions}
            isSelected={isSelected}
            onAuthorize={handleAuthorize}
            onClick={handleFrameClick}
            testId={testId}
            url={unauthorisedViewProps.link}
          />
        );
      case 'forbidden':
        if (onError) {
          onError({ url, status });
        }
        const forbiddenViewProps = extractEmbedProps(data, meta, platform);
        const cardMetadata = details?.meta ?? getForbiddenJsonLd().meta;

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

        const forbiddenAccessContext = extractRequestAccessContextImproved({
          jsonLd: cardMetadata,
          url,
          product: forbiddenViewProps.context?.text ?? '',
          createAnalyticsEvent,
        });

        return (
          <ForbiddenView
            context={forbiddenViewProps.context}
            inheritDimensions={inheritDimensions}
            isSelected={isSelected}
            onAuthorize={handleAuthorize}
            onClick={handleFrameClick}
            accessContext={forbiddenAccessContext}
            url={forbiddenViewProps.link}
          />
        );
      case 'not_found':
        if (onError) {
          onError({ url, status });
        }
        const notFoundViewProps = extractEmbedProps(data, meta, platform);

        const notFoundAccessContext = details?.meta
          ? extractRequestAccessContextImproved({
              jsonLd: details?.meta,
              url,
              product: notFoundViewProps.context?.text ?? '',
              createAnalyticsEvent,
            })
          : undefined;

        return (
          <NotFoundView
            context={notFoundViewProps.context}
            inheritDimensions={inheritDimensions}
            isSelected={isSelected}
            onClick={handleFrameClick}
            accessContext={notFoundAccessContext}
            url={notFoundViewProps.link}
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
