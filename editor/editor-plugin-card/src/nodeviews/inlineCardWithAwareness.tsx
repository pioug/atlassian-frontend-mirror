import React, { memo, useCallback, useMemo, useState } from 'react';

import {
	type NamedPluginStatesFromInjectionAPI,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { HoverLinkOverlay } from '@atlaskit/editor-common/ui';
import { NodeSelection, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { getObjectAri, getObjectName, getObjectIconUrl } from '@atlaskit/smart-card';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { type cardPlugin } from '../cardPlugin';
import { registerRemoveOverlay } from '../pm-plugins/actions';
import { pluginKey } from '../pm-plugins/plugin-key';
import { AwarenessWrapper } from '../ui/AwarenessWrapper';
import { PreviewInvoker } from '../ui/preview/PreviewInvoker';

import type { SmartCardProps } from './genericCard';
import { InlineCard } from './inlineCard';

export type InlineCardWithAwarenessProps = {
	isOverlayEnabled?: boolean;
	isPulseEnabled?: boolean;
	isSelected?: boolean;
};

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<typeof cardPlugin>,
		'selection' | 'editorViewMode'
	>,
) => {
	return {
		mode: states.editorViewModeState?.mode,
		selection: states.selectionState?.selection,
	};
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined) => {
		return useSharedPluginStateWithSelector(
			pluginInjectionApi,
			['selection', 'editorViewMode'],
			selector,
		);
	},
	(pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined) => {
		const { selectionState, editorViewModeState } = useSharedPluginState(pluginInjectionApi, [
			'selection',
			'editorViewMode',
		]);
		return {
			mode: editorViewModeState?.mode,
			selection: selectionState?.selection,
		};
	},
);

