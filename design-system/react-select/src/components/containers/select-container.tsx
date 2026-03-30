/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type ReactNode } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../../get-style-props';
import { type CommonPropsAndClassName, type GroupBase } from '../../types';

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

const containerStyles = cssMap({
	default: {
		position: 'relative',
		font: token('font.body.large'),
		pointerEvents: 'all',
		'@media (min-width: 30rem)': {
			font: token('font.body'),
		},
	},
	rtl: {
		direction: 'rtl',
	},
	disabled: {
		cursor: 'not-allowed',
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SelectContainer: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ContainerProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ContainerProps<Option, IsMulti, Group>,
) => {
	const { children, innerProps, isDisabled, isRtl, xcss } = props;
	const { className, css } = getStyleProps(props, 'container', {
		'--is-disabled': isDisabled,
		'--is-rtl': isRtl,
	});

	return (
		<div
			css={[
				containerStyles.default,
				isRtl && containerStyles.rtl,
				isDisabled && containerStyles.disabled,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-container')}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			{...innerProps}
		>
			{children}
		</div>
	);
};
