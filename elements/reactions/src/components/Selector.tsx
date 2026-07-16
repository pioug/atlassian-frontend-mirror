/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useEffect, useState } from 'react';
import { keyframes } from '@compiled/react';

import { css, jsx, cssMap } from '@atlaskit/css';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { type EmojiId, type OnEmojiEvent } from '@atlaskit/emoji/types';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { messages } from '../shared/i18n';
import { getDefaultReactions } from '../shared/constants';
import { EmojiButton } from './EmojiButton';
import { ShowMore } from './ShowMore';
import { Trigger } from './Trigger';

const styles = cssMap({
	container: {
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
	},

	emojiContainer: {
		listStyleType: 'none',
		marginTop: token('space.0'),
	},

	separator: {
		borderLeftWidth: token('border.width'),
		borderLeftColor: token('color.border'),
		borderLeftStyle: 'solid',
		marginInlineStart: token('space.050'),
		marginInlineEnd: token('space.100'),
		height: '24px',
		display: 'inline-block',
	},

	hoverableReactionPickerSelectorContainer: {
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
		gap: token('space.050'),
	},
});

const revealAnimation = keyframes({
	'0%': {
		opacity: 1,
		transform: 'scale(0.5)',
	},
	'75%': {
		transform: 'scale(1.25)',
	},
	'100%': {
		opacity: 1,
		transform: 'scale(1)',
	},
});

const revealStyle = css({
	animationName: revealAnimation,
	animationDuration: '150ms',
	animationTimingFunction: 'ease-in-out',
	animationFillMode: 'forwards',
	opacity: 0,
});

/**
 * Test id for wrapper Selector div
 */
export const RENDER_SELECTOR_TESTID = 'render-selector';

export interface SelectorProps {
	/**
	 * Provider for loading emojis
	 */
	emojiProvider: Promise<EmojiProvider>;
	/**
	 * Optional prop for hoverable reaction picker selector
	 */
	hoverableReactionPickerSelector?: boolean;
	/**
	 * Optional event when extra custom emojis icon is selected
	 */
	onMoreClick?: React.MouseEventHandler<HTMLElement>;
	/**
	 * Event handler when an emoji gets selected
	 */
	onSelection: OnEmojiEvent;
	/**
	 * Optional emojis shown for user to select from when the reaction add button is clicked (defaults to pre-defined list of emojis {@link DefaultReactions})
	 */
	pickerQuickReactionEmojiIds?: EmojiId[];
	/**
	 * Enable/Disable selection of extra custom emoji beyond default list (defaults to false)
	 */
	showMore?: boolean;
}

type RevealProps = {
	children: React.ReactNode;
	testId?: string;
};

const Reveal = ({ children, testId }: RevealProps) => {
	return (
		<Box
			as={
				expValEquals('platform_a11y_fixes_reactions_selector_list', 'isEnabled', true)
					? undefined
					: 'li'
			}
			xcss={styles.emojiContainer}
		>
			<div data-testid={testId} css={revealStyle}>
				{children}
			</div>
		</Box>
	);
};

/**
 * Reactions picker panel part of the <ReactionPicker /> component
 */
export const Selector = ({
	emojiProvider,
	onMoreClick,
	onSelection,
	showMore,
	pickerQuickReactionEmojiIds,
	hoverableReactionPickerSelector = false,
}: SelectorProps): JSX.Element => {
	const [isTeamojiPickerRefreshEnabled, setIsTeamojiPickerRefreshEnabled] = useState(false);

	useEffect(() => {
		setIsTeamojiPickerRefreshEnabled(
			expValEquals('platform_teamoji_26_refresh_emoji_picker', 'isEnabled', true),
		);
	}, []);

	const quickReactionEmojiIds =
		pickerQuickReactionEmojiIds ?? getDefaultReactions(isTeamojiPickerRefreshEnabled);

	/**
	 * Render the default emoji icon
	 * @param emoji emoji item
	 * @param index location of the emoji in the array
	 */
	const renderEmoji = (emoji: EmojiId, index: number) => {
		const emojiButtonAndTooltip = (
			<Tooltip key={emoji.id ?? emoji.shortName} content={emoji.shortName}>
				<EmojiButton
					emojiId={emoji}
					emojiProvider={emojiProvider}
					onClick={onSelection}
					hoverableReactionPickerSelectorEmoji={hoverableReactionPickerSelector}
				/>
			</Tooltip>
		);

		return hoverableReactionPickerSelector ? (
			emojiButtonAndTooltip
		) : (
			<Reveal key={emoji.id ?? emoji.shortName} testId={RENDER_SELECTOR_TESTID}>
				{emojiButtonAndTooltip}
			</Reveal>
		);
	};

	if (hoverableReactionPickerSelector) {
		return (
			<Box xcss={styles.hoverableReactionPickerSelectorContainer}>
				<Trigger
					tooltipContent={messages.addReaction.defaultMessage}
					onClick={onMoreClick}
					showAddReactionText
					reactionPickerTriggerText={messages.addNewReaction.defaultMessage}
					fullWidthSelectorTrayReactionPickerTrigger
				/>
				<Inline
					alignBlock="center"
					xcss={
						hoverableReactionPickerSelector
							? styles.hoverableReactionPickerSelectorContainer
							: styles.container
					}
				>
					{quickReactionEmojiIds.map(renderEmoji)}
				</Inline>
			</Box>
		);
	}

	const isSelectorListMarkupFixEnabled = expValEquals(
		'platform_a11y_fixes_reactions_selector_list',
		'isEnabled',
		true,
	);

	return (
		<Inline
			alignBlock="center"
			xcss={styles.container}
			as={isSelectorListMarkupFixEnabled ? undefined : 'ul'}
			role={isSelectorListMarkupFixEnabled ? 'group' : undefined}
			aria-label={
				isSelectorListMarkupFixEnabled ? messages.popperWrapperLabel.defaultMessage : undefined
			}
		>
			{quickReactionEmojiIds.map(renderEmoji)}
			{showMore ? (
				<Fragment>
					<Box
						as={isSelectorListMarkupFixEnabled ? undefined : 'li'}
						xcss={styles.separator}
						aria-hidden={isSelectorListMarkupFixEnabled ? true : undefined}
					/>
					<Reveal>
						<ShowMore key="more" onClick={onMoreClick} />
					</Reveal>
				</Fragment>
			) : null}
		</Inline>
	);
};
