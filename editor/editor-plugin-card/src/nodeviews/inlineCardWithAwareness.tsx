import React, { memo, useCallback, useMemo, useState } from 'react';

import { type Transaction } from '@atlaskit/editor-prosemirror/state';

import { registerRemoveOverlay } from '../pm-plugins/actions';
import { AwarenessWrapper } from '../ui/AwarenessWrapper';

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
		showServerActions,
		useAlternativePreloader,
		view,
		getPos,
		pluginInjectionApi,
		onClick,
		isPulseEnabled,
		isOverlayEnabled,
		isSelected,
	}: SmartCardProps & InlineCardWithAwarenessProps) => {
		const [isHovered, setIsHovered] = useState(false);
		const [isInserted, setIsInserted] = useState(false);
		const [isResolvedViewRendered, setIsResolvedViewRendered] = useState(false);

		const onResolve = useCallback((tr: Transaction, title?: string): void => {
			registerRemoveOverlay(() => setIsInserted(false))(tr);
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

		const innerCard = useMemo(
			() => (
				<InlineCard
					node={node}
					view={view}
					getPos={getPos}
					useAlternativePreloader={useAlternativePreloader}
					actionOptions={actionOptions}
					showServerActions={showServerActions}
					onResolve={onResolve}
					onClick={onClick}
					cardContext={cardContext}
					isHovered={isHovered}
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
				showServerActions,
				useAlternativePreloader,
				view,
			],
		);

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
			>
				{innerCard}
			</AwarenessWrapper>
		) : (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			<span className="card">{innerCard}</span>
		);
	},
);