export const InlineCardWithAwareness = memo(
	({
		node,
		cardContext,
		actionOptions,
		useAlternativePreloader,
		view,
		getPos,
		pluginInjectionApi,
		onClick,
		isPulseEnabled,
		isOverlayEnabled,
		isSelected,
		isPageSSRed,
		appearance,
	}: SmartCardProps & InlineCardWithAwarenessProps) => {
		const [isHovered, setIsHovered] = useState(false);
		const [isInserted, setIsInserted] = useState(false);
		const [isResolvedViewRendered, setIsResolvedViewRendered] = useState(false);
		const editorAppearance = pluginInjectionApi?.card.sharedState.currentState()?.editorAppearance;

		const onResolve = useCallback((tr: Transaction, title?: string): void => {
			const metadata = tr.getMeta(pluginKey);
			if (metadata && metadata.type === 'REGISTER') {
				registerRemoveOverlay(() => setIsInserted(false), metadata.info)(tr);
			} else {
				registerRemoveOverlay(() => setIsInserted(false))(tr);
			}

			if (title) {
				setIsResolvedViewRendered(true);
			}
		}, []);

		const markMostRecentlyInsertedLink = useCallback(
			(isLinkMostRecentlyInserted: boolean) => {
				if (isOverlayEnabled) {
					setIsInserted(isLinkMostRecentlyInserted);
				}
			},
			[isOverlayEnabled],
		);

		const setOverlayHoveredStyles = useCallback(
			(isHovered: boolean) => {
				if (isOverlayEnabled) {
					setIsHovered(isHovered);
				}
			},
			[isOverlayEnabled],
		);

		const { mode, selection } = useSharedState(pluginInjectionApi);
		const floatingToolbarNode = selection instanceof NodeSelection && selection.node;
		// This is a prop to show Hover card, Hover card should be shown only in Live View and Classic Renderer (note when only Editor controls enabled we don't show in Live view)
		const showHoverPreview =
			floatingToolbarNode !== node &&
			expValEquals('platform_editor_preview_panel_linking_exp', 'isEnabled', true);

		const innerCardWithOpenButtonOverlay = useMemo(
			() => (
				<HoverLinkOverlay
					isVisible={isResolvedViewRendered}
					url={node.attrs.url}
					compactPadding={editorAppearance === 'comment' || editorAppearance === 'chromeless'}
					editorAnalyticsApi={pluginInjectionApi?.analytics?.actions}
					view={view}
				>
					<InlineCard
						node={node}
						view={view}
						getPos={getPos}
						useAlternativePreloader={useAlternativePreloader}
						actionOptions={actionOptions}
						onResolve={onResolve}
						onClick={onClick}
						cardContext={cardContext}
						isHovered={isHovered}
						isPageSSRed={isPageSSRed}
						pluginInjectionApi={pluginInjectionApi}
						disablePreviewPanel={true}
					/>
				</HoverLinkOverlay>
			),
			[
				isResolvedViewRendered,
				node,
				editorAppearance,
				view,
				getPos,
				useAlternativePreloader,
				actionOptions,
				onResolve,
				onClick,
				cardContext,
				isHovered,
				isPageSSRed,
				pluginInjectionApi,
			],
		);

		const innerCardOriginal = useMemo(
			() => (
				<InlineCard
					node={node}
					view={view}
					getPos={getPos}
					useAlternativePreloader={useAlternativePreloader}
					actionOptions={actionOptions}
					onResolve={onResolve}
					onClick={onClick}
					cardContext={cardContext}
					isHovered={isHovered}
					isPageSSRed={isPageSSRed}
					pluginInjectionApi={pluginInjectionApi}
					showHoverPreview={false}
				/>
			),
			[
				actionOptions,
				cardContext,
				getPos,
				isHovered,
				node,
				onClick,
				onResolve,
				useAlternativePreloader,
				view,
				isPageSSRed,
				pluginInjectionApi,
			],
		);

		const shouldShowOpenButtonOverlay = useMemo(() => {
			const shouldShowOpenButtonOverlayInChomeless = editorAppearance === 'chromeless';

			return (
				(mode === 'edit' ||
					editorAppearance === 'comment' ||
					shouldShowOpenButtonOverlayInChomeless) &&
				(editorExperiment('platform_editor_controls', 'variant1') ||
					expValEquals('platform_editor_preview_panel_linking_exp', 'isEnabled', true))
			);
		}, [mode, editorAppearance]);

		let innerCard = shouldShowOpenButtonOverlay
			? innerCardWithOpenButtonOverlay
			: innerCardOriginal;

		if (
			mode === 'view' &&
			expValEquals('platform_editor_preview_panel_linking_exp', 'isEnabled', true)
		) {
			const url = node.attrs.url;
			const cardState = cardContext?.value?.store?.getState()[url];
			if (cardState) {
				const ari = getObjectAri(cardState.details);
				const name = getObjectName(cardState.details);
				const iconUrl = getObjectIconUrl(cardState.details);
				const isPanelAvailable = ari && cardContext?.value?.isPreviewPanelAvailable?.({ ari });
				const openPreviewPanel = cardContext?.value?.openPreviewPanel;
				const isPreviewPanelAvailable = Boolean(openPreviewPanel && isPanelAvailable);

				const innerCardWithPanelButtonOverlay = (
					<PreviewInvoker url={url} appearance="inline">
						{({ canPreview, invokePreview }) => {
							const isPreviewModalAvailable = Boolean(canPreview && invokePreview);
							// In view mode we show HoverLinkOverlay only with if preview mode or panel is available
							// otherwise a use can click on smartlink itself to open the link in a new tab.
							const isPreviewAvailable = isPreviewPanelAvailable || isPreviewModalAvailable;

							if (isPreviewAvailable) {
								return (
									<HoverLinkOverlay
										isVisible={isResolvedViewRendered}
										url={url}
										compactPadding={
											editorAppearance === 'comment' || editorAppearance === 'chromeless'
										}
										editorAnalyticsApi={pluginInjectionApi?.analytics?.actions}
										view={view}
										showPanelButton={isPreviewAvailable}
										showPanelButtonIcon={
											isPreviewAvailable && isPreviewPanelAvailable ? 'panel' : 'modal'
										}
										onClick={(event) => {
											if (isPreviewPanelAvailable) {
												event.preventDefault();
												openPreviewPanel?.({
													url,
													ari: ari || '',
													name: name || '',
													iconUrl,
												});
											} else if (isPreviewModalAvailable) {
												event.preventDefault();
												invokePreview?.();
											}
										}}
									>
										<InlineCard
											node={node}
											view={view}
											getPos={getPos}
											useAlternativePreloader={useAlternativePreloader}
											actionOptions={actionOptions}
											onResolve={onResolve}
											onClick={onClick}
											cardContext={cardContext}
											isHovered={isHovered}
											isPageSSRed={isPageSSRed}
											pluginInjectionApi={pluginInjectionApi}
											showHoverPreview={mode === 'view' && showHoverPreview}
											disablePreviewPanel={true}
										/>
									</HoverLinkOverlay>
								);
							} else {
								return (
									<InlineCard
										node={node}
										view={view}
										getPos={getPos}
										useAlternativePreloader={useAlternativePreloader}
										actionOptions={actionOptions}
										onResolve={onResolve}
										onClick={onClick}
										cardContext={cardContext}
										isHovered={isHovered}
										isPageSSRed={isPageSSRed}
										pluginInjectionApi={pluginInjectionApi}
										showHoverPreview={mode === 'view' && showHoverPreview}
									/>
								);
							}
						}}
					</PreviewInvoker>
				);
				innerCard = innerCardWithPanelButtonOverlay;
			}
		}

		const getPosFunction = typeof getPos === 'function' ? getPos : undefined;
		const placeholderUniqId = getPosFunction?.() || 0;

		return isOverlayEnabled || isPulseEnabled ? (
			<AwarenessWrapper
				isOverlayEnabled={isOverlayEnabled}
				isPulseEnabled={isPulseEnabled}
				cardContext={cardContext}
				getPos={getPos}
				isHovered={isHovered}
				isInserted={isInserted}
				url={node.attrs.url}
				isSelected={isSelected}
				isResolvedViewRendered={isResolvedViewRendered}
				markMostRecentlyInsertedLink={markMostRecentlyInsertedLink}
				pluginInjectionApi={pluginInjectionApi}
				setOverlayHoveredStyles={setOverlayHoveredStyles}
				appearance={appearance}
			>
				{innerCard}
			</AwarenessWrapper>
		) : (
			<span
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="card"
				data-vc="editor-plugin-inline-card"
				data-ssr-placeholder={`editor-plugin-inline-card-${placeholderUniqId}`}
				data-ssr-placeholder-replace={`editor-plugin-inline-card-${placeholderUniqId}`}
			>
				{innerCard}
			</span>
		);
	},
);
