import React, { type MouseEvent, useCallback, useEffect, useMemo } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { CardDisplay } from '../../constants';
import { type InvokeClientOpts, type InvokeServerOpts } from '../../model/invoke-opts';
import { useSmartLink } from '../../state';
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
	useLegacyBlockCard,
	removeTextHighlightingFromTitle,
	resolvingPlaceholder,
	truncateInline,
}: CardWithUrlContentProps) {
	const { createAnalyticsEvent } = useAnalyticsEvents();

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
			analytics.operational.instrument({
				id,
				status: state.status,
				definitionId,
				extensionKey: extensionKey ?? state.error?.extensionKey,
				resourceType,
				error: state.error,
			});
		}
	}, [
		id,
		appearance,
		state.status,
		state.error,
		definitionId,
		extensionKey,
		resourceType,
		analytics.operational,
	]);

	// NB: once the smart-card has rendered into an end state, we capture
	// this as a successful render. These can be one of:
	// - the resolved state: when metadata is shown;
	// - the unresolved states: viz. forbidden, not_found, unauthorized, errored.
	useEffect(() => {
		if (isFinalState(state.status)) {
			analytics.ui.renderSuccessEvent({
				display: isFlexibleUi ? 'flexible' : appearance,
				status: state.status,
				id,
				definitionId,
				extensionKey,
				canBeDatasource,
			});
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
	]);

	const onIframeDwell = useCallback(
		(dwellTime: number, dwellPercentVisible: number) => {
			analytics.ui.iframeDwelledEvent({
				id,
				display: isFlexibleUi ? 'flexible' : appearance,
				status: state.status,
				definitionId,
				extensionKey,
				destinationProduct: product,
				destinationSubproduct: subproduct,
				dwellTime: dwellTime,
				dwellPercentVisible: dwellPercentVisible,
			});
		},
		[
			id,
			state.status,
			analytics.ui,
			appearance,
			definitionId,
			extensionKey,
			isFlexibleUi,
			product,
			subproduct,
		],
	);

	const onIframeFocus = useCallback(() => {
		analytics.ui.iframeFocusedEvent({
			id,
			display: isFlexibleUi ? 'flexible' : appearance,
			status: state.status,
			definitionId,
			extensionKey,
			destinationProduct: product,
			destinationSubproduct: subproduct,
		});
	}, [
		id,
		state.status,
		analytics.ui,
		appearance,
		definitionId,
		extensionKey,
		isFlexibleUi,
		product,
		subproduct,
	]);

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
					handleErrorRetry={handleRetry}
					handleInvoke={handleInvoke}
					handleFrameClick={handleClickWrapper}
					analytics={analytics}
					isSelected={isSelected}
					onResolve={onResolve}
					onError={onError}
					testId={testId}
					actionOptions={actionOptions}
					platform={platform}
					enableFlexibleBlockCard={useLegacyBlockCard !== true}
				/>
			);
		case 'embed':
			return (
				<EmbedCard
					id={id}
					url={url}
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
