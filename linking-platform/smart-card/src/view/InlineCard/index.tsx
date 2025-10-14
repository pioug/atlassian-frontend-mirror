import React, { type PropsWithChildren, useEffect } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors';
// TODO: Package Owner - please fix:
// eslint-disable-next-line import/no-extraneous-dependencies
import UFOHoldLoad from '@atlaskit/react-ufo/load-hold';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { SmartLinkStatus } from '../../constants';
import { extractRequestAccessContextImproved } from '../../extractors/common/context/extractAccessContext';
import { extractInlineProps } from '../../extractors/inline';
import { getExtensionKey } from '../../state/helpers';
import { getForbiddenJsonLd } from '../../utils/jsonld';
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

const UFOLoadHoldWrapper = ({ children }: PropsWithChildren) => (
	<>
		<UFOHoldLoad name="smart-card-inline-card" />
		{children}
	</>
);

export const InlineCard = ({
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
	actionOptions,
	removeTextHighlightingFromTitle,
	resolvingPlaceholder,
	truncateInline,
	hideIconLoadingSkeleton,
}: InlineCardProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const { status, details } = cardState;
	const extensionKey = getExtensionKey(details);
	const testIdWithStatus = testId ? `${testId}-${status}-view` : undefined;

	const resolvedProps =
		status === SmartLinkStatus.Resolved
			? extractInlineProps(details, renderers, removeTextHighlightingFromTitle, false)
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
				<UFOLoadHoldWrapper>
					<InlineCardResolvingView
						url={url}
						isSelected={isSelected}
						onClick={handleFrameClick}
						testId={testIdWithStatus}
						inlinePreloaderStyle={inlinePreloaderStyle}
						resolvingPlaceholder={resolvingPlaceholder}
						truncateInline={truncateInline}
					/>
				</UFOLoadHoldWrapper>
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
					hideIconLoadingSkeleton={
						expValEquals('platform_editor_smart_card_otp', 'isEnabled', true) &&
						hideIconLoadingSkeleton
					}
				/>
			);
		case 'unauthorized':
			const provider = extractSmartLinkProvider(details);
			return (
				<InlineCardUnauthorizedView
					icon={provider && provider.icon}
					context={provider && provider.text}
					url={url}
					isSelected={isSelected}
					onClick={handleFrameClick}
					onAuthorise={handleAuthorize}
					testId={testIdWithStatus}
					showHoverPreview={showHoverPreview}
					id={id}
					extensionKey={extensionKey}
					truncateInline={truncateInline}
				/>
			);
		case 'forbidden':
			const providerForbidden = extractSmartLinkProvider(details);
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
			const providerNotFound = extractSmartLinkProvider(details);
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
