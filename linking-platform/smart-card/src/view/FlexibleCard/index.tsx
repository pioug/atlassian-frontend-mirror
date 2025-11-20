import React, { useEffect, useMemo } from 'react';

import { useSmartLinkContext } from '@atlaskit/link-provider';
import { fg } from '@atlaskit/platform-feature-flags';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { InternalActionName, SmartLinkStatus } from '../../constants';
import { extractPlaceHolderCardState } from '../../extractors/flexible/extract-placeholder-data';
import { FlexibleCardContext, type FlexibleCardContextType } from '../../state/flexible-ui-context';
import { useAISummaryConfig } from '../../state/hooks/use-ai-summary-config';
import useResolve from '../../state/hooks/use-resolve';

import Container from './components/container';
import { type FlexibleCardProps } from './types';
import { getContextByStatus } from './utils';

const PENDING_LINK_STATUSES = [SmartLinkStatus.Pending, SmartLinkStatus.Resolving];

/**
 * This represents a Flexible Card: a link represented by a card with metadata.
 * This is the container in which all Flexible UI Blocks and Elements exist.
 * Note: TitleBlock is mandatory for a Flexible Card to render.
 * @see Container
 */
const FlexibleCard = ({
	appearance = 'flexible',
	cardState,
	children,
	id,
	onAuthorize,
	onClick,
	onError,
	onResolve,
	origin,
	placeholderData,
	renderers,
	showHoverPreview,
	hoverPreviewOptions,
	actionOptions,
	testId,
	ui,
	url,
}: FlexibleCardProps): React.JSX.Element => {
	const aiSummaryConfig = useAISummaryConfig();
	const resolve = useResolve();
	const { isPreviewPanelAvailable, openPreviewPanel } = useSmartLinkContext();

	const { fireEvent } = useAnalyticsEvents();

	const { status: cardType, details } = cardState;
	const status = cardType as SmartLinkStatus;

	// if we have placeholder state it means we can internally use it
	// as temporary resolved data until the actual data comes back as one of the final statuses
	const placeholderCardState = useMemo(
		() =>
			PENDING_LINK_STATUSES.includes(status) &&
			placeholderData &&
			fg('platform_initial_data_for_smart_cards')
				? extractPlaceHolderCardState(placeholderData)
				: undefined,
		[placeholderData, status],
	);
	const placeHolderStatus = placeholderCardState?.status as SmartLinkStatus | undefined;

	const context = useMemo(
		() =>
			getContextByStatus({
				aiSummaryConfig,
				appearance,
				fireEvent,
				response: placeholderCardState ? placeholderCardState.details : details,
				id,
				onAuthorize,
				onClick,
				origin,
				renderers,
				resolve,
				actionOptions,
				status: placeholderCardState ? placeHolderStatus : status,
				url,
				isPreviewPanelAvailable,
				openPreviewPanel,
			}),
		[
			aiSummaryConfig,
			appearance,
			actionOptions,
			details,
			id,
			isPreviewPanelAvailable,
			onAuthorize,
			onClick,
			openPreviewPanel,
			origin,
			placeholderCardState,
			placeHolderStatus,
			renderers,
			resolve,
			status,
			url,
			fireEvent,
		],
	);

	const flexibleCardContext = useMemo<FlexibleCardContextType>(
		() => ({
			data: context,
			status: fg('platform_initial_data_for_smart_cards') ? (placeHolderStatus ?? status) : status,
			ui,
		}),
		[context, placeHolderStatus, status, ui],
	);

	const { linkTitle } = context || {};
	const title = linkTitle?.text;

	useEffect(() => {
		switch (status) {
			case SmartLinkStatus.Resolved:
				if (onResolve) {
					onResolve({
						title,
						url,
						...(fg('expose-product-details-from-smart-card') && {
							extensionKey: details?.meta?.key,
						}),
					});
				}
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
	}, [onError, onResolve, status, title, url, details?.meta?.key]);

	const retry = flexibleCardContext.data?.actions?.[InternalActionName.UnresolvedAction];

	return (
		<FlexibleCardContext.Provider value={flexibleCardContext}>
			<Container
				testId={testId}
				{...ui}
				onClick={onClick}
				showHoverPreview={showHoverPreview}
				hoverPreviewOptions={hoverPreviewOptions}
				actionOptions={actionOptions}
				status={status}
				retry={retry}
			>
				{children}
			</Container>
		</FlexibleCardContext.Provider>
	);
};

export default FlexibleCard;
