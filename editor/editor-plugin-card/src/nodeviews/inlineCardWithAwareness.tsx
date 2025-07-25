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
import { fg } from '@atlaskit/platform-feature-flags';
import { getObjectAri, getObjectName, getObjectIconUrl } from '@atlaskit/smart-card';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { type cardPlugin } from '../cardPlugin';
import { registerRemoveOverlay } from '../pm-plugins/actions';
import { pluginKey } from '../pm-plugins/plugin-key';
import { AwarenessWrapper } from '../ui/AwarenessWrapper';

import type { SmartCardProps } from './genericCard';
import { InlineCard } from './inlineCard';

export type InlineCardWithAwarenessProps = {
	isPulseEnabled?: boolean;
	isOverlayEnabled?: boolean;
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
		const showHoverPreview =
			floatingToolbarNode !== node && fg('platform_editor_preview_panel_linking');

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
						showHoverPreview={showHoverPreview}
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
				showHoverPreview,
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
					showHoverPreview={showHoverPreview}
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
				showHoverPreview,
			],
		);

		const shouldShowOpenButtonOverlay = useMemo(() => {
			const shouldShowOpenButtonOverlayInChomeless = editorAppearance === 'chromeless';

			return (
				(mode === 'edit' ||
					editorAppearance === 'comment' ||
					shouldShowOpenButtonOverlayInChomeless) &&
				(editorExperiment('platform_editor_controls', 'variant1') ||
					fg('platform_editor_preview_panel_linking'))
			);
		}, [mode, editorAppearance]);

		let innerCard = shouldShowOpenButtonOverlay
			? innerCardWithOpenButtonOverlay
			: innerCardOriginal;

		if (fg('platform_editor_preview_panel_linking')) {
			const cardState = cardContext?.value?.store?.getState()[node.attrs.url];
			if (cardState) {
				const ari = getObjectAri(cardState.details);
				const name = getObjectName(cardState.details);
				const iconUrl = getObjectIconUrl(cardState.details);
				const isPanelAvailable = ari && cardContext?.value?.isPreviewPanelAvailable?.({ ari });
				const openPreviewPanel = cardContext?.value?.openPreviewPanel;

				const handleOpenGlancePanelClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
					if (openPreviewPanel && isPanelAvailable) {
						// Prevent anchor default behaviour(click to open the anchor link)
						// When glance panel is available, let openPreviewPanel handle it
						event.preventDefault();
						openPreviewPanel({
							url: node.attrs.url,
							ari,
							name: name || '',
							iconUrl,
						});
					}
				};

				const innerCardWithPanelButtonOverlay = (
					<HoverLinkOverlay
						isVisible={isResolvedViewRendered}
						url={node.attrs.url}
						compactPadding={editorAppearance === 'comment' || editorAppearance === 'chromeless'}
						editorAnalyticsApi={pluginInjectionApi?.analytics?.actions}
						view={view}
						showPanelButton={!!isPanelAvailable}
						onClick={handleOpenGlancePanelClick}
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
							showHoverPreview={showHoverPreview}
						/>
					</HoverLinkOverlay>
				);
				innerCard =
					isPanelAvailable && openPreviewPanel ? innerCardWithPanelButtonOverlay : innerCard;
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
