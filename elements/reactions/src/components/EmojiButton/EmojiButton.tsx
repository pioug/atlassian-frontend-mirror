/** @jsx jsx */
import React from 'react';
import { useIntl } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import {
	type EmojiId,
	type OnEmojiEvent,
	type EmojiProvider,
	ResourcedEmoji,
} from '@atlaskit/emoji';
import { Pressable, xcss } from '@atlaskit/primitives';
import { messages } from '../../shared/i18n';
import { isLeftClick } from '../../shared/utils';

const emojiButtonStyles = xcss({
	outline: 'none',
	display: 'flex',
	backgroundColor: 'color.background.neutral.subtle',
	border: 0,
	borderRadius: 'border.radius',
	margin: 'space.0',
	padding: 'space.100',

	// @ts-expect-error - Nested selectors not supported in XCSS
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	':hover > span': {
		transition: 'transform cubic-bezier(0.23, 1, 0.32, 1) 200ms',
		transform: 'scale(1.33)',
	},
});

export const RENDER_BUTTON_TESTID = 'button-emoji-id';

export interface EmojiButtonProps {
	/**
	 * identifier info for a given emoji
	 */
	emojiId: EmojiId;
	/**
	 * Async provider to fetch the emoji
	 */
	emojiProvider: Promise<EmojiProvider>;
	/**
	 * Event handler when a new emoji is selected
	 */
	onClick: OnEmojiEvent;
}

/**
 * custom button to render the custom emoji selector inside the reaction picker
 */
export const EmojiButton = ({ emojiId, onClick, emojiProvider }: EmojiButtonProps) => {
	const onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (onClick && isLeftClick(event)) {
			onClick(emojiId, undefined, event);
		}
	};

	const intl = useIntl();

	return (
		<Pressable
			testId={RENDER_BUTTON_TESTID}
			onClick={onButtonClick}
			aria-label={intl.formatMessage(messages.reactWithEmoji, {
				emoji: emojiId.shortName,
			})}
			xcss={emojiButtonStyles}
		>
			<ResourcedEmoji emojiProvider={emojiProvider} emojiId={emojiId} />
		</Pressable>
	);
};
