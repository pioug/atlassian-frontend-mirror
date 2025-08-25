/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo } from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { B100 } from '@atlaskit/theme/colors';
import type { EmojiDescription } from '../../types';
import Emoji from './Emoji';

export const tonePreviewTestId = 'tone-preview';

const emojiButton = css({
	backgroundColor: 'transparent',
	border: '0',
	borderRadius: token('border.radius.100', '3px'),
	cursor: 'pointer',
	padding: 0,
	position: 'relative',
	display: 'inline-block',

	/* Firefox */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-moz-focus-inner': {
		borderWidth: 0,
		borderStyle: 'none',
		padding: 0,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&>span': {
		paddingTop: token('space.075', '6px'),
		paddingBottom: token('space.075', '6px'),
		paddingLeft: token('space.075', '6px'),
		paddingRight: token('space.075', '6px'),

		// Scale sprite to fit regardless of default emoji size
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&>.emoji-common-emoji-sprite': {
			height: '24px',
			width: '24px',
		},
		// Scale image to fit regardless of default emoji size
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&>img': {
			height: '24px',
			width: '24px',
		},
	},

	'&:focus': {
		boxShadow: `0 0 0 2px ${token('color.border.focused', B100)}`,
		transitionDuration: '0s, 0.2s',
		outline: 'none',
	},
});

const hidden = css({
	opacity: 0,
	visibility: 'hidden',
	display: 'none',
});

export interface Props {
	ariaExpanded?: boolean;
	ariaLabelText?: string;
	emoji: EmojiDescription;
	isVisible?: boolean;
	onSelected?: () => void;
	selectOnHover?: boolean;
}

export const TonePreviewButton = forwardRef<HTMLButtonElement, Props>((props: Props, ref) => {
	const { emoji, selectOnHover, ariaLabelText, ariaExpanded, onSelected, isVisible = true } = props;

	return (
		<button
			ref={ref}
			css={[emojiButton, !isVisible && hidden]}
			onClick={onSelected}
			aria-label={ariaLabelText}
			aria-expanded={ariaExpanded}
			aria-controls="emoji-picker-tone-selector"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ overflow: 'hidden' }}
			data-testid={tonePreviewTestId}
			type="button"
		>
			<Emoji
				emoji={emoji}
				selectOnHover={selectOnHover}
				shouldBeInteractive={false}
				aria-hidden={true}
			/>
		</button>
	);
});

export default memo(TonePreviewButton);
