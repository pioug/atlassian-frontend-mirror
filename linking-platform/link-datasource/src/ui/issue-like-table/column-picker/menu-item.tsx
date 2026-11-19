/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { CheckboxOption } from '@atlaskit/select/checkbox-option';
import type { OptionProps, OptionType } from '@atlaskit/select/types';
import { token } from '@atlaskit/tokens';

const listItemStylesFocusedSelected = css({
	backgroundColor: token('color.background.selected.hovered'),
});

const listItemStylesSelected = css({
	backgroundColor: token('color.background.selected'),
	'&:hover': {
		backgroundColor: token('color.background.selected.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.selected.pressed'),
	},
});

const listItemStyles = css({
	'&:hover': {
		backgroundColor: token('color.background.neutral.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.neutral.pressed'),
	},
});

export const MenuItem = ({ children, ...props }: OptionProps<OptionType, true>): JSX.Element => {
	return (
		<CheckboxOption
			css={[
				props.isSelected ? listItemStylesSelected : listItemStyles,
				props.isSelected && props.isFocused && listItemStylesFocusedSelected,
			]}
			{...props}
		>
			{children}
		</CheckboxOption>
	);
};
