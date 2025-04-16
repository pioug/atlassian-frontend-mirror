/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type InputHTMLAttributes } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import Compiled, { inputCSS as compiledInputCSS } from '../compiled/components/input';
import Emotion, { inputCSS as emotionInputCSS } from '../emotion/components/input';
import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../types';

interface InputSpecificProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends InputHTMLAttributes<HTMLInputElement>,
		CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * Reference to the internal element
	 */
	innerRef?: (instance: HTMLInputElement | null) => void;
	/**
	 * Set whether the input should be visible. Does not affect input size.
	 */
	isHidden: boolean;
	/**
	 * Whether the input is disabled
	 */
	isDisabled?: boolean;
	/**
	 * The ID of the form that the input belongs to
	 */
	form?: string;
	/**
	 * Set className for the input element
	 */
	inputClassName?: string;
	/**
	 * A testId prop is provided for specific elements. This is a unique string that appears as a data attribute data-testid in the rendered code and serves as a hook for automated tests.
	 */
	testId?: string;
}

export type InputProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> = InputSpecificProps<Option, IsMulti, Group>;

export const inputCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: InputProps<Option, IsMulti, Group>,
): CSSObjectWithLabel =>
	fg('compiled-react-select') ? compiledInputCSS() : emotionInputCSS(props);

const Input = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: InputProps<Option, IsMulti, Group>,
) => (fg('compiled-react-select') ? <Compiled {...props} /> : <Emotion {...props} />);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Input;
