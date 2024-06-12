/* eslint-disable jsdoc/require-asterisk-prefix */
import { type ReactNode } from 'react';

import { type HeadingSize } from './heading.partial';

type HeadingPropsBase = {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * The text of the heading.
	 */
	children: ReactNode;
	/**
	 * Unique identifier for the heading DOM element.
	 */
	id?: string;
	/**
	 * Allows the component to be rendered as the specified DOM element, overriding a default element set by `level` prop.
	 */
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
};

export type OldHeadingProps = HeadingPropsBase & {
	/**
	 * Text color of the heading. Use `"inverse"` option for a light text color over a dark background.
	 * Defaults to `"default"`.
	 */
	color?: 'inverse' | 'default';
	/**
	 * @private
	 * @deprecated Use `size` prop instead.
	 * The heading level as defined by the Atlassian Design [typography foundations](/foundations/typography/). The `level` prop affects the actual HTML element rendered in the DOM:
	 * @example
	 * ```js
	 * const levelMap = {
	 *    h900: 'h1',
	 *    h800: 'h1',
	 *    h700: 'h2',
	 *    h600: 'h3',
	 *    h500: 'h4',
	 *    h400: 'h5',
	 *    h300: 'h6',
	 *    h200: 'div',
	 *    h100: 'div',
	 * };
	 * ```
	 *
	 * It's important to note that the final DOM may be impacted by the parent heading level context because of inferred accessibility level correction.
	 * Therefore, it is recommended to check the final DOM to confirm the actual rendered HTML element.
	 */
	level: 'h900' | 'h800' | 'h700' | 'h600' | 'h500' | 'h400' | 'h300' | 'h200' | 'h100';
	/**
	 * Heading size. Use instead of the deprecated `level` prop.
	 */
	size?: never;
};

export type HeadingColor = 'color.text' | 'color.text.inverse' | 'color.text.warning.inverse';

export type NewHeadingProps = HeadingPropsBase & {
	/**
	 * Token representing text color with a built-in fallback value.
	 * Will apply inverse text color automatically if placed within a Box with bold background color.
	 * Defaults to `color.text`.
	 */
	color?: HeadingColor;
	/**
	 * Heading size. This value is detached from the specific heading level applied to allow for more flexibility.
	 * Use instead of the deprecated `level` prop.
	 *
	 */
	size: HeadingSize;
	level?: never;
};

export type HeadingProps = OldHeadingProps | NewHeadingProps;

/* eslint-enable jsdoc/require-asterisk-prefix */
