/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { memo, forwardRef } from 'react';
import { css, cssMap, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import type { EmojiDescription } from '../../types';
import Emoji from './Emoji';
import { TONESELECTOR_KEYBOARD_KEYS_SUPPORTED } from '../../util/constants';
import VisuallyHidden from '@atlaskit/visually-hidden';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

const emojiButton = css({
	backgroundColor: 'transparent',
	border: '0',
	borderRadius: token('radius.small', '3px'),
	cursor: 'pointer',
	padding: 0,
	position: 'relative',
	display: 'inline-block',

	// Firefox
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-moz-focus-inner': {
		borderWidth: 0,
		borderStyle: 'none',
		padding: 0,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&>span': {
		paddingTop: token('space.075'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.075'),
		paddingRight: token('space.075'),

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
			boxShadow: `0 0 0 2px ${token('color.border.focused')}`,
			transitionDuration: '0s, 0.2s',
			outline: 'none',
		},
	},
});

export interface Props {
	ariaLabelText?: string;
	defaultChecked?: boolean;
	emoji: EmojiDescription;
	onArrowKey?: (direction: -1 | 1) => void;
	onSelected?: () => void;
	selectOnHover?: boolean;
}

const handleKeyDown = (props: Props, event: React.KeyboardEvent) => {
	if (
		(event.key === 'ArrowLeft' || event.key === 'ArrowRight') &&
		expValEqualsNoExposure('platform_teamoji_26_refresh_emoji_picker', 'isEnabled', true)
	) {
		event.preventDefault();
		event.stopPropagation();
		props.onArrowKey?.(event.key === 'ArrowRight' ? 1 : -1);
		return;
	}

	if (TONESELECTOR_KEYBOARD_KEYS_SUPPORTED.includes(event.key)) {
		const { onSelected } = props;

		event.preventDefault();
		event.stopPropagation();
		if (onSelected) {
			onSelected();
		}
	}
};

export const EmojiRadioButton: React.ForwardRefExoticComponent<
	Props & React.RefAttributes<HTMLInputElement>
> = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
	const { emoji, selectOnHover, ariaLabelText, defaultChecked } = props;
	const fitToHeight = expValEqualsNoExposure('platform_use_unicode_emojis', 'isEnabled', true)
		? 24
		: undefined;

	return (
		<label css={emojiButton}>
			<VisuallyHidden>{ariaLabelText}</VisuallyHidden>
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-radio */}
			<input
				ref={ref}
				data-testid={ariaLabelText}
				type="radio"
				name="skin-tone"
				css={emojiRadio.default}
				defaultChecked={defaultChecked}
				onClick={() => props.onSelected?.()}
				onKeyDown={(event) => handleKeyDown(props, event)}
				onChange={
					expValEqualsNoExposure('platform_teamoji_26_refresh_emoji_picker', 'isEnabled', true)
						? (e) => e.preventDefault()
						: undefined
				}
			/>
			<Emoji
				emoji={emoji}
				selectOnHover={selectOnHover}
				shouldBeInteractive={false}
				aria-hidden={true}
				fitToHeight={fitToHeight}
			/>
		</label>
	);
});

const _default_1: React.MemoExoticComponent<
	React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLInputElement>>
> = memo(EmojiRadioButton);
export default _default_1;
