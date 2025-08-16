import React, { type MouseEvent, useCallback, useEffect, useMemo } from 'react';

import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { CardDisplay } from '../../constants';
import { type InvokeClientOpts, type InvokeServerOpts } from '../../model/invoke-opts';
import { useSmartLink } from '../../state';
import { succeedUfoExperience } from '../../state/analytics';
import {
	getClickUrl,
	getDefinitionId,
	getExtensionKey,
	getFirstPartyIdentifier,
	getObjectAri,
	getObjectIconUrl,
	getObjectName,
	getResourceType,
	getServices,
	getThirdPartyARI,
	isFinalState,
} from '../../state/helpers';
import { SmartLinkModalProvider } from '../../state/modal';
import { isSpecialClick, isSpecialEvent, isSpecialKey } from '../../utils';
import { combineActionOptions } from '../../utils/actions/combine-action-options';
import { fireLinkClickedEvent } from '../../utils/analytics/click';
import { SmartLinkAnalyticsContext } from '../../utils/analytics/SmartLinkAnalyticsContext';
import { isFlexibleUiCard } from '../../utils/flexible';
import * as measure from '../../utils/performance';
import { BlockCard } from '../BlockCard';
import { EmbedCard } from '../EmbedCard';
import FlexibleCard from '../FlexibleCard';
import { InlineCard } from '../InlineCard';

import { type CardWithUrlContentProps } from './types';

const thirdPartyARIPrefix = 'ari:third-party';

