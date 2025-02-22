/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type EmojiId, type OnEmojiEvent } from '@atlaskit/emoji/types';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';
import { DefaultReactions } from '../../shared/constants';
import { EmojiButton } from '../EmojiButton';
import { ShowMore } from '../ShowMore';
import { revealStyle } from './styles';

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
	 * Event handler when an emoji gets selected
	 */
	onSelection: OnEmojiEvent;
	/**
	 * Enable/Disable selection of extra custom emoji beyond default list (defaults to false)
	 */
	showMore?: boolean;
	/**
	 * Optional event when extra custom emojis icon is selected
	 */
	onMoreClick?: React.MouseEventHandler<HTMLElement>;
	/**
	 * Optional emojis shown for user to select from when the reaction add button is clicked (defaults to pre-defined list of emojis {@link DefaultReactions})
	 */
	pickerQuickReactionEmojiIds?: EmojiId[];
}

const containerStyles = xcss({
	padding: 'space.050',
});

const separatorStyles = xcss({
	borderLeftColor: 'color.border',
	borderLeftStyle: 'solid',
	borderLeftWidth: 'border.width',
	marginInlineStart: 'space.050',
	marginInlineEnd: 'space.100',
	height: '24px',
	display: 'inline-block',
});

type RevealProps = {
	children: React.ReactNode;
	testId?: string;
};

const Reveal = ({ children, testId }: RevealProps) => {
	return (
		<div
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
			css={revealStyle}
		>
			{children}
		</div>
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
	pickerQuickReactionEmojiIds = DefaultReactions,
}: SelectorProps) => {
	/**
	 * Render the default emoji icon
	 * @param emoji emoji item
	 * @param index location of the emoji in the array
	 */
	const renderEmoji = (emoji: EmojiId, index: number) => {
		return (
			<Reveal key={emoji.id ?? emoji.shortName} testId={RENDER_SELECTOR_TESTID}>
				<Tooltip content={emoji.shortName}>
					<EmojiButton emojiId={emoji} emojiProvider={emojiProvider} onClick={onSelection} />
				</Tooltip>
			</Reveal>
		);
	};

	return (
		<Inline alignBlock="center" xcss={containerStyles}>
			{pickerQuickReactionEmojiIds ? pickerQuickReactionEmojiIds.map(renderEmoji) : null}
			{showMore ? (
				<Fragment>
					<Box xcss={separatorStyles} />
					<Reveal>
						<ShowMore key="more" onClick={onMoreClick} />
					</Reveal>
				</Fragment>
			) : null}
		</Inline>
	);
};
