/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../../get-style-props';
import { type CommonPropsAndClassName, type GroupBase } from '../../types';

const loadingIndicatorStyles = cssMap({
	default: {
		paddingBlockStart: token('space.075'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.075'),
		paddingInlineStart: token('space.100'),
	},
	compact: {
		paddingBlockStart: 0,
		paddingBlockEnd: 0,
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
export const LoadingIndicator: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	innerProps,
	isRtl,
	size,
	isCompact,
	xcss,
	...restProps
}: LoadingIndicatorProps<Option, IsMulti, Group>) => JSX.Element = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({
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
