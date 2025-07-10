import React, { memo, useCallback, useMemo, useState } from 'react';

import {
	type NamedPluginStatesFromInjectionAPI,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { type cardPlugin } from '../cardPlugin';
import { registerRemoveOverlay } from '../pm-plugins/actions';
import { pluginKey } from '../pm-plugins/plugin-key';
import { AwarenessWrapper } from '../ui/AwarenessWrapper';
import OpenButtonOverlay from '../ui/OpenButtonOverlay';

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
		'editorViewMode'
	>,
) => {
	return {
		mode: states.editorViewModeState?.mode,
	};
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined) => {
		return useSharedPluginStateWithSelector(pluginInjectionApi, ['editorViewMode'], selector);
	},
	(pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined) => {
		const { editorViewModeState } = useSharedPluginState(pluginInjectionApi, ['editorViewMode']);
		return {
			mode: editorViewModeState?.mode,
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

		const { mode } = useSharedState(pluginInjectionApi);

		const innerCardWithOpenButtonOverlay = useMemo(
			() => (
				<OpenButtonOverlay
					isVisible={isResolvedViewRendered}
					url={node.attrs.url}
					editorAppearance={editorAppearance}
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
					/>
				</OpenButtonOverlay>
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
				editorExperiment('platform_editor_controls', 'variant1')
			);
		}, [mode, editorAppearance]);

		const innerCard = shouldShowOpenButtonOverlay
			? innerCardWithOpenButtonOverlay
			: innerCardOriginal;

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
