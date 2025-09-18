/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type MouseEvent, memo, forwardRef } from 'react';
import { css, cssMap, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { B100 } from '@atlaskit/theme/colors';
import type { EmojiDescription } from '../../types';
import { leftClick } from '../../util/mouse';
import Emoji from './Emoji';
import { TONESELECTOR_KEYBOARD_KEYS_SUPPORTED } from '../../util/constants';
import VisuallyHidden from '@atlaskit/visually-hidden';

const emojiButton = css({
	backgroundColor: 'transparent',
	border: '0',
	borderRadius: token('radius.small', '3px'),
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

const emojiRadio = cssMap({
	default: {
		opacity: 0,
		position: 'absolute',
		top: '-10px',
		left: '-10px',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'+span': {
			borderRadius: token('radius.small', '3px'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:focus + span': {
			boxShadow: `0 0 0 2px ${token('color.border.focused', B100)}`,
			transitionDuration: '0s, 0.2s',
			outline: 'none',
		},
	},
});

export interface Props {
	ariaLabelText?: string;
	defaultChecked?: boolean;
	emoji: EmojiDescription;
	onSelected?: () => void;
	selectOnHover?: boolean;
}

const handleMouseDown = (props: Props, event: MouseEvent<any>) => {
	const { onSelected } = props;
	event.preventDefault();
	if (onSelected && leftClick(event)) {
		onSelected();
	}
};

const handleKeyPress = (props: Props, event: React.KeyboardEvent<HTMLLabelElement>) => {
	if (TONESELECTOR_KEYBOARD_KEYS_SUPPORTED.includes(event.key)) {
		const { onSelected } = props;

		event.preventDefault();
		event.stopPropagation();
		if (onSelected) {
			onSelected();
		}
	}
};

export const EmojiRadioButton = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
	const { emoji, selectOnHover, ariaLabelText, defaultChecked } = props;

	return (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
		<label
			css={emojiButton}
			onMouseDown={(event) => handleMouseDown(props, event)}
			onKeyDown={(event) => handleKeyPress(props, event)}
		>
			<VisuallyHidden>{ariaLabelText}</VisuallyHidden>
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-radio */}
			<input
				ref={ref}
				data-testid={ariaLabelText}
				type="radio"
				name="skin-tone"
				css={emojiRadio.default}
				defaultChecked={defaultChecked}
			/>
			<Emoji
				emoji={emoji}
				selectOnHover={selectOnHover}
				shouldBeInteractive={false}
				aria-hidden={true}
			/>
		</label>
	);
});

export default memo(EmojiRadioButton);
