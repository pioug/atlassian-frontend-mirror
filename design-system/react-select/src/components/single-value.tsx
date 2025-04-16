/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type ReactNode } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import Compiled, { css as compiledCSS } from '../compiled/components/single-value';
import Emotion, { css as emotionCSS } from '../emotion/components/single-value';
import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../types';

export interface SingleValueProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * The data of the selected option rendered in the Single Value component.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Option;
	/**
	 * Props passed to the wrapping element for the group.
	 */
	innerProps: JSX.IntrinsicElements['div'];
	/**
	 * Whether this is disabled.
	 */
	isDisabled: boolean;
}

export const css = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: SingleValueProps<Option, IsMulti, Group>,
): CSSObjectWithLabel => (fg('compiled-react-select') ? compiledCSS() : emotionCSS(props));

const SingleValue = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: SingleValueProps<Option, IsMulti, Group>,
) => (fg('compiled-react-select') ? <Compiled {...props} /> : <Emotion {...props} />);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default SingleValue;
