/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type ReactNode, type RefCallback } from 'react';

import CompiledOption, { optionCSS as compiledOptionCSS } from '../compiled/components/option';
import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../types';

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

export const optionCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: OptionProps<Option, IsMulti, Group>,
): CSSObjectWithLabel => compiledOptionCSS();

const Option = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: OptionProps<Option, IsMulti, Group>,
) => <CompiledOption {...props} />;

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Option;
