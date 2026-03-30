/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type ReactNode } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../get-style-props';
import { type CommonPropsAndClassName, type GroupBase } from '../types';

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

const styles = cssMap({
	root: {
		gridArea: '1 / 1 / 2 / 3',
		maxWidth: '100%',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		marginBlockStart: 0,
		marginInlineEnd: token('space.025'),
		marginBlockEnd: 0,
		marginInlineStart: token('space.025'),
		color: token('color.text'),
	},
	disalbed: {
		color: token('color.text.disabled'),
	},
});

const SingleValue: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: SingleValueProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: SingleValueProps<Option, IsMulti, Group>,
) => {
	const { children, isDisabled, innerProps, xcss } = props;
	const { css, className } = getStyleProps(props, 'singleValue', {
		'single-value': true,
		'single-value--is-disabled': isDisabled,
	});
	return (
		<div
			css={[styles.root, isDisabled && styles.disalbed]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-singleValue')}
			{...innerProps}
		>
			{children}
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default SingleValue;
