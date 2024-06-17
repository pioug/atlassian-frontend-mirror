/** @jsx jsx */
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import { type CardState } from '../../../state/types';
import { type JsonLd } from 'json-ld-types';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { ActionName, CardDisplay, SmartLinkPosition, SmartLinkSize } from '../../../constants';
import { useSmartLinkAnalytics } from '../../../state/analytics';
import { getExtensionKey, getServices } from '../../../state/helpers';
import { isSpecialEvent } from '../../../utils';
import { type TitleBlockProps } from '../../FlexibleCard/components/blocks/title-block/types';
import { type ActionItem, type CustomActionItem } from '../../FlexibleCard/components/blocks/types';
import { type FlexibleCardProps } from '../../FlexibleCard/types';
import { flexibleUiOptions, titleBlockCss } from '../styled';
import { type HoverCardContentProps } from '../types';
import { getMetadata } from '../utils';
import HoverCardLoadingView from './views/resolving';
import HoverCardUnauthorisedView from './views/unauthorised';
import HoverCardResolvedView from './views/resolved';
import HoverCardRedesignedResolvedView from './views/resolved/redesign';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '../../../messages';
import { fireLinkClickedEvent } from '../../../utils/analytics/click';
import { useSmartCardState } from '../../../state/store';

import HoverCardForbiddenView from './views/forbidden';
import ContentContainer from './ContentContainer';
import { getIsAISummaryEnabled } from '../../../utils/ai-summary';

export const hoverCardClassName = 'smart-links-hover-preview';

export const getCopyAction = (url: string): ActionItem =>
	({
		name: ActionName.CustomAction,
		icon: <CopyIcon label="copy url" size="medium" />,
		iconPosition: 'before',
		onClick: async () => await navigator.clipboard.writeText(url),
		tooltipMessage: <FormattedMessage {...messages.copy_url_to_clipboard} />,
		testId: 'hover-card-copy-button',
	}) as CustomActionItem;

const HoverCardContent = ({
	id = '',
	analytics: _analytics,
	cardActions = [],
	cardState,
	onActionClick,
	onResolve,
	renderers,
	url,
	onMouseEnter,
	onMouseLeave,
	actionOptions,
}: HoverCardContentProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const defaultAnalytics = useSmartLinkAnalytics(url, undefined, id);
	const analytics = _analytics ?? defaultAnalytics;
	const extensionKey = useMemo(() => getExtensionKey(cardState.details), [cardState.details]);
	const linkState = useSmartCardState(url);
	const linkStatus = linkState.status ?? 'pending';

	const { isAdminHubAIEnabled } = useSmartLinkContext();
	const isAISummaryEnabled = getIsAISummaryEnabled(isAdminHubAIEnabled, cardState.details);

	const services = getServices(linkState.details);

	const statusRef = useRef(linkStatus);
	const analyticsRef = useRef(analytics);

	useEffect(() => {
		/**
		 * Must access current analytics object value via ref because its not stable
		 * and it can trigger useEffect to re-run below
		 */
		if (analyticsRef.current !== analytics) {
			analyticsRef.current = analytics;
		}
		if (statusRef.current !== linkStatus) {
			statusRef.current = linkStatus;
		}
	}, [analytics, linkStatus]);

	useEffect(() => {
		const previewDisplay = 'card';
		const previewInvokeMethod = 'mouse_hover';
		const cardOpenTime = Date.now();

		analyticsRef.current.ui.hoverCardViewedEvent({
			previewDisplay,
			previewInvokeMethod,
			status: statusRef.current,
		});

		return () => {
			const hoverTime = Date.now() - cardOpenTime;

			analyticsRef.current.ui.hoverCardDismissedEvent({
				previewDisplay,
				previewInvokeMethod,
				hoverTime,
				status: statusRef.current,
			});
		};
	}, []);

	const onClick = useCallback(
		(event: React.MouseEvent) => {
			const isModifierKeyPressed = isSpecialEvent(event);
			analytics.ui.cardClickedEvent({
				id,
				display: CardDisplay.HoverCardPreview,
				status: cardState.status,
				isModifierKeyPressed,
				actionSubjectId: 'titleGoToLink',
			});

			fireLinkClickedEvent(createAnalyticsEvent)(event);
		},
		[createAnalyticsEvent, cardState.status, analytics.ui, id],
	);

	const titleActions = useMemo(() => [getCopyAction(url)], [url]);

	const data = cardState.details?.data as JsonLd.Data.BaseData;
	const { subtitle } = getMetadata(extensionKey, data);

	const titleMaxLines = subtitle && subtitle.length > 0 ? 1 : 2;

	const titleBlockProps: TitleBlockProps = {
		actions: getBooleanFF('platform.linking-platform.smart-card.hover-card-action-redesign')
			? undefined
			: titleActions,
		maxLines: titleMaxLines,
		overrideCss: titleBlockCss,
		size: SmartLinkSize.Large,
		position: SmartLinkPosition.Center,
		subtitle: subtitle,
	};

	const flexibleCardProps: FlexibleCardProps = {
		appearance: CardDisplay.HoverCardPreview,
		cardState: cardState,
		onClick: onClick,
		onResolve: onResolve,
		renderers: renderers,
		actionOptions,
		ui: flexibleUiOptions,
		url: url,
		children: null,
		analytics,
	};

	const onClickStopPropagation = useCallback((e: any) => e.stopPropagation(), []);

	const getCardView = (cardState: CardState) => {
		if (cardState.metadataStatus === 'pending') {
			return (
				<HoverCardLoadingView
					flexibleCardProps={flexibleCardProps}
					titleBlockProps={titleBlockProps}
				/>
			);
		}

		if (cardState.status === 'unauthorized' && services?.length) {
			return (
				<HoverCardUnauthorisedView
					analytics={analytics}
					extensionKey={extensionKey}
					id={id}
					flexibleCardProps={flexibleCardProps}
					url={url}
				/>
			);
		}

		if (cardState.status === 'forbidden' || cardState.status === 'not_found') {
			return <HoverCardForbiddenView flexibleCardProps={flexibleCardProps} />;
		}

		if (cardState.status === 'resolved') {
			if (getBooleanFF('platform.linking-platform.smart-card.hover-card-action-redesign')) {
				return (
					<HoverCardRedesignedResolvedView
						analytics={analytics}
						cardState={cardState}
						extensionKey={extensionKey}
						flexibleCardProps={flexibleCardProps}
						isAISummaryEnabled={isAISummaryEnabled}
						onActionClick={onActionClick}
						titleBlockProps={titleBlockProps}
						url={url}
					/>
				);
			}

			return (
				<HoverCardResolvedView
					id={id}
					url={url}
					extensionKey={extensionKey}
					analytics={analytics}
					cardActions={cardActions}
					cardState={cardState}
					flexibleCardProps={flexibleCardProps}
					isAISummaryEnabled={isAISummaryEnabled}
					onActionClick={onActionClick}
					titleBlockProps={titleBlockProps}
				/>
			);
		}
		return null;
	};
	const cardView = getCardView(cardState);
	return cardView ? (
		<ContentContainer
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={onClickStopPropagation}
			isAIEnabled={isAISummaryEnabled}
			url={url}
		>
			{cardView}
		</ContentContainer>
	) : null;
};
export default HoverCardContent;
