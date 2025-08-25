/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { useIntl } from 'react-intl-next';
import type { EmojiDescription, OnEmojiEvent } from '../../types';
import CachingEmoji from '../common/CachingEmoji';
import type { VirtualItem as VirtualItemContext } from '@tanstack/react-virtual';
import { useEmojiPickerListContext } from '../../hooks/useEmojiPickerListContext';
import type { CategoryGroupKey } from './categories';
import { messages } from '../i18n';

const emojiItem = css({
	display: 'inline-block',
	textAlign: 'center',
	width: '40px',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& .emoji-common-node': {
		cursor: 'pointer',
		paddingTop: token('space.100', '8px'),
		paddingRight: token('space.100', '8px'),
		paddingBottom: token('space.100', '8px'),
		paddingLeft: token('space.100', '8px'),
		borderRadius: '5px',
		width: '24px',
		height: '24px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& .emoji-common-placeholder': {
		paddingTop: token('space.0', '0px'),
		paddingRight: token('space.0', '0px'),
		paddingBottom: token('space.0', '0px'),
		paddingLeft: token('space.0', '0px'),
		marginTop: token('space.100', '8px'),
		marginRight: token('space.100', '8px'),
		marginBottom: token('space.100', '8px'),
		marginLeft: token('space.100', '8px'),
		minWidth: '24px',
		maxWidth: '24px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& .emoji-common-node .emoji-common-placeholder': {
		marginTop: token('space.0', '0px'),
		marginRight: token('space.0', '0px'),
		marginBottom: token('space.0', '0px'),
		marginLeft: token('space.0', '0px'),
	},
	// Fit non-square emoji to square
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& .emoji-common-node > img': {
		position: 'relative',
		left: '50%',
		top: '50%',
		transform: 'translateX(-50%) translateY(-50%)',
		maxHeight: '24px',
		maxWidth: '24px',
		display: 'block',
	},
	// Scale sprite to fit regardless of default emoji size
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& .emoji-common-node > .emoji-common-emoji-sprite': {
		height: '24px',
		width: '24px',
	},
});

const emojiPickerRow = css({
	marginLeft: token('space.100', '8px'),
});

export interface Props {
	category: CategoryGroupKey;
	emojis: EmojiDescription[];
	onDelete?: OnEmojiEvent;
	onFocus?: OnEmojiEvent;
	onMouseMove?: OnEmojiEvent;
	onSelected?: OnEmojiEvent;
	showDelete: boolean;
	title: string;
	virtualItemContext?: VirtualItemContext;
}

const EmojiPickerEmojiRow = ({
	emojis,
	onSelected,
	onMouseMove,
	onFocus,
	title,
	showDelete,
	onDelete,
	virtualItemContext,
}: Props) => {
	const { currentEmojisFocus, setEmojisFocus } = useEmojiPickerListContext();
	const rowIndex = virtualItemContext?.index || 0;
	const { formatMessage } = useIntl();
	const handleFocus: (index: number) => OnEmojiEvent<HTMLSpanElement> =
		(index) => (emojiId, emoji, event) => {
			setEmojisFocus({
				rowIndex,
				columnIndex: index,
			});
			onFocus && onFocus(emojiId, emoji, event);
		};
	return (
		<div css={emojiPickerRow} role="presentation">
			{emojis.map((emoji, index) => {
				const { shortName, id } = emoji;
				const key = id ? `${id}-${title}` : `${shortName}-${title}`;
				const focus =
					currentEmojisFocus.rowIndex === rowIndex && currentEmojisFocus.columnIndex === index;
				return (
					<span
						css={emojiItem}
						key={key}
						role="gridcell"
						aria-colindex={index + 1} // aria-colindex is 1 based
					>
						<CachingEmoji
							emoji={emoji}
							selectOnHover={true}
							onSelected={onSelected}
							onMouseMove={onMouseMove}
							onFocus={handleFocus(index)}
							showDelete={showDelete}
							onDelete={onDelete}
							placeholderSize={24}
							data-focus-index={`${rowIndex}-${index}`}
							tabIndex={focus ? 0 : -1}
							aria-roledescription={formatMessage(messages.emojiButtonRoleDescription)}
							shouldBeInteractive
						/>
					</span>
				);
			})}
		</div>
	);
};

export default memo(EmojiPickerEmojiRow);
