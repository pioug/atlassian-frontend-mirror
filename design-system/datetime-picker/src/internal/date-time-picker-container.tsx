/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { forwardRef } from 'react';

import { css, jsx } from '@emotion/react';

import { B100, N0, N100, N20, N30, R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type Appearance } from '../types';

const isInvalidBorderStyles = css({
	borderColor: token('color.border.danger', R400),
});
const isFocusedBorderStyles = css({
	borderColor: token('color.border.focused', B100),
	boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.focused', B100)}`,
});

const isFocusedStyles = css({
	backgroundColor: token('color.background.input.pressed', N0),
});

const subtleBgStyles = css({
	backgroundColor: 'transparent',
	borderColor: 'transparent',
});

const subtleFocusedBgStyles = css({
	backgroundColor: token('color.background.input.pressed', 'transparent'),
	borderColor: 'transparent',
});

const noBgStyles = css({
	backgroundColor: 'transparent',
	borderColor: 'transparent',
	'&:hover': {
		backgroundColor: 'transparent',
		borderColor: 'transparent',
	},
});

const hoverStyles = css({
	'&:hover': {
		backgroundColor: token('color.background.input.hovered', N30),
		borderColor: token('color.border.input', N100),
	},
});

const isInvalidHoverStyles = css({
	'&:hover': {
		backgroundColor: token('color.background.input.hovered', N0),
		borderColor: token('color.border.danger', R400),
	},
});

const isDisabledStyles = css({
	backgroundColor: token('color.background.disabled'),
	borderColor: token('color.border.disabled'),
	'&:hover': {
		cursor: 'default',
	},
});

const newBorderStyles = css({
	border: `${token('border.width', '1px')} solid ${token('color.border.input', N100)}`,
});

const baseContainerStyles = css({
	display: 'flex',
	backgroundColor: token('color.background.input', N20),
	border: `2px solid ${token('color.border.input', N20)}`,
	borderRadius: token('border.radius', '3px'),
	transition: 'background-color 200ms ease-in-out, border-color 200ms ease-in-out',
	'&:hover': {
		cursor: 'pointer',
	},
});

type DateTimePickerContainerProps = {
	children?: React.ReactNode;
	isDisabled: boolean;
	isFocused: boolean;
	appearance: Appearance;
	isInvalid: boolean;
	innerProps: React.AllHTMLAttributes<HTMLElement>;
	testId?: string;
};

/**
 * This is the container for the datetime picker component.
 */
export const DateTimePickerContainer = forwardRef<HTMLDivElement, DateTimePickerContainerProps>(
	({ children, isDisabled, isFocused, appearance, isInvalid, innerProps, testId }, ref) => {
		const notFocusedOrIsDisabled = !(isFocused || isDisabled);

		// we cannot use Box or Flex primitives because these do not allow ...innerProps to be passed
		return (
			<div
				css={[
					baseContainerStyles,
					newBorderStyles,
					isDisabled && isDisabledStyles,
					isFocused && isFocusedStyles,
					appearance === 'subtle' && (isFocused ? subtleFocusedBgStyles : subtleBgStyles),
					isFocused && isFocusedBorderStyles,
					isInvalid && isInvalidBorderStyles,
					notFocusedOrIsDisabled && (isInvalid ? isInvalidHoverStyles : hoverStyles),
					appearance === 'none' && noBgStyles,
				]}
				{...innerProps}
				data-testid={testId}
				ref={ref}
			>
				{children}
			</div>
		);
	},
);
