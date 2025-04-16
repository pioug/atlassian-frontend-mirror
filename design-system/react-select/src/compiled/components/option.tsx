/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type ReactNode, type RefCallback } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { type CommonPropsAndClassName, type GroupBase } from '../../types';
import { getStyleProps } from '../../utils';

export interface OptionProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * Inner ref to DOM Node
	 */
	innerRef: RefCallback<HTMLDivElement>;
	/**
	 * props passed to the wrapping element for the group.
	 */
	innerProps: JSX.IntrinsicElements['div'];
	/**
	 * Text to be displayed representing the option.
	 */
	label: string;
	/**
	 * Type is used by the menu to determine whether this is an option or a group.
	 * In the case of option this is always `option`. *
	 */
	type: 'option';
	/**
	 * The data of the selected option.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Option;
	/**
	 * Whether the option is disabled.
	 */
	isDisabled: boolean;
	/**
	 * Whether the option is focused.
	 */
	isFocused: boolean;
	/**
	 * Whether the option is selected.
	 */
	isSelected: boolean;
}

export const optionCSS = () => ({});

const optionStyles = cssMap({
	root: {
		color: token('color.text'),
		cursor: 'default',
		display: 'block',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: 'inherit',
		width: '100%',
		userSelect: 'none',
		WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
		paddingBlock: token('space.075'),
		paddingInline: token('space.150'),
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},
	disabled: {
		color: token('color.text.disabled'),
		cursor: 'not-allowed',
		backgroundColor: 'transparent',
		boxShadow: 'none',
		'&:active': {
			backgroundColor: 'transparent',
		},
		'@media screen and (-ms-high-contrast: active)': {
			borderLeft: 'none',
		},
	},
	focused: {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
		boxShadow: `inset 2px 0px 0px ${token('color.border.selected')}`,
		'@media screen and (-ms-high-contrast: active)': {
			borderLeft: '2px solid transparent',
		},
	},
	selected: {
		'&:active': {
			backgroundColor: token('color.background.selected.pressed'),
		},
		color: token('color.text.selected'),
		backgroundColor: token('color.background.selected'),
		boxShadow: `inset 2px 0px 0px ${token('color.border.selected')}`,
		'@media screen and (-ms-high-contrast: active)': {
			borderLeft: '2px solid transparent',
		},
	},
	focusedSelected: {
		backgroundColor: token('color.background.selected.hovered'),
	},
});

const Option = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: OptionProps<Option, IsMulti, Group>,
) => {
	const { children, isDisabled, isFocused, isSelected, innerRef, innerProps, xcss } = props;
	const { css, className } = getStyleProps(props, 'option', {
		option: true,
		'option--is-disabled': isDisabled,
		'option--is-focused': isFocused,
		'option--is-selected': isSelected,
	});

	return (
		<div
			css={[
				optionStyles.root,
				isFocused && optionStyles.focused,
				isSelected && optionStyles.selected,
				isFocused && isSelected && optionStyles.focusedSelected,
				isDisabled && optionStyles.disabled,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss)}
			ref={innerRef}
			{...innerProps}
			tabIndex={-1}
		>
			{children}
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Option;
