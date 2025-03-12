/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { jsx } from '@emotion/react';

import DownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import CrossIcon from '@atlaskit/icon/utility/migration/cross-circle--select-clear';
import { Inline, Pressable, xcss } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../types';
import { getStyleProps } from '../utils';

// ==============================
// Dropdown & Clear Icons
// ==============================

const iconContainerStyles = xcss({
	all: 'unset',
	outline: 'revert',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: 'space.025',
});

const dropdownWrapperStyles = xcss({
	padding: 'space.075',
});

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
>({
	isCompact,
	isDisabled,
}: DropdownIndicatorProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	label: 'indicatorContainer',
	display: 'flex',
	transition: 'color 150ms',
	color: isDisabled ? token('color.text.disabled') : token('color.text.subtle'),
	padding: `${isCompact ? 0 : token('space.075')} ${token('space.025')}`,
	':hover': {
		color: token('color.text.subtle'),
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const DropdownIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: DropdownIndicatorProps<Option, IsMulti, Group>,
) => {
	const { innerProps, children } = props;
	return (
		<div
			{...getStyleProps(props, 'dropdownIndicator', {
				indicator: true,
				'dropdown-indicator': true,
			})}
			{...innerProps}
		>
			{children ? (
				children
			) : (
				<Inline as="span" xcss={dropdownWrapperStyles}>
					<DownIcon
						color="currentColor"
						label="open"
						LEGACY_margin={token('space.negative.075', '-0.375rem')}
					/>
				</Inline>
			)}
		</div>
	);
};

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

export const clearIndicatorCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({
	isCompact,
}: ClearIndicatorProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	label: 'indicatorContainer',
	display: 'flex',
	transition: 'color 150ms',
	color: token('color.text.subtlest'),
	padding: `${isCompact ? 0 : token('space.075')} ${token('space.025')}`,
	':hover': {
		color: token('color.text.subtle'),
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const ClearIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ClearIndicatorProps<Option, IsMulti, Group>,
) => {
	const { innerProps, clearControlLabel = 'clear' } = props;
	return (
		<div
			{...getStyleProps(props, 'clearIndicator', {
				indicator: true,
				'clear-indicator': true,
			})}
			{...innerProps}
		>
			{/* The Clear button is intentionally excluded from the tab order, please avoid assigning a non-negative tabIndex to it. Context: https://hello.atlassian.net/wiki/spaces/A11YKB/pages/3031993460/Clear+Options+on+an+Input+Field */}
			<Pressable xcss={iconContainerStyles} tabIndex={-1} aria-label={clearControlLabel}>
				<CrossIcon
					label=""
					color="currentColor"
					LEGACY_size="small"
					LEGACY_margin={token('space.negative.025', '-0.125rem')}
				/>
			</Pressable>
		</div>
	);
};

// ==============================
// Loading
// ==============================

export const loadingIndicatorCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({
	isCompact,
}: LoadingIndicatorProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	label: 'loadingIndicator',
	padding: `${isCompact ? 0 : token('space.075')} ${token('space.100')}`,
});

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
export const LoadingIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	innerProps,
	isRtl,
	size = 4,
	...restProps
}: LoadingIndicatorProps<Option, IsMulti, Group>) => {
	return (
		<div
			{...getStyleProps({ ...restProps, innerProps, isRtl, size }, 'loadingIndicator', {
				indicator: true,
				'loading-indicator': true,
			})}
			{...innerProps}
		>
			<Spinner size="small" />
		</div>
	);
};