function Component({
	id,
	url,
	isSelected,
	isHovered,
	frameStyle,
	platform,
	onClick,
	appearance,
	onResolve,
	onError,
	testId,
	actionOptions: actionOptionsProp,
	inheritDimensions,
	embedIframeRef,
	embedIframeUrlType,
	inlinePreloaderStyle,
	ui,
	children,
	showHoverPreview,
	hoverPreviewOptions,
	removeTextHighlightingFromTitle,
	resolvingPlaceholder,
	truncateInline,
	CompetitorPrompt,
	hideIconLoadingSkeleton,
}: CardWithUrlContentProps) {
	const { createAnalyticsEvent } = useAnalyticsEventsNext();
	const { fireEvent } = useAnalyticsEvents();

	// Get state, actions for this card.
	const { state, actions, config, renderers, error, isPreviewPanelAvailable, openPreviewPanel } =
		useSmartLink(id, url);
	const ari = getObjectAri(state.details);
	const name = getObjectName(state.details);
	const definitionId = getDefinitionId(state.details);
	const extensionKey = getExtensionKey(state.details);
	const resourceType = getResourceType(state.details);
	const services = getServices(state.details);
	const thirdPartyARI = getThirdPartyARI(state.details);
	const firstPartyIdentifier = getFirstPartyIdentifier();

	let isFlexibleUi = useMemo(() => isFlexibleUiCard(children, ui), [children, ui]);

	const actionOptions = combineActionOptions({
		actionOptions: actionOptionsProp,
		platform,
	});

	// Setup UI handlers.
	const handleClickWrapper = useCallback(
		(event: MouseEvent) => {
			const isModifierKeyPressed = isSpecialKey(event) || isSpecialClick(event);

			fireEvent('ui.smartLink.clicked', {
				id,
				display: isFlexibleUi ? CardDisplay.Flexible : appearance,
				definitionId: definitionId ?? null,
				isModifierKeyPressed,
			});

			if (fg('platform_smartlink_3pclick_analytics')) {
				if (thirdPartyARI && thirdPartyARI.startsWith(thirdPartyARIPrefix)) {
					const clickURL = getClickUrl(url, state.details);
					if (clickURL === url) {
						// For questions or concerns about this event,
						// please reach out to the 3P Workflows Team via Slack in #help-3p-connector-workflow
						const smartlinkClickAnalyticsEvent = createAnalyticsEvent({
							action: 'clicked',
							actionSubject: 'smartLink',
							actionSubjectId: 'smartlinkClickAnalyticsWorkflows',
							eventType: 'screen',
							attributes: {
								eventName: 'smartLinkClickAnalyticsThirdPartyWorkflows',
								firstPartyIdentifier: firstPartyIdentifier,
								clickedAt: Date.now().toString(),
							},
							nonPrivacySafeAttributes: {
								thirdPartyARI: thirdPartyARI,
							},
						});
						smartlinkClickAnalyticsEvent.fire('media');
					}
				}
			}

			// If preview panel is available and the user clicked on the link,
			// delegate the click to the preview panel handler
			if (
				!isModifierKeyPressed &&
				ari &&
				name &&
				openPreviewPanel &&
				isPreviewPanelAvailable?.({ ari }) &&
				!fg('platform_editor_preview_panel_linking')
			) {
				event.preventDefault();
				event.stopPropagation();

				openPreviewPanel({
					url,
					ari,
					name,
					iconUrl: getObjectIconUrl(state.details),
				});

				fireLinkClickedEvent(createAnalyticsEvent)(event, {
					attributes: {
						clickOutcome: 'previewPanel',
					},
				});
			} else if (!onClick && !isFlexibleUi) {
				const clickUrl = getClickUrl(url, state.details);

				// Ctrl+left click on mac typically doesn't trigger onClick
				// The event could have potentially had `e.preventDefault()` called on it by now
				// event by smart card internally
				// If it has been called then only then can `isSpecialEvent` be true.
				const target = isSpecialEvent(event) ? '_blank' : '_self';

				window.open(clickUrl, target);

				fireLinkClickedEvent(createAnalyticsEvent)(event, {
					attributes: {
						clickOutcome: target === '_blank' ? 'clickThroughNewTabOrWindow' : 'clickThrough',
					},
				});
			} else {
				if (onClick) {
					onClick(event);
				}
				fireLinkClickedEvent(createAnalyticsEvent)(event);
			}
		},
		[
			fireEvent,
			id,
			isFlexibleUi,
			appearance,
			definitionId,
			onClick,
			url,
			state.details,
			ari,
			name,
			isPreviewPanelAvailable,
			openPreviewPanel,
			createAnalyticsEvent,
			thirdPartyARI,
			firstPartyIdentifier,
		],
	);
	const handleAuthorize = useCallback(() => actions.authorize(appearance), [actions, appearance]);
	const handleRetry = useCallback(() => {
		actions.reload();
	}, [actions]);
	const handleInvoke = useCallback(
		(opts: InvokeClientOpts | InvokeServerOpts) => actions.invoke(opts, appearance),
		[actions, appearance],
	);

	// NB: for each status change in a Smart Link, a performance mark is created.
	// Measures are sent relative to the first mark, matching what a user sees.
	useEffect(() => {
		measure.mark(id, state.status);
		if (state.status !== 'pending' && state.status !== 'resolving') {
			measure.create(id, state.status);

			if (state.status === 'resolved') {
				fireEvent('operational.smartLink.resolved', {
					definitionId: definitionId ?? null,
					duration: measure.getMeasure(id, state.status)?.duration ?? null,
				});
			} else if (
				state.error?.type !== 'ResolveUnsupportedError' &&
				state.error?.type !== 'UnsupportedError'
			) {
				fireEvent('operational.smartLink.unresolved', {
					definitionId: definitionId ?? null,
					reason: state.status,
					error:
						state.error === undefined
							? null
							: {
									name: state.error.name,
									kind: state.error.kind,
									type: state.error.type,
								},
				});
			}
		}
	}, [
		id,
		appearance,
		state.status,
		state.error,
		definitionId,
		extensionKey,
		resourceType,
		fireEvent,
	]);

	// NB: once the smart-card has rendered into an end state, we capture
	// this as a successful render. These can be one of:
	// - the resolved state: when metadata is shown;
	// - the unresolved states: viz. forbidden, not_found, unauthorized, errored.
	useEffect(() => {
		if (isFinalState(state.status)) {
			succeedUfoExperience('smart-link-rendered', id || 'NULL', {
				extensionKey,
				display: isFlexibleUi ? 'flexible' : appearance,
			});

			// UFO will disregard this if authentication experience has not yet been started
			succeedUfoExperience('smart-link-authenticated', id || 'NULL', {
				display: isFlexibleUi ? 'flexible' : appearance,
			});

			fireEvent('ui.smartLink.renderSuccess', {
				display: isFlexibleUi ? 'flexible' : appearance,
			});
		}
	}, [appearance, extensionKey, fireEvent, id, isFlexibleUi, state.status]);

	const onIframeDwell = useCallback(
		(dwellTime: number, dwellPercentVisible: number) => {
			fireEvent('ui.smartLinkIframe.dwelled', {
				id,
				definitionId: definitionId ?? null,
				display: isFlexibleUi ? 'flexible' : appearance,
				dwellPercentVisible,
				dwellTime,
			});
		},
		[id, appearance, definitionId, isFlexibleUi, fireEvent],
	);

	const onIframeFocus = useCallback(() => {
		fireEvent('ui.smartLinkIframe.focused', {
			id,
			definitionId: definitionId ?? null,
			display: isFlexibleUi ? 'flexible' : appearance,
		});
	}, [id, appearance, definitionId, isFlexibleUi, fireEvent]);

	if (isFlexibleUi) {
		let cardState = state;
		if (error) {
			if (error?.name === 'APIError') {
				cardState = { status: 'errored' };
			} else {
				throw error;
			}
		}

		return (
			<FlexibleCard
				id={id}
				cardState={cardState}
				onAuthorize={(services.length && handleAuthorize) || undefined}
				onClick={handleClickWrapper}
				origin="smartLinkCard"
				renderers={renderers}
				ui={ui}
				showHoverPreview={showHoverPreview}
				hoverPreviewOptions={hoverPreviewOptions}
				actionOptions={actionOptions}
				url={url}
				testId={testId}
				onResolve={onResolve}
				onError={onError}
			>
				{children}
			</FlexibleCard>
		);
	}

	// We have to keep this last to prevent hook order from being violated
	if (error) {
		throw error;
	}

	switch (appearance) {
		case 'inline':
			return (
				<InlineCard
					id={id}
					url={url}
					renderers={renderers}
					cardState={state}
					handleAuthorize={(services.length && handleAuthorize) || undefined}
					handleFrameClick={handleClickWrapper}
					isSelected={isSelected}
					isHovered={isHovered}
					onResolve={onResolve}
					onError={onError}
					testId={testId}
					inlinePreloaderStyle={inlinePreloaderStyle}
					showHoverPreview={showHoverPreview}
					hoverPreviewOptions={hoverPreviewOptions}
					actionOptions={actionOptions}
					removeTextHighlightingFromTitle={removeTextHighlightingFromTitle}
					resolvingPlaceholder={resolvingPlaceholder}
					truncateInline={truncateInline}
				/>
			);
		case 'block':
			return (
				<BlockCard
					id={id}
					url={url}
					renderers={renderers}
					authFlow={config && config.authFlow}
					cardState={state}
					handleAuthorize={(services.length && handleAuthorize) || undefined}
					handleFrameClick={handleClickWrapper}
					isSelected={isSelected}
					onResolve={onResolve}
					onError={onError}
					testId={testId}
					actionOptions={actionOptions}
					CompetitorPrompt={CompetitorPrompt}
					hideIconLoadingSkeleton={hideIconLoadingSkeleton}
				/>
			);
		case 'embed':
			return (
				<EmbedCard
					id={id}
					url={url}
					renderers={renderers}
					cardState={state}
					iframeUrlType={embedIframeUrlType}
					handleAuthorize={(services.length && handleAuthorize) || undefined}
					handleErrorRetry={handleRetry}
					handleFrameClick={handleClickWrapper}
					handleInvoke={handleInvoke}
					isSelected={isSelected}
					frameStyle={frameStyle}
					platform={platform}
					onResolve={onResolve}
					onError={onError}
					testId={testId}
					inheritDimensions={inheritDimensions}
					actionOptions={actionOptions}
					ref={embedIframeRef}
					onIframeDwell={onIframeDwell}
					onIframeFocus={onIframeFocus}
					CompetitorPrompt={CompetitorPrompt}
				/>
			);
	}
}

export const CardWithUrlContent = (props: CardWithUrlContentProps) => {
	const display = isFlexibleUiCard(props.children, props?.ui)
		? CardDisplay.Flexible
		: props.appearance;

	return (
		<SmartLinkModalProvider>
			<SmartLinkAnalyticsContext url={props.url} id={props.id} display={display}>
				<Component {...props} />
			</SmartLinkAnalyticsContext>
		</SmartLinkModalProvider>
	);
};
