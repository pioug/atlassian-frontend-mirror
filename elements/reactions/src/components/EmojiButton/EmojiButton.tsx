/** @jsx jsx */
import React from 'react';
import { useIntl } from 'react-intl-next';
import { jsx } from '@emotion/react';
import {
	type EmojiId,
	type OnEmojiEvent,
	type EmojiProvider,
	ResourcedEmoji,
} from '@atlaskit/emoji';
import { messages } from '../../shared/i18n';
import { isLeftClick } from '../../shared/utils';
import { emojiButtonStyle } from './styles';

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
		<button
			data-testid={RENDER_BUTTON_TESTID}
			onClick={onButtonClick}
			aria-label={intl.formatMessage(messages.reactWithEmoji, {
				emoji: emojiId.shortName,
			})}
			type="button"
			css={emojiButtonStyle}
		>
			<ResourcedEmoji emojiProvider={emojiProvider} emojiId={emojiId} />
		</button>
	);
};
