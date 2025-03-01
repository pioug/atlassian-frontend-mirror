/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import LegacySelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import CrossIcon from '@atlaskit/icon/utility/cross';
import { fg } from '@atlaskit/platform-feature-flags';
import { Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { type SelectProps } from '../select';
import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../types';
import { getStyleProps } from '../utils';
interface MultiValueComponents<Option, IsMulti extends boolean, Group extends GroupBase<Option>> {
	Container: ComponentType<MultiValueGenericProps<Option, IsMulti, Group>>;
	Label: ComponentType<MultiValueGenericProps<Option, IsMulti, Group>>;
	Remove: ComponentType<MultiValueRemoveProps<Option, IsMulti, Group>>;
}

export interface MultiValueProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	children: ReactNode;
	components: MultiValueComponents<Option, IsMulti, Group>;
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	cropWithEllipsis?: boolean;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Option;
	innerProps: JSX.IntrinsicElements['div'];
	isFocused: boolean;
	isDisabled: boolean;
	removeProps: JSX.IntrinsicElements['div'];
	index: number;
}

export const multiValueCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	isDisabled,
	isFocused,
}: MultiValueProps<Option, IsMulti, Group>): CSSObjectWithLabel => {
	let backgroundColor;
	let color;
	if (isDisabled) {
		// Use the basic neutral background so it is slightly separate from the
		// field's background
		backgroundColor = token('color.background.neutral');
		color = token('color.text.disabled');
	} else if (isFocused) {
		backgroundColor = token('color.background.selected');
		color = token('color.text.selected', 'hsl(0, 0%, 20%)');
	} else {
		backgroundColor = fg('platform-component-visual-refresh')
			? token('color.background.neutral.subtle.hovered')
			: token('color.background.neutral');
		color = token('color.text', 'hsl(0, 0%, 20%)');
	}

	return {
		label: 'multiValue',
		display: 'flex',
		minWidth: 0, // resolves flex/text-overflow bug
		margin: token('space.025'),
		borderRadius: token('border.radius.050', '2px'),
		backgroundColor,
		boxShadow: isFocused
			? `0 0 0 2px ${token(
					'elevation.surface',
					'transparent',
				)}, 0 0 0 4px ${token('color.border.focused', 'transparent')}`
			: 'none',
		maxWidth: '100%',
		'@media screen and (-ms-high-contrast: active)': {
			border: isFocused ? '1px solid transparent' : 'none',
		},
		color,
		...(fg('platform-component-visual-refresh') && {
			borderRadius: token('border.radius.100'),
			// Hardcode this color for visual refresh as there is no token color yet
			borderColor: '#B7B9BE',
			borderWidth: token('border.width'),
			borderStyle: 'solid',
			backgroundColor: token('color.background.input'),
		}),
	};
};

export const multiValueLabelCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({
	cropWithEllipsis,
	isDisabled,
}: MultiValueProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	overflow: 'hidden',
	textOverflow: cropWithEllipsis || cropWithEllipsis === undefined ? 'ellipsis' : undefined,
	whiteSpace: 'nowrap',
	borderRadius: token('border.radius.050', '2px'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: '85%',
	font: token('font.body.UNSAFE_small'),
	padding: token('space.025', '2px'),
	color: isDisabled ? token('color.text.disabled') : 'inherit',
	paddingLeft: token('space.075', '6px'),
	...(fg('platform-component-visual-refresh') && {
		font: token('font.body'),
		paddingTop: 0,
		paddingBottom: 0,
		paddingLeft: token('space.050'),
	}),
});

export const multiValueRemoveCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({
	isFocused,
}: MultiValueProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	alignItems: 'center',
	display: 'flex',
	backgroundColor: isFocused ? token('utility.UNSAFE.transparent') : undefined,
	fill: isFocused ? token('color.text.selected', '#000') : token('color.text', '#000'),
	paddingLeft: token('space.025', '2px'),
	paddingRight: token('space.025', '2px'),
	borderRadius: '0px 2px 2px 0px',

	// DSP-6470 we should style like Tag once we have the :has selector
	':hover': {
		backgroundColor: token('color.background.danger.hovered'),
		fill: token('color.text.danger', '#000'),
	},
	':active': {
		backgroundColor: token('color.background.danger.pressed'),
		fill: token('color.text.danger', '#000'),
	},
	...(fg('platform-component-visual-refresh') && {
		backgroundColor: token('color.background.neutral.subtle'),
		border: 'none',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		appearance: 'none',
		borderRadius: token('border.radius'),
		color: token('color.text'),
		padding: token('space.025'),
		marginRight: token('space.025'),
		':focus-visible': {
			outlineOffset: token('space.negative.025'),
		},

		':hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},

		':active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	}),
});

export interface MultiValueGenericProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> {
	children: ReactNode;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: any;
	innerProps: { className?: string };
	selectProps: SelectProps<Option, IsMulti, Group>;
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
const MultiValueGeneric = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	children,
	innerProps,
}: MultiValueGenericProps<Option, IsMulti, Group>) => <div {...innerProps}>{children}</div>;

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MultiValueContainer = MultiValueGeneric;

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MultiValueLabel = MultiValueGeneric;
export interface MultiValueRemoveProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> {
	children?: ReactNode;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Option;
	innerProps: JSX.IntrinsicElements['div'];
	selectProps: SelectProps<Option, IsMulti, Group>;
	isDisabled: boolean;
}

const disabledStyles = css({
	display: 'none',
});

const enabledStyles = css({
	display: 'inherit',
});

const iconWrapperStyles = xcss({
	padding: 'space.025',
});

const renderIcon = () => {
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	if (fg('platform-component-visual-refresh')) {
		return <CrossIcon label="Clear" color="currentColor" />;
	}

	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	if (fg('platform-visual-refresh-icons-legacy-facade')) {
		return (
			<Inline xcss={iconWrapperStyles}>
				<CrossIcon label="Clear" color="currentColor" />
			</Inline>
		);
	}

	return (
		// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
		<LegacySelectClearIcon
			label="Clear"
			primaryColor="transparent"
			size="small"
			secondaryColor="inherit"
		/>
	);
};

export function MultiValueRemove<Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	isDisabled,
	innerProps,
}: MultiValueRemoveProps<Option, IsMulti, Group>) {
	return (
		<div role="button" {...innerProps}>
			<div
				css={isDisabled ? disabledStyles : enabledStyles}
				data-testid={isDisabled ? 'hide-clear-icon' : 'show-clear-icon'}
			>
				{renderIcon()}
			</div>
		</div>
	);
}

const MultiValue = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MultiValueProps<Option, IsMulti, Group>,
) => {
	const { children, components, data, innerProps, isDisabled, removeProps, selectProps } = props;

	const { Container, Label, Remove } = components;

	return (
		<Container
			data={data}
			innerProps={{
				...getStyleProps(props, 'multiValue', {
					'multi-value': true,
					'multi-value--is-disabled': isDisabled,
				}),
				...innerProps,
			}}
			selectProps={selectProps}
		>
			<Label
				data={data}
				innerProps={{
					...getStyleProps(props, 'multiValueLabel', {
						'multi-value__label': true,
					}),
				}}
				selectProps={selectProps}
			>
				{children}
			</Label>
			<Remove
				data={data}
				innerProps={{
					...getStyleProps(props, 'multiValueRemove', {
						'multi-value__remove': true,
					}),
					'aria-label': `Remove ${children || 'option'}`,
					...removeProps,
				}}
				isDisabled={isDisabled}
				selectProps={selectProps}
			/>
		</Container>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default MultiValue;
