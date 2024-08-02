/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { type EmojiProvider, ResourcedEmoji, type EmojiId } from '@atlaskit/emoji';
import { Box, xcss } from '@atlaskit/primitives';

import {
	createAndFireSafe,
	createReactionClickedEvent,
	createReactionFocusedEvent,
	createReactionHoveredEvent,
} from '../../analytics';
import { type ReactionSummary, type ReactionClick, type ReactionMouseEnter } from '../../types';
import { Counter } from '../Counter';
import { ReactionParticleEffect } from '../ReactionParticleEffect';
import { ReactionTooltip, type ReactionTooltipProps } from '../ReactionTooltip';
import { messages } from '../../shared/i18n';
import { isLeftClick } from '../../shared/utils';
import { emojiStyle, emojiNoReactionStyle } from './styles';
import { type ReactionFocused } from '../../types/reaction';
import { ReactionButton } from './ReactionButton';

/**
 * Test id for Reaction item wrapper div
 */
export const RENDER_REACTION_TESTID = 'render_reaction_wrapper';

export interface ReactionProps extends Pick<ReactionTooltipProps, 'allowUserDialog'> {
	/**
	 * Data for the reaction
	 */
	reaction: ReactionSummary;
	/**
	 * Provider for loading emojis
	 */
	emojiProvider: Promise<EmojiProvider>;
	/**
	 * event handler when the emoji button is clicked
	 */
	onClick: ReactionClick;
	/**
	 * Optional event when the mouse cursor hovers over the reaction
	 */
	onMouseEnter?: ReactionMouseEnter;
	/**
	 * Optional event when focused the reaction
	 */
	onFocused?: ReactionFocused;
	/**
	 * Show custom animation or render as standard without animation (defaults to false)
	 */
	flash?: boolean;
	/**
	 * Show a floating emoji particle effect (usually in response to a new reaction) (defaults to false)
	 */
	showParticleEffect?: boolean;
	/**
	 * Optional function when the user wants to see more users in a modal
	 */
	handleUserListClick?: (emojiId: string) => void;
	/**
	 * Optional prop for using an opaque button background instead of a transparent background
	 */
	showOpaqueBackground?: boolean;
}
const containerStyles = xcss({
	position: 'relative',
});

const reactedStyles = xcss({
	backgroundColor: 'color.background.selected',
	borderColor: 'color.border.selected',
	':hover': {
		backgroundColor: 'color.background.selected.hovered',
	},
	':active': {
		backgroundColor: 'color.background.selected.pressed',
	},
});

const opaqueBackgroundStyles = xcss({
	backgroundColor: 'elevation.surface',
	':hover': {
		backgroundColor: 'elevation.surface.hovered',
	},
	':active': {
		backgroundColor: 'elevation.surface.pressed',
	},
});

/**
 * Render an emoji reaction button
 */
export const Reaction = ({
	emojiProvider,
	onClick,
	reaction,
	onMouseEnter = () => {},
	onFocused = () => {},
	flash = false,
	showParticleEffect = false,
	handleUserListClick = () => {},
	allowUserDialog,
	showOpaqueBackground = false,
}: ReactionProps) => {
	const intl = useIntl();
	const hoverStart = useRef<number>();
	const focusStart = useRef<number>();
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const [emojiName, setEmojiName] = useState<string>();
	const [isTooltipEnabled, setIsTooltipEnabled] = useState(true);

	const emojiId: EmojiId = { id: reaction.emojiId, shortName: '' };

	// TODO: Extract the flow to a custom hook to retrieve emoji detailed description from an id using a custom hook. This will benefit a better optimization instead of the emojiProvider resolving everytime.
	// Also optimize in future version to fetch in batch several emojiIds
	useEffect(() => {
		(async () => {
			const emojiResource = await Promise.resolve(emojiProvider);
			const foundEmoji = await emojiResource.findById(reaction.emojiId);
			if (foundEmoji) {
				setEmojiName(foundEmoji.name);
			}
		})();
	}, [emojiProvider, reaction.emojiId]);

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			if (isLeftClick(event)) {
				const { reacted, emojiId } = reaction;
				createAndFireSafe(createAnalyticsEvent, createReactionClickedEvent, !reacted, emojiId);
				onClick(reaction.emojiId, event);
			}
		},
		[createAnalyticsEvent, reaction, onClick],
	);

	const handleMouseEnter = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			setIsTooltipEnabled(true);
			if (!reaction.users || !reaction.users.length) {
				focusStart.current = Date.now();
			}
			createAndFireSafe(createAnalyticsEvent, createReactionHoveredEvent, focusStart.current);
			onMouseEnter(reaction.emojiId, event);
		},
		[createAnalyticsEvent, reaction, onMouseEnter],
	);

	const handleFocused = useCallback(
		(event: React.FocusEvent<HTMLButtonElement>) => {
			event.preventDefault();
			setIsTooltipEnabled(true);
			if (!reaction.users || !reaction.users.length) {
				hoverStart.current = Date.now();
			}
			createAndFireSafe(createAnalyticsEvent, createReactionFocusedEvent, hoverStart.current);
			onFocused(reaction.emojiId, event);
		},
		[createAnalyticsEvent, reaction, onFocused],
	);

	const handleOpenReactionsDialog = (emojiId: string) => {
		handleUserListClick(emojiId);
		setIsTooltipEnabled(false);
	};

	const buttonStyles = showOpaqueBackground ? [opaqueBackgroundStyles] : [];

	return (
		<Box xcss={containerStyles}>
			{showParticleEffect && (
				<ReactionParticleEffect emojiId={emojiId} emojiProvider={emojiProvider} />
			)}
			<ReactionTooltip
				emojiName={emojiName}
				reaction={reaction}
				handleUserListClick={handleOpenReactionsDialog}
				allowUserDialog={allowUserDialog}
				isEnabled={isTooltipEnabled}
			>
				<ReactionButton
					onClick={handleClick}
					flash={flash}
					additionalStyles={reaction.reacted ? [reactedStyles] : buttonStyles}
					ariaLabel={intl.formatMessage(messages.reactWithEmoji, {
						emoji: emojiName,
					})}
					onMouseEnter={handleMouseEnter}
					onFocus={handleFocused}
					testId={RENDER_REACTION_TESTID}
					dataAttributes={{
						'data-emoji-id': reaction.emojiId,
						'data-emoji-button-id': reaction.emojiId,
					}}
				>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<div css={[emojiStyle, reaction.count === 0 && emojiNoReactionStyle]}>
						<ResourcedEmoji emojiProvider={emojiProvider} emojiId={emojiId} fitToHeight={16} />
					</div>
					<Counter value={reaction.count} highlight={reaction.reacted} />
				</ReactionButton>
			</ReactionTooltip>
		</Box>
	);
};
