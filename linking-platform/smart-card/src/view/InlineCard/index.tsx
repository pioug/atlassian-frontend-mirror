import React, { FC } from 'react';
import { InlineCardProps } from './types';
import { getEmptyJsonLd, getForbiddenJsonLd } from '../../utils/jsonld';
import { extractInlineProps } from '../../extractors/inline';
import { JsonLd } from 'json-ld-types';
import { extractRequestAccessContext } from '../../extractors/common/context';
import { CardLinkView } from '../LinkView';
import { InlineCardErroredView } from './ErroredView';
import { InlineCardForbiddenView } from './ForbiddenView';
import { InlineCardResolvedView } from './ResolvedView';
import { InlineCardResolvingView } from './ResolvingView';
import { InlineCardUnauthorizedView } from './UnauthorisedView';
import { extractProvider } from '@atlaskit/linking-common/extractors';
import { useFeatureFlag } from '@atlaskit/link-provider';
import { getExtensionKey } from '../../state/helpers';

export {
  InlineCardResolvedView,
  InlineCardResolvingView,
  InlineCardErroredView,
  InlineCardForbiddenView,
  InlineCardUnauthorizedView,
};

export const InlineCard: FC<InlineCardProps> = ({
  analytics,
  id,
  url,
  cardState,
  handleAuthorize,
  handleFrameClick,
  isSelected,
  renderers,
  onResolve,
  onError,
  testId,
  inlinePreloaderStyle,
  showHoverPreview,
  showAuthTooltip,
  showServerActions,
}) => {
  const { status, details } = cardState;
  const cardDetails = (details && details.data) || getEmptyJsonLd();
  const extensionKey = getExtensionKey(details);
  const testIdWithStatus = testId ? `${testId}-${status}-view` : undefined;

  const showHoverPreviewFlag = useFeatureFlag('showHoverPreview');
  if (showHoverPreview === undefined && showHoverPreviewFlag !== undefined) {
    showHoverPreview = Boolean(showHoverPreviewFlag);
  }

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
          id={id}
          showHoverPreview={showHoverPreview}
          showServerActions={showServerActions}
          link={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          testId={testIdWithStatus}
        />
      );
    case 'unauthorized':
      if (onError) {
        onError({ url, status });
      }

      const provider = extractProvider(cardDetails as JsonLd.Data.BaseData);
      return (
        <InlineCardUnauthorizedView
          icon={provider && provider.icon}
          context={provider && provider.text}
          url={url}
          isSelected={isSelected}
          onClick={handleFrameClick}
          onAuthorise={handleAuthorize}
          testId={testIdWithStatus}
          showAuthTooltip={showAuthTooltip}
          id={id}
          analytics={analytics}
          extensionKey={extensionKey}
        />
      );
    case 'forbidden':
      if (onError) {
        onError({ url, status });
      }

      const providerForbidden = extractProvider(
        cardDetails as JsonLd.Data.BaseData,
      );
      const cardMetadata = details?.meta ?? getForbiddenJsonLd().meta;
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
      if (onError) {
        onError({ url, status });
      }

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
    default:
      if (onError) {
        onError({ url, status });
      }

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
