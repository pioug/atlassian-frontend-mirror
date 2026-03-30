/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties, type ReactNode } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import DownIcon from '@atlaskit/icon/core/chevron-down';
import { Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../../get-style-props';
import { type CommonPropsAndClassName, type GroupBase } from '../../types';

const dropdownWrapperStyles = cssMap({
	root: {
		paddingBlockStart: token('space.075'),
		paddingInlineEnd: token('space.075'),
		paddingBlockEnd: token('space.075'),
		paddingInlineStart: token('space.075'),
	},
});

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
	disabled: {
		color: token('color.text.disabled'),
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const DropdownIndicator: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: DropdownIndicatorProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
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
					<DownIcon color="currentColor" label="open" size="small" />
				</Inline>
			)}
		</div>
	);
};
