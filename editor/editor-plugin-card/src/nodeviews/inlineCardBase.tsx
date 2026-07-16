import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';

import rafSchedule from 'raf-schd';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid/v4';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import { fg } from '@atlaskit/platform-feature-flags';
import { Card as SmartCard } from '@atlaskit/smart-card';
import type { OnClickCallback } from '@atlaskit/smart-card/card/types';
import { CardSSR } from '@atlaskit/smart-card/ssr';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { registerCard, removeCard } from '../pm-plugins/actions';
import { visitCardLinkAnalytics } from '../ui/toolbar';

import type { SmartCardProps } from './genericCard';

export const InlineCard: React.MemoExoticComponent<
	({
		node,
		cardContext,
		actionOptions,
		useAlternativePreloader,
		view,
		getPos,
		onClick,
		onResolve,
		isHovered,
		showHoverPreview,
		hoverPreviewOptions,
		isPageSSRed,
		pluginInjectionApi,
		disablePreviewPanel,
	}: SmartCardProps) => React.JSX.Element | null
> = memo(
	({
		node,
		cardContext,
		actionOptions,
		useAlternativePreloader,
		view,
		getPos,
		onClick: propsOnClick,
		onResolve: onRes,
		isHovered,
		showHoverPreview,
		hoverPreviewOptions,
		isPageSSRed,
		pluginInjectionApi,
		disablePreviewPanel,
	}: SmartCardProps): React.JSX.Element | null => {
		const { url, data } = node.attrs;
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		const refId = useRef(uuid());
		const removeCardDispatched = useRef(false);

		const { getState: getSmartlinkState } = cardContext?.value?.store || {};
		const cardState = getSmartlinkState?.()[url || ''];

		useEffect(() => {
			const id = refId.current;
			removeCardDispatched.current = false;
			return () => {
				if (
					expValEquals('platform_editor_inline_card_dispatch_guard', 'isEnabled', true) &&
					removeCardDispatched.current
				) {
					return;
				}
				removeCardDispatched.current = true;
				const { tr } = view.state;
				removeCard({ id })(tr);
				view.dispatch(tr);
			};
		}, [getPos, view]);

		const scrollContainer: HTMLElement | undefined = useMemo(
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			() => findOverflowScrollParent(view.dom as HTMLElement) || undefined,
			[view.dom],
		);

		const onResolve = useCallback(
			(data: { title?: string; url?: string }) => {
				if (!getPos || typeof getPos === 'boolean') {
					return;
				}

				const { title, url } = data;
				// don't dispatch immediately since we might be in the middle of
				// rendering a nodeview
				rafSchedule(() => {
					// prosemirror-bump-fix
					const pos = getPos();

					if (typeof pos !== 'number') {
						return;
					}

					const tr = view.state.tr;

					registerCard({
						title,
						url,
						pos,
						id: refId.current,
					})(tr);

					onRes?.(tr, title);

					view.dispatch(tr);
				})();
			},
			[getPos, view, onRes],
		);

		const onError = useCallback(
			(data: { err?: Error; url?: string }) => {
				const { url, err } = data;
				if (err) {
					throw err;
				}
				onResolve({ url });
			},
			[onResolve],
		);

		const handleOnClick: OnClickCallback = useCallback(
			(event, data) => {
				if (event.metaKey || event.ctrlKey) {
					const { actions: editorAnalyticsApi } = pluginInjectionApi?.analytics ?? {};

					visitCardLinkAnalytics(editorAnalyticsApi, INPUT_METHOD.META_CLICK)(
						view.state,
						view.dispatch,
					);

					window.open(
						fg('platform_smartlink_xpc_url_wrapping') ? (data?.destinationUrl ?? url) : url,
						'_blank',
					);
				} else {
					// only trigger the provided onClick callback if the meta key or ctrl key is not pressed
					propsOnClick?.(event);
				}
			},
			[propsOnClick, url, view, pluginInjectionApi],
		);

		const onClick = editorExperiment('platform_editor_controls', 'variant1')
			? handleOnClick
			: propsOnClick;

		const card = useMemo(() => {
			if (
				(isPageSSRed ||
					(cardState &&
						expValEquals('platform_editor_smartlink_local_cache', 'isEnabled', true))) &&
				url
			) {
				return (
					<CardSSR
						key={url}
						url={url}
						appearance="inline"
						onClick={onClick}
						container={scrollContainer}
						onResolve={onResolve}
						onError={onError}
						inlinePreloaderStyle={useAlternativePreloader ? 'on-right-without-skeleton' : undefined}
						actionOptions={actionOptions}
						isHovered={isHovered}
						showHoverPreview={showHoverPreview}
						hoverPreviewOptions={hoverPreviewOptions}
						disablePreviewPanel={disablePreviewPanel}
						hideIconLoadingSkeleton
					/>
				);
			}

			return (
				<SmartCard
					key={url}
					url={url ?? data.url}
					appearance="inline"
					onClick={onClick}
					container={scrollContainer}
					onResolve={onResolve}
					onError={onError}
					inlinePreloaderStyle={useAlternativePreloader ? 'on-right-without-skeleton' : undefined}
					actionOptions={actionOptions}
					isHovered={isHovered}
					showHoverPreview={showHoverPreview}
					hoverPreviewOptions={hoverPreviewOptions}
					disablePreviewPanel={disablePreviewPanel}
				/>
			);
		}, [
			url,
			data,
			onClick,
			scrollContainer,
			onResolve,
			onError,
			useAlternativePreloader,
			actionOptions,
			isHovered,
			showHoverPreview,
			hoverPreviewOptions,
			isPageSSRed,
			disablePreviewPanel,
			cardState,
		]);

		// [WS-2307]: we only render card wrapped into a Provider when the value is ready,
		// otherwise if we got data, we can render the card directly since it doesn't need the Provider
		return cardContext && cardContext.value ? (
			<cardContext.Provider value={cardContext.value}>{card}</cardContext.Provider>
		) : data ? (
			card
		) : null;
	},
);
