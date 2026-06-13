import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import {
	AnalyticsContext,
	useAnalyticsEvents as useAnalyticsEventsNext,
} from '@atlaskit/analytics-next';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	componentWithCondition,
	functionUnionWithCondition,
} from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import { CardDisplay, SmartLinkPosition, SmartLinkSize } from '../../../constants';
import extractRovoChatAction from '../../../extractors/flexible/actions/extract-rovo-chat-action';
import { getClickUrl, getDefinitionId, getExtensionKey, getServices } from '../../../state/helpers';
import useRovoConfig from '../../../state/hooks/use-rovo-config';
import { useSmartLinkCrossProductUrlWrapperGated } from '../../../state/hooks/use-smart-link-cross-product-url-wrapper';
import { useSmartCardState } from '../../../state/store';
import { type CardState } from '../../../state/types';
import { isSpecialEvent } from '../../../utils';
import { getIsAISummaryEnabled } from '../../../utils/ai-summary';
import { fireLinkClickedEvent } from '../../../utils/analytics/click';
import { getAnchorAttributesFromEvent, updateAnchorHref } from '../../../utils/click-helpers';
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
import RovoUnauthorisedView from './views/unauthorised/RovoUnauthorisedView';

export const hoverCardClassName = 'smart-links-hover-preview';

const useIsResolvedView = ({
	cardState,
	hoverPreviewOptions,
}: Pick<HoverCardContentProps, 'cardState' | 'hoverPreviewOptions'>): boolean => {
	return !hoverPreviewOptions?.render?.() && cardState.status === 'resolved';
};

const useServices = ({ url }: Pick<HoverCardContentProps, 'url'>) => {
	const linkState = useSmartCardState(url);
	const services = getServices(linkState.details);
	return services;
};

const useIsUnauthorisedView = ({
	cardState,
	url,
	hoverPreviewOptions,
}: Pick<HoverCardContentProps, 'cardState' | 'url' | 'hoverPreviewOptions'>): boolean => {
	const services = useServices({ url });
	return (
		!hoverPreviewOptions?.render?.() &&
		cardState.status === 'unauthorized' &&
		Boolean(services?.length)
	);
};

const useIsShowPreauthBetterHovercard = (
	props: Parameters<typeof useIsUnauthorisedView>[0],
): boolean => {
	const { rovoOptions: rovoConfig } = useRovoConfig();
	return Boolean(
		useIsUnauthorisedView(props) &&
		rovoConfig?.isRovoEnabled &&
		expValEquals('platform_sl_3p_preauth_better_hovercard', 'isEnabled', true),
	);
};

