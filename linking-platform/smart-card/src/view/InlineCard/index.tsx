import React, { useEffect } from 'react';
import { type InlineCardProps } from './types';
import { getEmptyJsonLd, getForbiddenJsonLd } from '../../utils/jsonld';
import { extractInlineProps } from '../../extractors/inline';
import { type JsonLd } from 'json-ld-types';
import { extractRequestAccessContextImproved } from '../../extractors/common/context/extractAccessContext';
import { CardLinkView } from '../LinkView';
import { InlineCardErroredView } from './ErroredView';
import { InlineCardForbiddenView } from './ForbiddenView';
import { InlineCardResolvedView } from './ResolvedView';
import { InlineCardResolvingView } from './ResolvingView';
import { InlineCardUnauthorizedView } from './UnauthorisedView';
import { extractProvider } from '@atlaskit/link-extractors';
import { useFeatureFlag } from '@atlaskit/link-provider';
import { getExtensionKey } from '../../state/helpers';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { SmartLinkStatus } from '../../constants';

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
			? extractInlineProps(cardDetails as JsonLd.Data.BaseData, renderers)
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
				/>
			);
	}
};
