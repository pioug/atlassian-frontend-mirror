/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../../types';
import { getStyleProps } from '../../utils';

export interface ControlProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * Children to render.
	 */
	children: ReactNode;
	innerRef: Ref<HTMLDivElement>;
	/**
	 * The mouse down event and the innerRef to pass down to the controller element.
	 */
	innerProps: {};
	/**
	 * Whether the select is disabled.
	 */
	isDisabled: boolean;
	/**
	 * Whether the select is focused.
	 */
	isFocused: boolean;
	/**
	 * Whether the select is invalid.
	 */
	isInvalid: boolean | undefined;
	/**
	 * Whether the select is compact.
	 */
	isCompact?: boolean;
	appearance?: 'default' | 'subtle' | 'none';
	/**
	 * Whether the select is expanded.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	menuIsOpen: boolean;
}

export const css = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	isDisabled,
	isFocused,
	isInvalid,
	isCompact,
	appearance,
}: ControlProps<Option, IsMulti, Group>): CSSObjectWithLabel => {
	let borderColor: string = isFocused ? token('color.border.focused') : token('color.border.input');
	let backgroundColor: string = isFocused
		? token('color.background.input.pressed')
		: token('color.background.input');
	let backgroundColorHover: string = isFocused
		? token('color.background.input.pressed')
		: token('color.background.input.hovered');
	let borderColorHover: string = isFocused
		? token('color.border.focused')
		: token('color.border.input');

	if (isDisabled) {
		backgroundColor = token('color.background.disabled');
		borderColor = token('color.background.disabled');
	}
	if (isInvalid) {
		borderColor = token('color.border.danger');
		borderColorHover = token('color.border.danger');
	}

	const transitionDuration = '200ms';

	if (appearance === 'subtle') {
		borderColor = isFocused ? token('color.border.focused') : 'transparent';
		backgroundColor = isFocused ? token('elevation.surface') : 'transparent';
		backgroundColorHover = isFocused
			? token('color.background.input.pressed')
			: token('color.background.input.hovered');
	}
	if (appearance === 'none') {
		borderColor = 'transparent';
		backgroundColor = 'transparent';
		backgroundColorHover = 'transparent';
		borderColorHover = 'transparent';
	}

	return {
		label: 'control',
		alignItems: 'center',
		cursor: 'default',
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		outline: '0 !important',
		position: 'relative',
		// Turn pointer events off when disabled - this makes it so hover etc don't work.
		pointerEvents: isDisabled ? 'none' : undefined,
		backgroundColor,
		borderColor,
		borderStyle: 'solid',
		borderRadius: token('border.radius.100', '3px'),
		borderWidth: token('border.width', '1px'),
		boxShadow: isInvalid ? `inset 0 0 0 ${token('border.width', '1px')} ${borderColor}` : 'none',
		'&:focus-within': {
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${borderColor}`,
		},
		minHeight: isCompact ? 32 : 40,
		padding: 0,
		transition: `background-color ${transitionDuration} ease-in-out,
border-color ${transitionDuration} ease-in-out`,
		'::-webkit-scrollbar': {
			height: 8,
			width: 8,
		},
		'::-webkit-scrollbar-corner': {
			display: 'none',
		},
		':hover': {
			'::-webkit-scrollbar-thumb': {
				// scrollbars occur only if the user passes in a custom component with overflow: scroll
				backgroundColor: 'rgba(0,0,0,0.2)',
			},
			cursor: 'pointer',
			backgroundColor: backgroundColorHover,
			borderColor: borderColorHover,
		},
		'::-webkit-scrollbar-thumb:hover': {
			backgroundColor: 'rgba(0,0,0,0.4)',
		},
	};
};

const Control = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ControlProps<Option, IsMulti, Group>,
) => {
	const { children, isDisabled, isFocused, innerRef, innerProps, menuIsOpen } = props;
	return (
		<div
			ref={innerRef}
			{...getStyleProps(props, 'control', {
				control: true,
				'control--is-disabled': isDisabled,
				'control--is-focused': isFocused,
				'control--menu-is-open': menuIsOpen,
			})}
			{...innerProps}
			aria-disabled={isDisabled || undefined}
		>
			{children}
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Control;