const HoverCardContent = ({
	id = '',
	cardState,
	onActionClick,
	onResolve,
	renderers,
	url,
	onMouseEnter,
	onMouseLeave,
	onDismiss,
	actionOptions,
	hoverPreviewOptions,
	showRovoResolvedView,
}: HoverCardContentProps): React.JSX.Element | null => {
	const { createAnalyticsEvent } = useAnalyticsEventsNext();
	const { fireEvent } = useAnalyticsEvents();
	const extensionKey = useMemo(() => getExtensionKey(cardState.details), [cardState.details]);
	const linkState = useSmartCardState(url);
	const linkStatus = linkState.status ?? 'pending';
	const definitionId = useMemo(() => getDefinitionId(cardState.details), [cardState.details]);

	const { isAdminHubAIEnabled, product } = useSmartLinkContext();
	const isAISummaryEnabled = getIsAISummaryEnabled(isAdminHubAIEnabled, cardState.details);

	const services = getServices(linkState.details);

	const appendCrossProductAnalyticsParams = useSmartLinkCrossProductUrlWrapperGated({
		details: linkState.details,
	});

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

	const getDestinationUrl = useCallback(() => {
		// FIXME: destinationUrl should be rendered in the DOM anchor href instead of derived at click time
		const preferredUrl = getClickUrl(url, linkState.details) ?? url;
		return appendCrossProductAnalyticsParams(preferredUrl) ?? preferredUrl;
	}, [appendCrossProductAnalyticsParams, linkState.details, url]);

	// Middle-click handler to trigger fire3PClickEvent on middle-clicks.
	// Scope is limited to 3P click analytics to keep the experiment focused.
	const onAuxClick = useCallback(
		(event: React.MouseEvent) => {
			const destinationUrl = getDestinationUrl();
			updateAnchorHref(event, destinationUrl);
		},
		[getDestinationUrl],
	);

	// Right-click handler to trigger fire3PClickEvent on right-clicks.
	// Scope is limited to 3P click analytics to keep the experiment focused.
	const onContextMenu = useCallback(
		(event: React.MouseEvent) => {
			const destinationUrl = getDestinationUrl();
			updateAnchorHref(event, destinationUrl);
		},
		[getDestinationUrl],
	);

	const onClick = useCallback(
		(event: React.MouseEvent) => {
			if (fg('platform_smartlink_xpc_url_wrapping')) {
				// Prevent the anchor's native navigation so we can open the destination URL
				// with cross-product analytics query parameters appended.
				// The cross-product params are client-only and cannot be rendered
				// server-side. Falls back to the original `url` prop if the event target is
				// not an anchor element.
				event.preventDefault();

				const { target } = getAnchorAttributesFromEvent(event);
				const destinationUrl = getDestinationUrl();
				updateAnchorHref(event, destinationUrl);

				window.open(destinationUrl, target);
			}

			const isModifierKeyPressed = isSpecialEvent(event);
			fireEvent('ui.smartLink.clicked.titleGoToLink', {
				id,
				display: CardDisplay.HoverCardPreview,
				isModifierKeyPressed,
				definitionId: definitionId ?? null,
			});
			fireLinkClickedEvent(createAnalyticsEvent)(event);
		},
		[createAnalyticsEvent, getDestinationUrl, id, fireEvent, definitionId],
	);

	const data = cardState.details?.data as JsonLd.Data.BaseData;
	const { subtitle } = getMetadata(extensionKey, data);

	const titleMaxLines = subtitle && subtitle.length > 0 ? 1 : 2;

	const titleBlockProps: TitleBlockProps = {
		maxLines: titleMaxLines,
		size: SmartLinkSize.Large,
		position: SmartLinkPosition.Center,
		subtitle: subtitle,
		anchorTarget: product === 'ATLAS' ? '_self' : undefined,
	};

	const uiOptions = flexibleUiOptions;
	uiOptions.enableSnippetRenderer = true;

	const flexibleCardProps: FlexibleCardProps = {
		appearance: CardDisplay.HoverCardPreview,
		cardState: cardState,
		onClick: onClick,
		...(fg('platform_smartlink_xpc_url_wrapping') ? { onAuxClick, onContextMenu } : undefined),
		onResolve: onResolve,
		origin: 'smartLinkPreviewHoverCard',
		renderers: renderers,
		actionOptions,
		ui: uiOptions,
		url: url,
		children: null,
	};

	const onClickStopPropagation = useCallback((e: any) => e.stopPropagation(), []);

	const useIsResolvedViewGated = functionUnionWithCondition(
		() => fg('platform_sl_3p_preauth_better_hovercard_killswitch'),
		useIsResolvedView,
		() => undefined,
	);

	const useIsUnauthorisedViewGated = functionUnionWithCondition(
		() => fg('platform_sl_3p_preauth_better_hovercard_killswitch'),
		useIsUnauthorisedView,
		() => undefined,
	);

	const useIsShowPreauthBetterHovercardGated = functionUnionWithCondition(
		() => fg('platform_sl_3p_preauth_better_hovercard_killswitch'),
		useIsShowPreauthBetterHovercard,
		() => undefined,
	);

	const isResolved = useIsResolvedViewGated({ cardState, hoverPreviewOptions });
	const isUnauthorised = useIsUnauthorisedViewGated({ cardState, url, hoverPreviewOptions });
	const showPreauthBetterHovercard = useIsShowPreauthBetterHovercardGated({
		cardState,
		url,
		hoverPreviewOptions,
	});

	if (fg('platform_sl_3p_preauth_better_hovercard_killswitch')) {
		const cardView = ((): React.ReactNode | null => {
			const overrideView = hoverPreviewOptions?.render?.();
			if (overrideView) {
				return overrideView;
			}

			if (cardState.status === 'errored') {
				return null;
			}

			if (cardState.status === 'resolving' || cardState.metadataStatus === 'pending') {
				return (
					<HoverCardLoadingView
						flexibleCardProps={flexibleCardProps}
						titleBlockProps={titleBlockProps}
					/>
				);
			}

			if (isUnauthorised) {
				if (showPreauthBetterHovercard) {
					return (
						<RovoUnauthorisedView
							extensionKey={extensionKey}
							id={id}
							flexibleCardProps={flexibleCardProps}
							onDismiss={onDismiss}
							url={url}
						/>
					);
				}
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

			if (isResolved) {
				return (
					<HoverCardResolvedView
						{...(fg('platform_sl_3p_auth_rovo_action_kill_switch')
							? { actionOptions, showRovoResolvedView }
							: undefined)}
						cardState={cardState}
						extensionKey={extensionKey}
						flexibleCardProps={flexibleCardProps}
						isAISummaryEnabled={isAISummaryEnabled}
						onActionClick={onActionClick}
						titleBlockProps={titleBlockProps}
					/>
				);
			}
			return null;
		})();

		return cardView ? (
			<ContentContainer
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onClick={onClickStopPropagation}
				widthAppearance={showPreauthBetterHovercard ? 'slim' : undefined}
				isAIEnabled={isAISummaryEnabled}
				url={url}
			>
				{cardView}
			</ContentContainer>
		) : null;
	} else {
		const getCardView = (cardState: CardState) => {
			const overrideView = hoverPreviewOptions?.render?.();
			if (overrideView) {
				return overrideView;
			}

			if (cardState.status === 'errored') {
				return null;
			}

			if (cardState.status === 'resolving' || cardState.metadataStatus === 'pending') {
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
						{...(fg('platform_sl_3p_auth_rovo_action_kill_switch')
							? { actionOptions, showRovoResolvedView }
							: undefined)}
						cardState={cardState}
						extensionKey={extensionKey}
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
	}
};

const HoverCardContentWithViewVariant = (props: HoverCardContentProps): React.JSX.Element => {
	const { cardState, actionOptions } = props;
	const rovoConfig = useRovoConfig();
	const isResolved = useIsResolvedView(props);
	const showPreauthBetterHovercard = useIsShowPreauthBetterHovercard(props);

	const showRovoResolvedView = useMemo(
		() =>
			isResolved &&
			cardState.details &&
			extractRovoChatAction({
				response: cardState.details,
				rovoConfig,
				actionOptions,
			}) !== undefined,
		[actionOptions, cardState.details, rovoConfig, isResolved],
	);

	const data = useMemo(() => {
		let viewVariant = 'default';
		if (
			showRovoResolvedView &&
			expValEqualsNoExposure('platform_sl_3p_auth_rovo_action', 'isEnabled', true)
		) {
			viewVariant = 'rovo-resolved-view';
		} else if (showPreauthBetterHovercard) {
			viewVariant = 'rovo-unauthorised-view';
		}
		return {
			attributes: { viewVariant },
		};
	}, [showRovoResolvedView, showPreauthBetterHovercard]);

	return (
		<AnalyticsContext data={data}>
			<HoverCardContent {...props} showRovoResolvedView={showRovoResolvedView} />
		</AnalyticsContext>
	);
};

const _default_1: React.FC<HoverCardContentProps> = componentWithCondition(
	() => {
		// We need to read both of them to sutisfy some of the tests that expect both to be checked.
		const flagA = fg('platform_sl_3p_preauth_better_hovercard_killswitch');
		const flagB = fg('platform_sl_3p_auth_rovo_action_kill_switch');
		return flagA || flagB;
	},
	HoverCardContentWithViewVariant,
	HoverCardContent,
);
export default _default_1;
