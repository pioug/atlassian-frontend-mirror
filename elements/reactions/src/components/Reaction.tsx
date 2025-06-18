/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl-next';
import { css, cssMap, jsx } from '@compiled/react';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { type EmojiProvider, ResourcedEmoji, type EmojiId } from '@atlaskit/emoji';

import {
	createAndFireSafe,
	createReactionClickedEvent,
	createReactionFocusedEvent,
	createReactionHoveredEvent,
} from '../analytics';
import { type ReactionSummary, type ReactionClick, type ReactionMouseEnter } from '../types';
import { Counter } from './Counter';
import { ReactionParticleEffect } from './ReactionParticleEffect';
import { ReactionTooltip } from './ReactionTooltip';
import { messages } from '../shared/i18n';
import { isLeftClick } from '../shared/utils';
import { RESOURCED_EMOJI_COMPACT_HEIGHT } from '../shared/constants';
import { type ReactionFocused } from '../types/reaction';
import { ReactionButton } from './ReactionButton';
import { StaticReaction } from './StaticReaction';
import { type OpenReactionsDialogOptions } from './Reactions';
import { token } from '@atlaskit/tokens';

import { Box, Inline } from '@atlaskit/primitives/compiled';
import { fg } from '@atlaskit/platform-feature-flags';

const styles = cssMap({
	container: {
		position: 'relative',
	},
});

const emojiStyle = css({
	transformOrigin: 'center center 0',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '12px',
	paddingTop: token('space.050', '4px'),
	paddingRight: token('space.050', '4px'),
	paddingBottom: token('space.050', '4px'),
	paddingLeft: token('space.100', '8px'),
});

const emojiNoReactionStyle = css({
	paddingTop: token('space.050', '4px'),
	paddingRight: token('space.025', '2px'),
	paddingBottom: token('space.050', '4px'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingLeft: '10px',
});

/**
 * Test id for Reaction item wrapper div
 */
export const RENDER_REACTION_TESTID = 'render_reaction_wrapper';

export interface ReactionProps {
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
	 * Optional prop for using an opaque button background instead of a transparent background
	 */
	showOpaqueBackground?: boolean;
	/**
	 * Optional prop for enabling the Reactions Dialog
	 */
	allowUserDialog?: boolean;
	/**
	 * Optional function when the user wants to open the Reactions Dialog
	 */
	handleOpenReactionsDialog?: (options?: OpenReactionsDialogOptions) => void;
	/**
	 * Optional prop for controlling if the reactions component is view only, disabling adding reactions
	 */
	isViewOnly?: boolean;
	/**
	 * Optional prop for controlling if the reaction displayed is a default one and should not have a border
	 */
	showSubtleStyle?: boolean;
}

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
	showOpaqueBackground = false,
	allowUserDialog,
	handleOpenReactionsDialog,
	isViewOnly = false,
	showSubtleStyle,
}: ReactionProps) => {
	const intl = useIntl();
	const hoverStart = useRef<number>();
	const focusStart = useRef<number>();
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const [emojiName, setEmojiName] = useState<string>();
	const [isTooltipEnabled, setIsTooltipEnabled] = useState(true);
	const { reacted } = reaction;

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

	const dismissTooltip = () => {
		setIsTooltipEnabled(false);
	};

	const emojiAndCount = (
		<Inline>
			<div css={[emojiStyle, reaction.count === 0 && emojiNoReactionStyle]}>
				<ResourcedEmoji
					emojiProvider={emojiProvider}
					emojiId={emojiId}
					fitToHeight={RESOURCED_EMOJI_COMPACT_HEIGHT}
					{...(reaction.emojiPath && fg('platform_optimistic_reaction_emoji')
						? {
								optimistic: true,
								optimisticImageURL: reaction.emojiPath,
							}
						: {})}
				/>
			</div>
			<Counter value={reaction.count} highlight={!isViewOnly && reaction.reacted} />
		</Inline>
	);

	let reactionAriaLabel = intl.formatMessage(messages.reactWithEmoji, {
		emoji: emojiName,
	});

	if (reaction.count) {
		reactionAriaLabel = intl.formatMessage(messages.reactWithEmojiAndCount, {
			emoji: emojiName,
			count: reaction.count,
		});
	}

	return (
		<Box xcss={styles.container}>
			{showParticleEffect && (
				<ReactionParticleEffect emojiId={emojiId} emojiProvider={emojiProvider} />
			)}
			<ReactionTooltip
				emojiName={emojiName}
				reaction={reaction}
				isEnabled={isTooltipEnabled}
				allowUserDialog={allowUserDialog}
				handleOpenReactionsDialog={handleOpenReactionsDialog}
				dismissTooltip={dismissTooltip}
			>
				{isViewOnly ? (
					<StaticReaction
						onMouseEnter={handleMouseEnter}
						onFocus={handleFocused}
						testId={RENDER_REACTION_TESTID}
						dataAttributes={{
							'data-emoji-id': reaction.emojiId,
						}}
					>
						{emojiAndCount}
					</StaticReaction>
				) : (
					<ReactionButton
						onClick={handleClick}
						flash={flash}
						ariaLabel={reactionAriaLabel}
						ariaPressed={reacted}
						onMouseEnter={handleMouseEnter}
						onFocus={handleFocused}
						testId={RENDER_REACTION_TESTID}
						dataAttributes={{
							'data-emoji-id': reaction.emojiId,
							'data-emoji-button-id': reaction.emojiId,
						}}
						showOpaqueBackground={showOpaqueBackground}
						showSubtleStyle={showSubtleStyle}
						reacted={reacted}
					>
						{emojiAndCount}
					</ReactionButton>
				)}
			</ReactionTooltip>
		</Box>
	);
};
