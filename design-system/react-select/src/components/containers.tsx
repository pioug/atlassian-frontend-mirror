/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type ReactNode } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import {
	containerCSS as compiledCSS,
	IndicatorsContainer as CompiledIndicatorsContainer,
	indicatorsContainerCSS as compiledIndicatorsContainerCSS,
	SelectContainer as CompiledSelectContainer,
	ValueContainer as CompiledValueContainer,
	valueContainerCSS as compiledValueContainerCSS,
} from '../compiled/components/containers';
import {
	containerCSS as emotionCSS,
	IndicatorsContainer as EmotionIndicatorsContainer,
	indicatorsContainerCSS as emotionIndicatorsContainerCSS,
	SelectContainer as EmotionSelectContainer,
	ValueContainer as EmotionValueContainer,
	valueContainerCSS as emotionValueContainerCSS,
} from '../emotion/components/containers';
import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../types';

// ==============================
// Root Container
// ==============================

export interface ContainerProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * Whether the select is disabled.
	 */
	isDisabled: boolean;
	isFocused: boolean;
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * Inner props to be passed down to the container.
	 */
	innerProps: {};
}
export const containerCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ContainerProps<Option, IsMulti, Group>,
): CSSObjectWithLabel => (fg('compiled-react-select') ? compiledCSS() : emotionCSS(props));

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SelectContainer = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ContainerProps<Option, IsMulti, Group>,
) =>
	fg('compiled-react-select') ? (
		<CompiledSelectContainer {...props} />
	) : (
		<EmotionSelectContainer {...props} />
	);

// ==============================
// Value Container
// ==============================

export interface ValueContainerProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * Props to be passed to the value container element.
	 */
	innerProps?: {};
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	isDisabled: boolean;
	/**
	 * Whether the select is compact.
	 */
	isCompact?: boolean;
}
export const valueContainerCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ValueContainerProps<Option, IsMulti, Group>,
): CSSObjectWithLabel =>
	fg('compiled-react-select') ? compiledValueContainerCSS() : emotionValueContainerCSS(props);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const ValueContainer = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ValueContainerProps<Option, IsMulti, Group>,
) =>
	fg('compiled-react-select') ? (
		<CompiledValueContainer {...props} />
	) : (
		<EmotionValueContainer {...props} />
	);

// ==============================
// Indicator Container
// ==============================

export interface IndicatorsContainerProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	isDisabled: boolean;
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * Props to be passed to the indicators container element.
	 */
	innerProps?: {};
}

export const indicatorsContainerCSS = (): CSSObjectWithLabel =>
	fg('compiled-react-select') ? compiledIndicatorsContainerCSS() : emotionIndicatorsContainerCSS();

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const IndicatorsContainer = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>(
	props: IndicatorsContainerProps<Option, IsMulti, Group>,
) =>
	fg('compiled-react-select') ? (
		<CompiledIndicatorsContainer {...props} />
	) : (
		<EmotionIndicatorsContainer {...props} />
	);
