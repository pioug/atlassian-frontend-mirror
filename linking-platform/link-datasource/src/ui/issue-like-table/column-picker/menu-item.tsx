/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import DragHandleVerticalIcon from '@atlaskit/icon/core/drag-handle-vertical';
import { Box } from '@atlaskit/primitives/compiled/box';
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

const listItemWithDragHandleStyles = css({
	paddingInlineStart: token('space.500'),
});

const dragHandleStyles = cssMap({
	container: {
		position: 'relative',
	},
	// Sits over the option's leading padding as a sibling, so clicking it doesn't toggle the option
	handle: {
		display: 'flex',
		position: 'absolute',
		alignItems: 'center',
		cursor: 'grab',
		insetBlockEnd: token('space.0'),
		insetBlockStart: token('space.0'),
		insetInlineStart: token('space.200'),
	},
});

export const ReorderableMenuItem = ({
	children,
	...props
}: OptionProps<OptionType, true>): JSX.Element => {
	if (!props.isSelected) {
		return (
			<CheckboxOption css={listItemStyles} {...props}>
				{children}
			</CheckboxOption>
		);
	}

	return (
		<Box xcss={dragHandleStyles.container}>
			<Box as="span" xcss={dragHandleStyles.handle} testId="column-picker-drag-handle">
				<DragHandleVerticalIcon label="" color={token('color.icon.subtle')} />
			</Box>
			<CheckboxOption css={[listItemStyles, listItemWithDragHandleStyles]} {...props}>
				{children}
			</CheckboxOption>
		</Box>
	);
};

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
