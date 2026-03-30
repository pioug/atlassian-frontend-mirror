/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type ReactNode } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../../get-style-props';
import { type CommonPropsAndClassName, type GroupBase } from '../../types';

export interface ValueContainerProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * Props to be passed to the value container element.
	 */
	innerProps?: {};
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	isDisabled: boolean;
	/**
	 * Whether the select is compact.
	 */
	isCompact?: boolean;
}

const valueContainerStyles = cssMap({
	default: {
		alignItems: 'center',
		display: 'grid',
		flex: 1,
		flexWrap: 'wrap',
		WebkitOverflowScrolling: 'touch',
		position: 'relative',
		overflow: 'hidden',
		paddingBlockStart: token('space.025'),
		paddingInlineEnd: token('space.075'),
		paddingBlockEnd: token('space.025'),
		paddingInlineStart: token('space.075'),
	},
	flex: {
		display: 'flex',
	},
	compact: {
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.075'),
		paddingBlockEnd: token('space.0'),
		paddingInlineStart: token('space.075'),
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const ValueContainer: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ValueContainerProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ValueContainerProps<Option, IsMulti, Group>,
) => {
	const {
		children,
		innerProps,
		isMulti,
		hasValue,
		isCompact,
		xcss,
		selectProps: { controlShouldRenderValue },
	} = props;

	const { css, className } = getStyleProps(props, 'valueContainer', {
		'value-container': true,
		'value-container--is-multi': isMulti,
		'value-container--has-value': hasValue,
	});

	return (
		<div
			css={[
				valueContainerStyles.default,
				isMulti && hasValue && controlShouldRenderValue && valueContainerStyles.flex,
				isCompact && valueContainerStyles.compact,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-ValueContainer')}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			{...innerProps}
		>
			{children}
		</div>
	);
};
