import React, { useCallback, useEffect, useMemo } from 'react';

import { useSmartLinkContext } from '@atlaskit/link-provider';
import { fg } from '@atlaskit/platform-feature-flags';
import UFOHoldLoad from '@atlaskit/react-ufo/load-hold';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { InternalActionName, SmartLinkStatus } from '../../constants';
import { extractPlaceHolderCardState } from '../../extractors/flexible/extract-placeholder-data';
import { FlexibleCardContext, type FlexibleCardContextType } from '../../state/flexible-ui-context';
import { useAISummaryConfig } from '../../state/hooks/use-ai-summary-config';
import useResolve from '../../state/hooks/use-resolve';
import useRovoConfig from '../../state/hooks/use-rovo-config';
import { useSmartLinkCrossProductUrlWrapperGated } from '../../state/hooks/use-smart-link-cross-product-url-wrapper';

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
	onAuxClick,
	onContextMenu,
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
	title: ssrTitle,
}: FlexibleCardProps): React.JSX.Element => {
	const aiSummaryConfig = useAISummaryConfig();
	const resolve = useResolve();
	const { isPreviewPanelAvailable, openPreviewPanel, product } = useSmartLinkContext();

	const rovoConfig = useRovoConfig();

	const { fireEvent } = useAnalyticsEvents();

	const { status: cardType, details } = cardState;
	const status = cardType as SmartLinkStatus;

	const appendCrossProductAnalyticsParams = useSmartLinkCrossProductUrlWrapperGated({ details });
	const transformUrlCallback = useCallback(
		(destinationUrl = url) => appendCrossProductAnalyticsParams(destinationUrl),
		[appendCrossProductAnalyticsParams, url],
	);
	const transformUrl = fg('platform_smartlink_xpc_url_wrapping') ? transformUrlCallback : undefined;

	// if we have placeholder state it means we can internally use it
	// as temporary resolved data until the actual data comes back as one of the final statuses
	const placeholderCardState = useMemo(
		() =>
			PENDING_LINK_STATUSES.includes(status) &&
			placeholderData &&
			extractPlaceHolderCardState(placeholderData),
		[placeholderData, status],
	);
	const placeHolderStatus = placeholderCardState
		? (placeholderCardState.status as SmartLinkStatus)
		: undefined;

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
				onAuxClick,
				onContextMenu,
				origin,
				renderers,
				resolve,
				product,
				rovoConfig,
				actionOptions,
				status: placeholderCardState ? placeHolderStatus : status,
				url,
				isPreviewPanelAvailable,
				openPreviewPanel,
				transformUrl,
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
			onAuxClick,
			onContextMenu,
			openPreviewPanel,
			origin,
			placeholderCardState,
			placeHolderStatus,
			product,
			renderers,
			resolve,
			rovoConfig,
			status,
			transformUrl,
			url,
			fireEvent,
		],
	);

	const flexibleCardContext = useMemo<FlexibleCardContextType>(
		() => ({
			data: context,
			status: placeHolderStatus ?? status,
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
						extensionKey: details?.meta?.key,
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
			{PENDING_LINK_STATUSES.includes(status) && !Boolean(placeholderCardState) && (
				<UFOHoldLoad name="smart-card-flexible-card" />
			)}
			<Container
				testId={testId}
				{...ui}
				title={ssrTitle}
				onClick={onClick}
				onAuxClick={onAuxClick}
				onContextMenu={onContextMenu}
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
