/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { forwardRef } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { type Appearance } from '../types';

const isInvalidBorderStyles = css({
	borderColor: token('color.border.danger'),
});

const isFocusedBorderStyles = css({
	borderColor: token('color.border.focused'),
	boxShadow: `inset 0 0 0 ${token('border.width')} ${token('color.border.focused')}`,
});
const isFocusedStyles = css({
	backgroundColor: token('color.background.input.pressed'),
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
		backgroundColor: token('color.background.input.hovered'),
		borderColor: token('color.border.input'),
	},
});
const isInvalidHoverStyles = css({
	'&:hover': {
		backgroundColor: token('color.background.input.hovered'),
		borderColor: token('color.border.danger'),
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
	border: `${token('border.width', '1px')} solid ${token('color.border.input')}`,
});
const baseContainerStyles = css({
	display: 'flex',
	backgroundColor: token('color.background.input'),
	borderRadius: token('radius.small'),
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
export const DateTimePickerContainer: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<DateTimePickerContainerProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, DateTimePickerContainerProps>(
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
					appearance === 'subtle' && isFocused && subtleFocusedBgStyles,
					appearance === 'subtle' && !isFocused && subtleBgStyles,
					isFocused && isFocusedBorderStyles,
					isInvalid && isInvalidBorderStyles,
					notFocusedOrIsDisabled && isInvalid && isInvalidHoverStyles,
					notFocusedOrIsDisabled && !isInvalid && hoverStyles,
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
