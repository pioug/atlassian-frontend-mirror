import React, { useEffect, useMemo } from 'react';

import { useSmartLinkContext } from '@atlaskit/link-provider';
import type { CardState } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { InternalActionName, SmartLinkStatus } from '../../constants';
import { FlexibleCardContext } from '../../state/flexible-ui-context';
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
	placeholderData,
	children,
	id,
	onAuthorize,
	onClick,
	onError,
	onResolve,
	origin,
	renderers,
	showHoverPreview,
	hoverPreviewOptions,
	actionOptions,
	testId,
	ui,
	url,
}: FlexibleCardProps & {
	/**
	 * @experimental
	 * This is a new prop that is not part of the public API - DO NOT USE.
	 * If provided, the card will display using the respective object for the first render (particularly useful for SSR),
	 * while still resolving `url` in the background.
	 * Placeholder data should be considered a transient state - in the sense that it will not persisted to the main store -
	 * and it will be replaced by the actual data when the given `url` is resolved.
	 * ANIP-288: Expose this prop to the public API
	 */
	placeholderData?: CardState;
}) => {
	const aiSummaryConfig = useAISummaryConfig();
	const resolve = useResolve();
	const { isPreviewPanelAvailable, openPreviewPanel } = useSmartLinkContext();

	const { fireEvent } = useAnalyticsEvents();

	const { status: cardType, details } = cardState;
	const status = cardType as SmartLinkStatus;

	const shouldUsePlaceholderData =
		PENDING_LINK_STATUSES.includes(status) &&
		placeholderData &&
		fg('platform_initial_data_for_smart_cards');
	// if we have placeholder data it means we can internally use it
	// as resolved data until the actual data comes back as one of the final statuses
	const contextStatus = shouldUsePlaceholderData ? SmartLinkStatus.Resolved : status;
	const context = useMemo(
		() =>
			getContextByStatus({
				aiSummaryConfig,
				appearance,
				fireEvent,
				response: shouldUsePlaceholderData ? placeholderData.details : details,
				id,
				onAuthorize,
				onClick,
				origin,
				renderers,
				resolve,
				actionOptions,
				status: shouldUsePlaceholderData ? contextStatus : status,
				url,
				isPreviewPanelAvailable,
				openPreviewPanel,
			}),
		[
			aiSummaryConfig,
			appearance,
			fireEvent,
			shouldUsePlaceholderData,
			placeholderData?.details,
			details,
			id,
			onAuthorize,
			onClick,
			origin,
			renderers,
			resolve,
			actionOptions,
			contextStatus,
			status,
			url,
			isPreviewPanelAvailable,
			openPreviewPanel,
		],
	);
	const flexibleCardContext = useMemo(
		() => ({
			data: context,
			status: fg('platform_initial_data_for_smart_cards') ? contextStatus : status,
			ui,
		}),
		[context, contextStatus, status, ui],
	);

	const { linkTitle } = context || {};
	const title = linkTitle?.text;

	useEffect(() => {
		switch (status) {
			case SmartLinkStatus.Resolved:
				if (onResolve) {
					onResolve({ title, url });
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
	}, [onError, onResolve, status, title, url]);

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
