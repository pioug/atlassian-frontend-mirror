/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useIntl } from 'react-intl-next';
import {
	type EmojiId,
	type OnEmojiEvent,
	type EmojiProvider,
	ResourcedEmoji,
} from '@atlaskit/emoji';
import { messages } from '../shared/i18n';
import { isLeftClick } from '../shared/utils';
import { Pressable } from '@atlaskit/primitives/compiled';
import { cssMap, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	emojiButton: {
		outline: 'none',
		display: 'flex',
		backgroundColor: token('color.background.neutral.subtle'),
		borderWidth: '0',
		borderRadius: token('border.radius'),
		marginTop: token('space.0'),
		marginRight: token('space.0'),
		marginBottom: token('space.0'),
		marginLeft: token('space.0'),
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),

		'&:hover': {
			transition: 'transform cubic-bezier(0.23, 1, 0.32, 1) 200ms',
			transform: 'scale(1.33)',
		},
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
			xcss={styles.emojiButton}
		>
			<ResourcedEmoji emojiProvider={emojiProvider} emojiId={emojiId} />
		</Pressable>
	);
};
