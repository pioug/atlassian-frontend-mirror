import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/analytics-next';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { useSmartLinkContext } from '@atlaskit/link-provider';

import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import { CardDisplay, SmartLinkPosition, SmartLinkSize } from '../../../constants';
import { getDefinitionId, getExtensionKey, getServices } from '../../../state/helpers';
import { useSmartCardState } from '../../../state/store';
import { type CardState } from '../../../state/types';
import { isSpecialEvent } from '../../../utils';
import { getIsAISummaryEnabled } from '../../../utils/ai-summary';
import { fireLinkClickedEvent } from '../../../utils/analytics/click';
import { type TitleBlockProps } from '../../FlexibleCard/components/blocks/title-block/types';
import { type FlexibleCardProps } from '../../FlexibleCard/types';
import { flexibleUiOptions } from '../styled';
import { type HoverCardContentProps } from '../types';
import { getMetadata } from '../utils';

import ContentContainer from './ContentContainer';
import HoverCardForbiddenView from './views/forbidden';
import HoverCardResolvedView from './views/resolved';
import HoverCardLoadingView from './views/resolving';
import HoverCardUnauthorisedView from './views/unauthorised';

export const hoverCardClassName = 'smart-links-hover-preview';

const HoverCardContent = ({
	id = '',
	cardState,
	onActionClick,
	onResolve,
	renderers,
	url,
	onMouseEnter,
	onMouseLeave,
	actionOptions,
}: HoverCardContentProps) => {
	const { createAnalyticsEvent } = useAnalyticsEventsNext();
	const { fireEvent } = useAnalyticsEvents();
	const extensionKey = useMemo(() => getExtensionKey(cardState.details), [cardState.details]);
	const linkState = useSmartCardState(url);
	const linkStatus = linkState.status ?? 'pending';
	const definitionId = useMemo(() => getDefinitionId(cardState.details), [cardState.details]);

	const { isAdminHubAIEnabled } = useSmartLinkContext();
	const isAISummaryEnabled = getIsAISummaryEnabled(isAdminHubAIEnabled, cardState.details);

	const services = getServices(linkState.details);

	const statusRef = useRef(linkStatus);
	const fireEventRef = useRef(fireEvent);
	const definitionIdRef = useRef(definitionId);

	useEffect(() => {
		/**
		 * Must access object value via ref because its not stable
		 * and it can trigger useEffect to re-run below
		 */
		if (statusRef.current !== linkStatus) {
			statusRef.current = linkStatus;
		}
		if (fireEventRef.current !== fireEvent) {
			fireEventRef.current = fireEvent;
		}
		if (definitionIdRef.current !== definitionId) {
			definitionIdRef.current = definitionId;
		}
	}, [linkStatus, fireEvent, definitionId]);

	useEffect(() => {
		const previewDisplay = 'card';
		const previewInvokeMethod = 'mouse_hover';
		const cardOpenTime = Date.now();
		const fireEventCurrent = fireEventRef.current;

		fireEventCurrent('ui.hoverCard.viewed', {
			previewDisplay,
			previewInvokeMethod,
			definitionId: definitionIdRef.current ?? null,
		});

		return () => {
			const hoverTime = Date.now() - cardOpenTime;
			fireEventCurrent('ui.hoverCard.dismissed', {
				previewDisplay,
				previewInvokeMethod,
				hoverTime,
				definitionId: definitionIdRef.current ?? null,
			});
		};
	}, []);

	const onClick = useCallback(
		(event: React.MouseEvent) => {
			const isModifierKeyPressed = isSpecialEvent(event);
			fireEvent('ui.smartLink.clicked.titleGoToLink', {
				id,
				display: CardDisplay.HoverCardPreview,
				isModifierKeyPressed,
				definitionId: definitionId ?? null,
			});
			fireLinkClickedEvent(createAnalyticsEvent)(event);
		},
		[createAnalyticsEvent, id, fireEvent, definitionId],
	);

	const data = cardState.details?.data as JsonLd.Data.BaseData;
	const { subtitle } = getMetadata(extensionKey, data);

	const titleMaxLines = subtitle && subtitle.length > 0 ? 1 : 2;

	const titleBlockProps: TitleBlockProps = {
		maxLines: titleMaxLines,
		size: SmartLinkSize.Large,
		position: SmartLinkPosition.Center,
		subtitle: subtitle,
	};

	const uiOptions = flexibleUiOptions;
	uiOptions.enableSnippetRenderer = true;

	const flexibleCardProps: FlexibleCardProps = {
		appearance: CardDisplay.HoverCardPreview,
		cardState: cardState,
		onClick: onClick,
		onResolve: onResolve,
		origin: 'smartLinkPreviewHoverCard',
		renderers: renderers,
		actionOptions,
		ui: uiOptions,
		url: url,
		children: null,
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
			return (
				<HoverCardResolvedView
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
