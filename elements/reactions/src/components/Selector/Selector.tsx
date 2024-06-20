/** @jsx jsx */
import React, { Fragment, useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type EmojiId, type OnEmojiEvent } from '@atlaskit/emoji/types';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';
import { DefaultReactions } from '../../shared/constants';
import { EmojiButton } from '../EmojiButton';
import { ShowMore } from '../ShowMore';
import { emojiStyle, revealStyle } from './styles';

/**
 * Test id for wrapper Selector div
 */
export const RENDER_SELECTOR_TESTID = 'render-selector';

/**
 * Delay for each emoji reveal animation, in ms
 */
const REVEAL_DELAY = 50;

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
	delay: number;
};

const Reveal = ({ children, delay }: RevealProps) => {
	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
			css={revealStyle}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={delay ? { animationDelay: `${delay}ms` } : undefined}
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
	const [selection, setSelection] = useState<EmojiId>();
	/**
	 * Collection of global DOM timeout ids when user selects emojis for animation display
	 */
	const timeoutIds = useRef<Array<number>>([]);

	/**
	 * Clear the timeouts for the selected emojis when the component unmounts
	 */
	useEffect(() => {
		const timeoutValues = timeoutIds.current;
		return function cleanup() {
			timeoutValues.forEach(clearTimeout);
		};
	}, []);

	/**
	 * event handler when an emoji gets selected
	 * @param item selected emoji
	 * @param description depth detail of the selected emoji
	 * @param event Dom event data
	 */
	const onSelected: OnEmojiEvent = (item, description, event) => {
		timeoutIds.current.push(
			window.setTimeout(() => {
				onSelection(item, description, event);
			}, 250),
		);
		setSelection(item);
	};

	/**
	 * Render the default emoji icon
	 * @param emoji emoji item
	 * @param index location of the emoji in the array
	 */
	const renderEmoji = (emoji: EmojiId, index: number) => {
		return (
			<Reveal delay={index * REVEAL_DELAY} key={emoji.id ?? emoji.shortName}>
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={emoji === selection ? 'selected' : undefined}
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					css={emojiStyle}
					data-testid={RENDER_SELECTOR_TESTID}
				>
					<Tooltip content={emoji.shortName}>
						<EmojiButton emojiId={emoji} emojiProvider={emojiProvider} onClick={onSelected} />
					</Tooltip>
				</div>
			</Reveal>
		);
	};

	return (
		<Inline alignBlock="center" xcss={containerStyles}>
			{pickerQuickReactionEmojiIds ? pickerQuickReactionEmojiIds.map(renderEmoji) : null}
			{showMore ? (
				<Fragment>
					<Box xcss={separatorStyles} />
					<Reveal delay={DefaultReactions.length * REVEAL_DELAY}>
						<ShowMore key="more" onClick={onMoreClick} />
					</Reveal>
				</Fragment>
			) : null}
		</Inline>
	);
};
