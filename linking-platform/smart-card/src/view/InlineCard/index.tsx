import React, { useEffect } from 'react';

import { type JsonLd } from 'json-ld-types';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { extractProvider } from '@atlaskit/link-extractors';
import { useFeatureFlag } from '@atlaskit/link-provider';

import { SmartLinkStatus } from '../../constants';
import { extractRequestAccessContextImproved } from '../../extractors/common/context/extractAccessContext';
import { extractInlineProps } from '../../extractors/inline';
import { getExtensionKey } from '../../state/helpers';
import { getEmptyJsonLd, getForbiddenJsonLd } from '../../utils/jsonld';
import { CardLinkView } from '../LinkView';

import { InlineCardErroredView } from './ErroredView';
import { InlineCardForbiddenView } from './ForbiddenView';
import { InlineCardResolvedView } from './ResolvedView';
import { InlineCardResolvingView } from './ResolvingView';
import { type InlineCardProps } from './types';
import { InlineCardUnauthorizedView } from './UnauthorisedView';



export {
	InlineCardResolvedView,
	InlineCardResolvingView,
	InlineCardErroredView,
	InlineCardForbiddenView,
	InlineCardUnauthorizedView,
};

export const InlineCard = ({
	analytics,
	id,
	url,
	cardState,
	handleAuthorize,
	handleFrameClick,
	isSelected,
	isHovered,
	renderers,
	onResolve,
	onError,
	testId,
	inlinePreloaderStyle,
	showHoverPreview,
	hoverPreviewOptions,
	showAuthTooltip,
	actionOptions,
	removeTextHighlightingFromTitle,
	resolvingPlaceholder,
	truncateInline,
}: InlineCardProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const { status, details } = cardState;
	const cardDetails = (details && details.data) || getEmptyJsonLd();
	const extensionKey = getExtensionKey(details);
	const testIdWithStatus = testId ? `${testId}-${status}-view` : undefined;

	const showHoverPreviewFlag = useFeatureFlag('showHoverPreview');

	if (showHoverPreview === undefined && showHoverPreviewFlag !== undefined) {
		showHoverPreview = Boolean(showHoverPreviewFlag);
	}

	const resolvedProps =
		status === SmartLinkStatus.Resolved
			? extractInlineProps(
					cardDetails as JsonLd.Data.BaseData,
					renderers,
					removeTextHighlightingFromTitle,
				)
			: {};

	useEffect(() => {
		switch (status) {
			case SmartLinkStatus.Resolved:
				onResolve?.({
					url,
					title: resolvedProps.title,
				});
				break;
			case SmartLinkStatus.Errored:
			case SmartLinkStatus.Fallback:
			case SmartLinkStatus.Forbidden:
			case SmartLinkStatus.NotFound:
			case SmartLinkStatus.Unauthorized:
				if (onError) {
					onError({ status, url });
				}
				break;
		}
	}, [onError, onResolve, status, url, resolvedProps.title]);

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
					resolvingPlaceholder={resolvingPlaceholder}
					truncateInline={truncateInline}
				/>
			);
		case 'resolved':
			return (
				<InlineCardResolvedView
					{...resolvedProps}
					id={id}
					showHoverPreview={showHoverPreview}
					hoverPreviewOptions={hoverPreviewOptions}
					actionOptions={actionOptions}
					link={url}
					isSelected={isSelected}
					isHovered={isHovered}
					onClick={handleFrameClick}
					testId={testIdWithStatus}
					truncateInline={truncateInline}
				/>
			);
		case 'unauthorized':
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
					truncateInline={truncateInline}
				/>
			);
		case 'forbidden':
			const providerForbidden = extractProvider(cardDetails as JsonLd.Data.BaseData);
			const cardMetadata = details?.meta ?? getForbiddenJsonLd().meta;
			const requestAccessContext = extractRequestAccessContextImproved({
				jsonLd: cardMetadata,
				url,
				product: providerForbidden?.text ?? '',
				createAnalyticsEvent,
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
					showHoverPreview={showHoverPreview}
					truncateInline={truncateInline}
				/>
			);
		case 'not_found':
			const providerNotFound = extractProvider(cardDetails as JsonLd.Data.BaseData);
			return (
				<InlineCardErroredView
					url={url}
					icon={providerNotFound && providerNotFound.icon}
					isSelected={isSelected}
					message="Can't find link"
					onClick={handleFrameClick}
					testId={testIdWithStatus || 'inline-card-not-found-view'}
					showHoverPreview={showHoverPreview}
					truncateInline={truncateInline}
				/>
			);
		case 'fallback':
		case 'errored':
		default:
			return (
				<CardLinkView
					link={url}
					isSelected={isSelected}
					onClick={handleFrameClick}
					testId={testIdWithStatus || 'inline-card-errored-view'}
					truncateInline={truncateInline}
				/>
			);
	}
};
