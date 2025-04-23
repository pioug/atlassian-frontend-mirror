import React from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';

import { extractRequestAccessContextImproved } from '../../extractors/common/context/extractAccessContext';
import { extractEmbedProps } from '../../extractors/embed';
import { extractInlineProps } from '../../extractors/inline';
import { getExtensionKey, hasAuthScopeOverrides } from '../../state/helpers';
import { useControlDataExportConfig } from '../../state/hooks/use-control-data-export-config';
import { getForbiddenJsonLd } from '../../utils/jsonld';
import { getIsDataExportEnabled } from '../../utils/should-data-export';
import BlockCardResolvedView from '../BlockCard/views/ResolvedView';
import { InlineCardResolvedView } from '../InlineCard/ResolvedView';

import { type EmbedCardProps } from './types';
import { EmbedCardErroredView } from './views/ErroredView';
import ForbiddenView from './views/forbidden-view';
import NotFoundView from './views/not-found-view';
import { EmbedCardResolvedView } from './views/ResolvedView';
import UnauthorizedView from './views/unauthorized-view';

export const EmbedCard = React.forwardRef<HTMLIFrameElement, EmbedCardProps>(
	(
		{
			url,
			cardState,
			handleAuthorize,
			handleErrorRetry,
			handleFrameClick,
			isSelected,
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
			renderers,
		},
		iframeRef,
	) => {
		const { createAnalyticsEvent } = useAnalyticsEvents();

		const { status, details } = cardState;

		const extensionKey = getExtensionKey(details);
		const isProductIntegrationSupported = hasAuthScopeOverrides(details);
		const { shouldControlDataExport = false } = useControlDataExportConfig();

		switch (status) {
			case 'pending':
			case 'resolving':
				return (
					<BlockCardResolvedView
						url={url}
						cardState={cardState}
						onClick={handleFrameClick}
						onError={onError}
						onResolve={onResolve}
						renderers={renderers}
						actionOptions={actionOptions}
						testId={testId ? `${testId}-resolving-view` : 'embed-card-resolving-view'}
					/>
				);
			case 'resolved':
				const resolvedViewProps = extractEmbedProps(details, platform, iframeUrlType);
				if (onResolve) {
					onResolve({
						title: resolvedViewProps.title,
						url,
						aspectRatio: resolvedViewProps.preview?.aspectRatio,
					});
				}

				if (fg('platform_smart_links_controlled_dsp_export_view')) {
					if (getIsDataExportEnabled(shouldControlDataExport, cardState.details)) {
						const unauthViewProps = extractEmbedProps(details, platform);
						return (
							<UnauthorizedView
								context={unauthViewProps.context}
								extensionKey={extensionKey}
								frameStyle={frameStyle}
								isProductIntegrationSupported={isProductIntegrationSupported}
								inheritDimensions={inheritDimensions}
								isSelected={isSelected}
								onAuthorize={handleAuthorize}
								onClick={handleFrameClick}
								testId={testId}
								url={unauthViewProps.link}
							/>
						);
					}
				}

				if (resolvedViewProps.preview) {
					return (
						<EmbedCardResolvedView
							{...resolvedViewProps}
							isSelected={isSelected}
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
						const resolvedInlineViewProps = extractInlineProps(details);
						return (
							<InlineCardResolvedView
								{...resolvedInlineViewProps}
								isSelected={isSelected}
								testId={testId}
								onClick={handleFrameClick}
							/>
						);
					}

					return (
						<BlockCardResolvedView
							url={url}
							cardState={cardState}
							onClick={handleFrameClick}
							onError={onError}
							onResolve={onResolve}
							renderers={renderers}
							actionOptions={actionOptions}
							testId={testId}
						/>
					);
				}
			case 'unauthorized':
				if (onError) {
					onError({ url, status });
				}
				const unauthorisedViewProps = extractEmbedProps(details, platform);
				return (
					<UnauthorizedView
						context={unauthorisedViewProps.context}
						extensionKey={extensionKey}
						frameStyle={frameStyle}
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
				const forbiddenViewProps = extractEmbedProps(details, platform);
				const cardMetadata = details?.meta ?? getForbiddenJsonLd().meta;

				if (forbiddenViewProps.preview) {
					return (
						<EmbedCardResolvedView
							{...forbiddenViewProps}
							title={forbiddenViewProps.link}
							frameStyle={frameStyle}
							isSelected={isSelected}
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
						frameStyle={frameStyle}
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
				const notFoundViewProps = extractEmbedProps(details, platform);

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
						frameStyle={frameStyle}
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
