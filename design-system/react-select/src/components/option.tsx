/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, type RefCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../types';
import { getStyleProps } from '../utils';

export interface OptionProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * Inner ref to DOM Node
	 */
	innerRef: RefCallback<HTMLDivElement>;
	/**
	 * props passed to the wrapping element for the group.
	 */
	innerProps: JSX.IntrinsicElements['div'];
	/**
	 * Text to be displayed representing the option.
	 */
	label: string;
	/**
	 * Type is used by the menu to determine whether this is an option or a group.
	 * In the case of option this is always `option`. *
	 */
	type: 'option';
	/**
	 * The data of the selected option.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Option;
	/**
	 * Whether the option is disabled.
	 */
	isDisabled: boolean;
	/**
	 * Whether the option is focused.
	 */
	isFocused: boolean;
	/**
	 * Whether the option is selected.
	 */
	isSelected: boolean;
}

export const optionCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	isDisabled,
	isFocused,
	isSelected,
}: OptionProps<Option, IsMulti, Group>): CSSObjectWithLabel => {
	let color: string = token('color.text');
	if (isDisabled) {
		color = token('color.text.disabled');
	} else if (isSelected) {
		color = token('color.text.selected');
	}

	let boxShadow;
	let backgroundColor;
	if (isDisabled) {
		backgroundColor = undefined;
	} else if (isSelected && isFocused) {
		backgroundColor = token('color.background.selected.hovered');
	} else if (isSelected) {
		backgroundColor = token('color.background.selected');
	} else if (isFocused) {
		backgroundColor = token('color.background.neutral.subtle.hovered');
	}
	if (!isDisabled && (isFocused || isSelected)) {
		boxShadow = `inset 2px 0px 0px ${token('color.border.selected')}`;
	}

	const cursor = isDisabled ? 'not-allowed' : 'default';

	return {
		label: 'option',
		display: 'block',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: 'inherit',
		width: '100%',
		userSelect: 'none',
		WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
		padding: `${token('space.075')} ${token('space.150')}`,
		backgroundColor,
		color,
		cursor,
		boxShadow,
		':active': {
			backgroundColor: !isDisabled
				? isSelected
					? token('color.background.selected.pressed')
					: token('color.background.neutral.subtle.pressed')
				: undefined,
		},
		'@media screen and (-ms-high-contrast: active)': {
			borderLeft: !isDisabled && (isFocused || isSelected) ? '2px solid transparent' : '',
		},
	};
};

const Option = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: OptionProps<Option, IsMulti, Group>,
) => {
	const { children, isDisabled, isFocused, isSelected, innerRef, innerProps } = props;

	return (
		<div
			{...getStyleProps(props, 'option', {
				option: true,
				'option--is-disabled': isDisabled,
				'option--is-focused': isFocused,
				'option--is-selected': isSelected,
			})}
			ref={innerRef}
			{...innerProps}
			tabIndex={-1}
		>
			{children}
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Option;
