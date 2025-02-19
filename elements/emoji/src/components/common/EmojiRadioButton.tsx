/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type MouseEvent, memo, forwardRef } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { EmojiDescription } from '../../types';
import { leftClick } from '../../util/mouse';
import { emojiButton, emojiRadio } from './styles';
import Emoji from './Emoji';
import { TONESELECTOR_KEYBOARD_KEYS_SUPPORTED } from '../../util/constants';
import VisuallyHidden from '@atlaskit/visually-hidden';

export interface Props {
	emoji: EmojiDescription;
	onSelected?: () => void;
	selectOnHover?: boolean;
	ariaLabelText?: string;
	defaultChecked?: boolean;
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
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={emojiButton}
			onMouseDown={(event) => handleMouseDown(props, event)}
			onKeyDown={(event) => handleKeyPress(props, event)}
		>
			<VisuallyHidden>{ariaLabelText}</VisuallyHidden>
			<input
				ref={ref}
				data-testid={ariaLabelText}
				type="radio"
				name="skin-tone"
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={emojiRadio}
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
