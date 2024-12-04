/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, type RefCallback } from 'react';

import { jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { isAppleDevice } from '../accessibility/helpers';
import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../types';
import { getStyleProps } from '../utils';

import A11yText from './internal/a11y-text';

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

export const optionCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	isDisabled,
	isFocused,
	isSelected,
}: OptionProps<Option, IsMulti, Group>): CSSObjectWithLabel => {
	let color: string = token('color.text');
	if (isDisabled) {
		color = token('color.text.disabled');
	} else if (isSelected) {
		color = token('color.text.selected');
	}

	let boxShadow;
	let backgroundColor;
	if (isDisabled) {
		backgroundColor = undefined;
	} else if (isSelected && isFocused) {
		backgroundColor = token('color.background.selected.hovered');
	} else if (isSelected) {
		backgroundColor = token('color.background.selected');
	} else if (isFocused) {
		backgroundColor = token('color.background.neutral.subtle.hovered');
	}
	if (!isDisabled && (isFocused || isSelected)) {
		boxShadow = `inset 2px 0px 0px ${token('color.border.selected')}`;
	}

	const cursor = isDisabled ? 'not-allowed' : 'default';

	return {
		label: 'option',
		display: 'block',
		fontSize: 'inherit',
		width: '100%',
		userSelect: 'none',
		WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
		padding: `${token('space.075')} ${token('space.150')}`,
		backgroundColor,
		color,
		cursor,
		boxShadow,
		':active': {
			backgroundColor: !isDisabled
				? isSelected
					? token('color.background.selected.pressed')
					: token('color.background.neutral.subtle.pressed')
				: undefined,
		},
		'@media screen and (-ms-high-contrast: active)': {
			borderLeft: !isDisabled && (isFocused || isSelected) ? '2px solid transparent' : '',
		},
	};
};

const Option = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: OptionProps<Option, IsMulti, Group>,
) => {
	const { children, isDisabled, isFocused, isSelected, innerRef, innerProps } = props;
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	const isVoiceOver = isAppleDevice() && fg('design_system_select-a11y-improvement');

	return (
		<div
			{...getStyleProps(props, 'option', {
				option: true,
				'option--is-disabled': isDisabled,
				'option--is-focused': isFocused,
				'option--is-selected': isSelected,
			})}
			ref={innerRef}
			{...innerProps}
			tabIndex={-1}
		>
			{children}
			{/* Funny story, aria-selected does not work very well with VoiceOver, so it needs to be removed but we still need to express selected state
			https://bugs.webkit.org/show_bug.cgi?id=209076
			VoiceOver does not announce aria-disabled the first time, so going this route
			*/}
			{isVoiceOver && (isSelected || isDisabled) && (
				<A11yText>{`${isSelected ? ',selected' : ''}${isDisabled ? ',dimmed' : ''}`}</A11yText>
			)}
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Option;
