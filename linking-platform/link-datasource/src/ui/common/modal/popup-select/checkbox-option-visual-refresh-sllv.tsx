/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { type OptionProps } from '@atlaskit/react-select';
import { CheckboxOption } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import type { SelectOption } from './types';

const checkboxStyles = css({
	boxShadow: 'none',
	backgroundColor: token('color.background.input'),
	paddingBlockStart: token('space.050'),
	paddingBlockEnd: token('space.050'),
	paddingInlineStart: token('space.200'),
	paddingInlineEnd: token('space.200'),
	borderWidth: '2px',
	borderStyle: 'solid',
	borderColor: 'transparent',
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed'),
	},
});

const checkboxSelectedStyles = css({
	backgroundColor: token('color.background.selected'),
	'&:hover': {
		backgroundColor: token('color.background.selected.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.selected.pressed'),
	},
});

const checkboxFocusedStyles = css({
	borderColor: token('color.border.focused'),
});

export const CheckboxOptionVisualRefreshSllv = ({
	children,
	...props
}: OptionProps<SelectOption, true>) => {
	return (
		<CheckboxOption
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
			css={[
				checkboxStyles,
				props.isSelected && checkboxSelectedStyles,
				props.isFocused && checkboxFocusedStyles,
			]}
			{...props}
		>
			{children}
		</CheckboxOption>
	);
};
