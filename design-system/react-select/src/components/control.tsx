/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type ReactNode, type Ref } from 'react';

import Compiled, { css as compiledCSS } from '../compiled/components/control';
import { type CommonPropsAndClassName, type GroupBase } from '../types';

export interface ControlProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * Children to render.
	 */
	children: ReactNode;
	innerRef: Ref<HTMLDivElement>;
	/**
	 * The mouse down event and the innerRef to pass down to the controller element.
	 */
	innerProps: {};
	/**
	 * Whether the select is disabled.
	 */
	isDisabled: boolean;
	/**
	 * Whether the select is focused.
	 */
	isFocused: boolean;
	/**
	 * Whether the select is invalid.
	 */
	isInvalid: boolean | undefined;
	/**
	 * Whether the select is compact.
	 */
	isCompact?: boolean;
	appearance?: 'default' | 'subtle' | 'none';
	/**
	 * Whether the select is expanded.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	menuIsOpen: boolean;
}

export const css = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ControlProps<Option, IsMulti, Group>,
) => {
	return compiledCSS();
};

const Control = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ControlProps<Option, IsMulti, Group>,
) => <Compiled {...props} />;

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Control;
