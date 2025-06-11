/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties, type ReactNode } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import DownIcon from '@atlaskit/icon/core/migration/chevron-down';
import CrossIcon from '@atlaskit/icon/core/migration/cross-circle--select-clear';
import { Inline, Pressable } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import { type CommonPropsAndClassName, type GroupBase } from '../../types';
import { getStyleProps } from '../../utils';

// ==============================
// Dropdown & Clear Icons
// ==============================

const iconContainerStyles = cssMap({
	root: {
		all: 'unset',
		outline: 'revert',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: token('space.025'),
		paddingRight: token('space.025'),
		paddingBottom: token('space.025'),
		paddingLeft: token('space.025'),
	},
});

const dropdownWrapperStyles = cssMap({
	root: {
		paddingTop: token('space.075'),
		paddingRight: token('space.075'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.075'),
	},
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

const dropdownStyles = cssMap({
	default: {
		display: 'flex',
		transition: 'color 150ms',
		color: token('color.text.subtle'),
		paddingTop: token('space.075'),
		paddingRight: token('space.025'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.025'),
		'&:hover': {
			color: token('color.text.subtle'),
		},
	},
	compact: {
		paddingTop: 0,
		paddingBottom: 0,
	},
	disabled: {
		color: token('color.text.disabled'),
	},
});

export const dropdownIndicatorCSS = () => ({});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const DropdownIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: DropdownIndicatorProps<Option, IsMulti, Group>,
) => {
	const { innerProps, children, isDisabled, isCompact, xcss } = props;
	const { css, className } = getStyleProps(props, 'dropdownIndicator', {
		indicator: true,
		'dropdown-indicator': true,
	});
	return (
		<div
			css={[
				dropdownStyles.default,
				isDisabled && dropdownStyles.disabled,
				isCompact && dropdownStyles.compact,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-indicatorContainer')}
			{...innerProps}
		>
			{children ? (
				children
			) : (
				<Inline as="span" xcss={dropdownWrapperStyles.root}>
					<DownIcon
						color="currentColor"
						label="open"
						LEGACY_margin={token('space.negative.075', '-0.375rem')}
						size="small"
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

export const clearIndicatorCSS = () => ({});

const clearIndicatorStyles = cssMap({
	default: {
		display: 'flex',
		transition: 'color 150ms',
		color: token('color.text.subtlest'),
		paddingTop: token('space.075'),
		paddingRight: token('space.025'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.025'),
		'&:hover': {
			color: token('color.text.subtle'),
		},
	},
	compact: {
		paddingTop: 0,
		paddingBottom: 0,
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const ClearIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ClearIndicatorProps<Option, IsMulti, Group>,
) => {
	const { innerProps, clearControlLabel = 'clear', isCompact, xcss } = props;
	const { css, className } = getStyleProps(props, 'clearIndicator', {
		indicator: true,
		'clear-indicator': true,
	});
	return (
		<div
			css={[clearIndicatorStyles.default, isCompact && clearIndicatorStyles.compact]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-indicatorContainer')}
			{...innerProps}
		>
			{/* The Clear button is intentionally excluded from the tab order, please avoid assigning a non-negative tabIndex to it. Context: https://hello.atlassian.net/wiki/spaces/A11YKB/pages/3031993460/Clear+Options+on+an+Input+Field */}
			<Pressable xcss={iconContainerStyles.root} tabIndex={-1} aria-label={clearControlLabel}>
				<CrossIcon
					label=""
					color="currentColor"
					LEGACY_size="small"
					LEGACY_margin={token('space.negative.025', '-0.125rem')}
					size="small"
				/>
			</Pressable>
		</div>
	);
};

// ==============================
// Loading
// ==============================

export const loadingIndicatorCSS = () => ({});

const loadingIndicatorStyles = cssMap({
	default: {
		paddingTop: token('space.075'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.100'),
	},
	compact: {
		paddingTop: 0,
		paddingBottom: 0,
	},
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
	isCompact,
	xcss,
	...restProps
}: LoadingIndicatorProps<Option, IsMulti, Group>) => {
	const { css, className } = getStyleProps(
		{ ...restProps, innerProps, isRtl, size },
		'loadingIndicator',
		{
			indicator: true,
			'loading-indicator': true,
		},
	);

	return (
		<div
			css={[loadingIndicatorStyles.default, isCompact && loadingIndicatorStyles.compact]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-loadingIndicator')}
			{...innerProps}
		>
			<Spinner size="small" />
		</div>
	);
};
