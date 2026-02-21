/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type ReactNode, type Ref } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { type CommonPropsAndClassName, type GroupBase } from '../types';
import { getStyleProps } from '../utils';

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

const styles = cssMap({
	default: {
		alignItems: 'center',
		cursor: 'default',
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		outline: '0',
		position: 'relative',
		backgroundColor: token('color.background.input'),
		borderColor: token('color.border.input'),
		borderStyle: 'solid',
		borderRadius: token('radius.small', '3px'),
		borderWidth: token('border.width', '1px'),
		'&:focus-within': {
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.input')}`,
		},
		minHeight: 40,
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.0'),
		paddingBlockEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
		transition: `background-color 200ms ease-in-out,
border-color 200ms ease-in-out`,
		'&::-webkit-scrollbar': {
			height: 8,
			width: 8,
		},
		'&::-webkit-scrollbar-corner': {
			display: 'none',
		},
		'&:hover': {
			'&::-webkit-scrollbar-thumb': {
				// scrollbars occur only if the user passes in a custom component with overflow: scroll
				backgroundColor: 'rgba(0,0,0,0.2)',
			},
			cursor: 'pointer',
			backgroundColor: token('color.background.input.hovered'),
			borderColor: token('color.border.input'),
		},
		'&::-webkit-scrollbar-thumb:hover': {
			backgroundColor: 'rgba(0,0,0,0.4)',
		},
	},
	defaultT26Shape: {
		borderRadius: token('radius.medium', '6px'),
	},
	compact: {
		minHeight: 32,
	},
	invalid: {
		borderColor: token('color.border.danger'),
		'&:hover': {
			borderColor: token('color.border.danger'),
		},
		'&:focus-within': {
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.danger')}`,
		},
		boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.danger')}`,
	},
	focusedInvalid: {
		boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.focused')}`,
	},
	disabled: {
		// Turn pointer events off when disabled - this makes it so hover etc don't work.
		pointerEvents: 'none',
		backgroundColor: token('color.background.disabled'),
		borderColor: token('color.background.disabled'),
		'&:focus-within': {
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.background.disabled')}`,
		},
	},
	focused: {
		backgroundColor: token('color.background.input.pressed'),
		borderColor: token('color.border.focused'),
		boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.focused')}`,
		'&:focus-within': {
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.focused')}`,
		},
		'&:hover': {
			backgroundColor: token('color.background.input.pressed'),
			borderColor: token('color.border.focused'),
		},
	},
	subtle: {
		backgroundColor: 'transparent',
		borderColor: 'transparent',
		'&:focus-within': {
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} transparent`,
		},
	},
	subtleFocused: {
		backgroundColor: token('elevation.surface'),
	},
	none: {
		backgroundColor: 'transparent',
		borderColor: 'transparent',
		'&:focus-within': {
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} transparent`,
		},
		'&:hover': {
			backgroundColor: 'transparent',
			borderColor: 'transparent',
		},
	},
});

export const css: () => {} = () => ({});

const Control: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ControlProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ControlProps<Option, IsMulti, Group>,
) => {
	const {
		children,
		appearance,
		isCompact,
		isDisabled,
		isFocused,
		isInvalid,
		innerRef,
		innerProps,
		menuIsOpen,
		xcss,
	} = props;
	const { css, className } = getStyleProps(props, 'control', {
		control: true,
		'control--is-disabled': isDisabled,
		'control--is-focused': isFocused,
		'control--menu-is-open': menuIsOpen,
	});

	return (
		<div
			css={[
				styles.default,
				fg('platform-dst-shape-theme-default') && styles.defaultT26Shape,
				isDisabled && styles.disabled,
				isInvalid && styles.invalid,
				isCompact && styles.compact,
				appearance === 'subtle' && styles.subtle,
				appearance === 'subtle' && isFocused && styles.subtleFocused,
				isFocused && styles.focused,
				appearance === 'none' && styles.none,
			]}
			ref={innerRef}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-control')}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			{...innerProps}
			aria-disabled={isDisabled || undefined}
		>
			{children}
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Control;
