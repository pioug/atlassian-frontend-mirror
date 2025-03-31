import React, { memo, useCallback, useMemo, useState } from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

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

		const onResolve = useCallback((tr: Transaction, title?: string): void => {
			if (fg('platform_editor_fix_card_plugin_state')) {
				const metadata = tr.getMeta(pluginKey);
				if (metadata && metadata.type === 'REGISTER') {
					registerRemoveOverlay(() => setIsInserted(false), metadata.info)(tr);
				} else {
					registerRemoveOverlay(() => setIsInserted(false))(tr);
				}
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
		const { editorViewModeState } = useSharedPluginState(pluginInjectionApi, ['editorViewMode']);

		const innerCardWithOpenButtonOverlay = useMemo(
			() => (
				<OpenButtonOverlay isVisible={isResolvedViewRendered} url={node.attrs.url}>
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
					/>
				</OpenButtonOverlay>
			),
			[
				isResolvedViewRendered,
				node,
				view,
				getPos,
				useAlternativePreloader,
				actionOptions,
				onResolve,
				onClick,
				cardContext,
				isHovered,
				isPageSSRed,
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
			],
		);

		const innerCard =
			editorViewModeState?.mode === 'edit' &&
			editorExperiment('platform_editor_controls', 'variant1') &&
			fg('platform_editor_controls_patch_1')
				? innerCardWithOpenButtonOverlay
				: innerCardOriginal;

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
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			<span className="card">{innerCard}</span>
		);
	},
);
