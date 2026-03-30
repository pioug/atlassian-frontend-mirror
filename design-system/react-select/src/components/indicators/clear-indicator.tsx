/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties, type ReactNode } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import CrossIcon from '@atlaskit/icon/core/cross-circle';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../../get-style-props';
import { type CommonPropsAndClassName, type GroupBase } from '../../types';

const iconContainerStyles = cssMap({
	root: {
		all: 'unset',
		outline: 'revert',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingBlockStart: token('space.025'),
		paddingInlineEnd: token('space.025'),
		paddingBlockEnd: token('space.025'),
		paddingInlineStart: token('space.025'),
	},
});

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

const clearIndicatorStyles = cssMap({
	default: {
		display: 'flex',
		transition: 'color 150ms',
		color: token('color.text.subtlest'),
		paddingBlockStart: token('space.075'),
		paddingInlineEnd: token('space.025'),
		paddingBlockEnd: token('space.075'),
		paddingInlineStart: token('space.025'),
		'&:hover': {
			color: token('color.text.subtle'),
		},
	},
	compact: {
		paddingBlockStart: 0,
		paddingBlockEnd: 0,
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const ClearIndicator: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ClearIndicatorProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
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
				<CrossIcon label="" color="currentColor" size="small" />
			</Pressable>
		</div>
	);
};
