/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type ReactNode } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import {
	ClearIndicator as CompiledClearIndicator,
	clearIndicatorCSS as compiledClearIndicatorCSS,
	DropdownIndicator as CompiledDropdownIndicator,
	dropdownIndicatorCSS as compiledDropdownIndicatorCSS,
	LoadingIndicator as CompiledLoadingIndicator,
	loadingIndicatorCSS as compiledLoadingIndicatorCSS,
} from '../compiled/components/indicators';
import {
	ClearIndicator as EmotionClearIndicator,
	clearIndicatorCSS as emotionClearIndicatorCSS,
	DropdownIndicator as EmotionDropdownIndicator,
	dropdownIndicatorCSS as emotionDropdownIndicatorCSS,
	LoadingIndicator as EmotionLoadingIndicator,
	loadingIndicatorCSS as emotionLoadingIndicatorCSS,
} from '../emotion/components/indicators';
import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../types';

// ==============================
// Dropdown & Clear Buttons
// ==============================

export interface DropdownIndicatorProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * The children to be rendered inside the indicator.
	 */
	children?: ReactNode;
	/**
	 * Props that will be passed on to the children.
	 */
	innerProps: JSX.IntrinsicElements['div'];
	/**
	 * The focused state of the select.
	 */
	isFocused: boolean;
	isDisabled: boolean;
	/**
	 * Whether the select is compact.
	 */
	isCompact?: boolean;
}

export const dropdownIndicatorCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>(
	props: DropdownIndicatorProps<Option, IsMulti, Group>,
): CSSObjectWithLabel =>
	fg('compiled-react-select') ? compiledDropdownIndicatorCSS() : emotionDropdownIndicatorCSS(props);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const DropdownIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: DropdownIndicatorProps<Option, IsMulti, Group>,
) =>
	fg('compiled-react-select') ? (
		<CompiledDropdownIndicator {...props} />
	) : (
		<EmotionDropdownIndicator {...props} />
	);

export interface ClearIndicatorProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * The children to be rendered inside the indicator.
	 */
	children?: ReactNode;
	/**
	 * Sets the `aria-label` for the clear icon button
	 */
	clearControlLabel?: string;
	/**
	 * Props that will be passed on to the children.
	 */
	innerProps: JSX.IntrinsicElements['div'];
	/**
	 * The focused state of the select.
	 */
	isFocused: boolean;
	/**
	 * Whether the select is compact.
	 */
	isCompact?: boolean;
}

export const clearIndicatorCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ClearIndicatorProps<Option, IsMulti, Group>,
): CSSObjectWithLabel =>
	fg('compiled-react-select') ? compiledClearIndicatorCSS() : emotionClearIndicatorCSS(props);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const ClearIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ClearIndicatorProps<Option, IsMulti, Group>,
) =>
	fg('compiled-react-select') ? (
		<CompiledClearIndicator {...props} />
	) : (
		<EmotionClearIndicator {...props} />
	);

// ==============================
// Loading
// ==============================

export const loadingIndicatorCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>(
	props: LoadingIndicatorProps<Option, IsMulti, Group>,
): CSSObjectWithLabel =>
	fg('compiled-react-select') ? compiledLoadingIndicatorCSS() : emotionLoadingIndicatorCSS(props);

export interface LoadingIndicatorProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * Props that will be passed on to the children.
	 */
	innerProps: JSX.IntrinsicElements['div'];
	/**
	 * The focused state of the select.
	 */
	isFocused: boolean;
	isDisabled: boolean;
	/**
	 * Set size of the container.
	 */
	size: number;
	/**
	 * Whether the select is compact.
	 */
	isCompact?: boolean;
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const LoadingIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: LoadingIndicatorProps<Option, IsMulti, Group>,
) =>
	fg('compiled-react-select') ? (
		<CompiledLoadingIndicator {...props} />
	) : (
		<EmotionLoadingIndicator {...props} />
	);
