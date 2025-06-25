/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type ComponentType, type CSSProperties, type ReactNode } from 'react';

import { type XCSSProp } from '@compiled/react';

import type { XCSSAllProperties, XCSSAllPseudos } from '@atlaskit/css';

import Compiled, {
	MultiValueContainer as CompiledMultiValueContainer,
	multiValueCSS as CompiledMultiValueCSS,
	MultiValueLabel as CompiledMultiValueLabel,
	multiValueLabelCSS as CompiledMultiValueLabelCSS,
	MultiValueRemove as CompiledMultiValueRemove,
	multiValueRemoveCSS as CompiledMultiValueRemoveCSS,
} from '../compiled/components/multi-value';
import { type SelectProps } from '../select';
import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../types';
interface MultiValueComponents<Option, IsMulti extends boolean, Group extends GroupBase<Option>> {
	Container: ComponentType<MultiValueGenericProps<Option, IsMulti, Group>>;
	Label: ComponentType<MultiValueGenericProps<Option, IsMulti, Group>>;
	Remove: ComponentType<MultiValueRemoveProps<Option, IsMulti, Group>>;
}

export interface MultiValueProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	children: ReactNode;
	components: MultiValueComponents<Option, IsMulti, Group>;
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	cropWithEllipsis?: boolean;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Option;
	innerProps: JSX.IntrinsicElements['div'];
	isFocused: boolean;
	isDisabled: boolean;
	removeProps: JSX.IntrinsicElements['div'];
	index: number;
}

export const multiValueCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MultiValueProps<Option, IsMulti, Group>,
): CSSObjectWithLabel => CompiledMultiValueCSS();

export const multiValueLabelCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>(
	props: MultiValueProps<Option, IsMulti, Group>,
): CSSObjectWithLabel => CompiledMultiValueLabelCSS();

export const multiValueRemoveCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>(
	props: MultiValueProps<Option, IsMulti, Group>,
): CSSObjectWithLabel => CompiledMultiValueRemoveCSS();

export interface MultiValueGenericProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> {
	children: ReactNode;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: any;
	innerProps: { className?: string; style?: CSSProperties };
	selectProps: SelectProps<Option, IsMulti, Group>;
	isFocused?: boolean;
	isDisabled?: boolean;
	hasEllipsis?: boolean;
	className?: string | undefined;
	xcss?: XCSSProp<XCSSAllProperties, XCSSAllPseudos> | undefined;
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MultiValueContainer = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>(
	props: MultiValueGenericProps<Option, IsMulti, Group>,
) => <CompiledMultiValueContainer {...props} />;

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MultiValueLabel = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MultiValueGenericProps<Option, IsMulti, Group>,
) => <CompiledMultiValueLabel {...props} />;
export interface MultiValueRemoveProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> {
	children?: ReactNode;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Option;
	innerProps: JSX.IntrinsicElements['div'];
	selectProps: SelectProps<Option, IsMulti, Group>;
	isDisabled: boolean;
	isFocused?: boolean;
	className?: string | undefined;
	xcss?: XCSSProp<XCSSAllProperties, XCSSAllPseudos> | undefined;
}

export function MultiValueRemove<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MultiValueRemoveProps<Option, IsMulti, Group>,
) {
	return <CompiledMultiValueRemove {...props} />;
}

const MultiValue = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MultiValueProps<Option, IsMulti, Group>,
) => <Compiled {...props} />;

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default MultiValue;
