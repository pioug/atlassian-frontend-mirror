/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type ReactNode } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../get-style-props';
import { type CommonPropsAndClassName, type GroupBase } from '../types';

export interface PlaceholderProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * props passed to the wrapping element for the group.
	 */
	innerProps: JSX.IntrinsicElements['div'];
	isDisabled: boolean;
	isFocused: boolean;
}

const placeholderStyles = cssMap({
	root: {
		gridArea: '1 / 1 / 2 / 3',
		marginBlockStart: 0,
		marginInlineEnd: token('space.025'),
		marginBlockEnd: 0,
		marginInlineStart: token('space.025'),
		color: token('color.text.subtlest'),
	},
	disabled: {
		color: token('color.text.disabled'),
	},
});

const Placeholder: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: PlaceholderProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: PlaceholderProps<Option, IsMulti, Group>,
) => {
	const { children, innerProps, isDisabled, xcss } = props;
	const { css, className } = getStyleProps(props, 'placeholder', {
		placeholder: true,
	});
	return (
		<div
			css={[placeholderStyles.root, isDisabled && placeholderStyles.disabled]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-placeholder')}
			{...innerProps}
		>
			{children}
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Placeholder;
