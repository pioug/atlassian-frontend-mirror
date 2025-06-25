/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type ReactNode } from 'react';

import Compiled, {
	placeholderCSS as compiledPlaceholderCSS,
} from '../compiled/components/placeholder';
import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../types';

export interface PlaceholderProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * props passed to the wrapping element for the group.
	 */
	innerProps: JSX.IntrinsicElements['div'];
	isDisabled: boolean;
	isFocused: boolean;
}

export const placeholderCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: PlaceholderProps<Option, IsMulti, Group>,
): CSSObjectWithLabel => compiledPlaceholderCSS();

const Placeholder = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: PlaceholderProps<Option, IsMulti, Group>,
) => <Compiled {...props} />;

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Placeholder;
