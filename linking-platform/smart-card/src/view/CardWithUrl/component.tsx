import React, { type MouseEvent, useCallback, useEffect, useMemo } from 'react';

import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { CardDisplay } from '../../constants';
import { type InvokeClientOpts, type InvokeServerOpts } from '../../model/invoke-opts';
import { useSmartLink } from '../../state';
import { succeedUfoExperience } from '../../state/analytics';
import {
	getCanBeDatasource,
	getClickUrl,
	getDefinitionId,
	getExtensionKey,
	getProduct,
	getResourceType,
	getServices,
	getSubproduct,
	isFinalState,
} from '../../state/helpers';
import { SmartLinkModalProvider } from '../../state/modal';
import { isSpecialEvent } from '../../utils';
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
	showAuthTooltip,
	analyticsEvents,
	removeTextHighlightingFromTitle,
	resolvingPlaceholder,
	truncateInline,
}: CardWithUrlContentProps) {
	const { createAnalyticsEvent } = useAnalyticsEventsNext();
	const { fireEvent } = useAnalyticsEvents();

	// Get state, actions for this card.
	const {
		state,
		actions,
		analytics: defaultAnalytics,
		config,
		renderers,
		error,
	} = useSmartLink(id, url);
	const analytics = analyticsEvents || defaultAnalytics;
	const definitionId = getDefinitionId(state.details);
	const extensionKey = getExtensionKey(state.details);
	const resourceType = getResourceType(state.details);
	const product = getProduct(state.details);
	const subproduct = getSubproduct(state.details);
	const services = getServices(state.details);
	const canBeDatasource = getCanBeDatasource(state.details);

	let isFlexibleUi = useMemo(() => isFlexibleUiCard(children), [children]);

	const actionOptions = combineActionOptions({
		actionOptions: actionOptionsProp,
		platform,
	});

	// Setup UI handlers.
	const handleClickWrapper = useCallback(
		(event: MouseEvent) => {
			const isModifierKeyPressed = isSpecialEvent(event);
			if (fg('platform_migrate-some-ui-events-smart-card')) {
				fireEvent('ui.smartLink.clicked', {
					id,
					display: isFlexibleUi ? CardDisplay.Flexible : appearance,
					definitionId: definitionId ?? null,
					isModifierKeyPressed,
				});
			} else {
				analytics.ui.cardClickedEvent({
					id,
					display: isFlexibleUi ? CardDisplay.Flexible : appearance,
					status: state.status,
					definitionId,
					extensionKey,
					isModifierKeyPressed,
					destinationProduct: product,
					destinationSubproduct: subproduct,
				});
			}

			if (!onClick && !isFlexibleUi) {
				const clickUrl = getClickUrl(url, state.details);
				// Ctrl+left click on mac typically doesn't trigger onClick
				// The event could have potentially had `e.preventDefault()` called on it by now
				// event by smart card internally
				// If it has been called then only then can `isModifierKeyPressed` be true.
				const target = isModifierKeyPressed ? '_blank' : '_self';
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
			id,
			url,
			state.details,
			state.status,
			analytics.ui,
			appearance,
			definitionId,
			extensionKey,
			onClick,
			isFlexibleUi,
			product,
			subproduct,
			createAnalyticsEvent,
			fireEvent,
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
			} else if (state.error?.type !== 'ResolveUnsupportedError') {
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
			if (fg('platform-smart-card-migrate-embed-modal-analytics')) {
				succeedUfoExperience('smart-link-rendered', id || 'NULL', {
					extensionKey,
					display: isFlexibleUi ? 'flexible' : appearance,
				});

				// UFO will disregard this if authentication experience has not yet been started
				succeedUfoExperience('smart-link-authenticated', id || 'NULL', {
					display: isFlexibleUi ? 'flexible' : appearance,
				});

				fireEvent('ui.smartLink.renderSuccess', {
					definitionId: definitionId ?? null,
					display: isFlexibleUi ? 'flexible' : appearance,
				});
			} else {
				analytics.ui.renderSuccessEvent({
					display: isFlexibleUi ? 'flexible' : appearance,
					status: state.status,
					id,
					definitionId,
					extensionKey,
					canBeDatasource,
				});
			}
		}
	}, [
		isFlexibleUi,
		appearance,
		state.status,
		url,
		definitionId,
		extensionKey,
		analytics.ui,
		id,
		canBeDatasource,
		fireEvent,
	]);

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
				showAuthTooltip={showAuthTooltip}
				actionOptions={actionOptions}
				url={url}
				testId={testId}
				onResolve={onResolve}
				onError={onError}
				analytics={analytics}
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
					analytics={analytics}
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
					showAuthTooltip={showAuthTooltip}
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
					analytics={analytics}
					isSelected={isSelected}
					onResolve={onResolve}
					onError={onError}
					testId={testId}
					actionOptions={actionOptions}
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
					analytics={analytics}
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
				/>
			);
	}
}

export const CardWithUrlContent = (props: CardWithUrlContentProps) => {
	const display = isFlexibleUiCard(props.children) ? CardDisplay.Flexible : props.appearance;

	return (
		<SmartLinkModalProvider>
			<SmartLinkAnalyticsContext url={props.url} id={props.id} display={display}>
				<Component {...props} />
			</SmartLinkAnalyticsContext>
		</SmartLinkModalProvider>
	);
};
