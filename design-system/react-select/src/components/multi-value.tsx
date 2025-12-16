/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, type CSSProperties, type ReactNode } from 'react';

import { css, cssMap, cx, jsx, type XCSSProp } from '@compiled/react';

import type { XCSSAllProperties, XCSSAllPseudos } from '@atlaskit/css';
import CrossIcon from '@atlaskit/icon/core/cross';
import { token } from '@atlaskit/tokens';

import { type SelectProps } from '../select';
import { type CommonPropsAndClassName, type GroupBase } from '../types';
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

const multiValueStyles = cssMap({
	root: {
		display: 'flex',
		minWidth: token('space.0'), // resolves flex/text-overflow bug
		marginBlockStart: token('space.025'),
		marginInlineEnd: token('space.025'),
		marginBlockEnd: token('space.025'),
		marginInlineStart: token('space.025'),
		borderColor: '#B7B9BE',
		borderRadius: token('radius.small'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		backgroundColor: token('color.background.input'),
		maxWidth: '100%',
		'@media screen and (-ms-high-contrast: active)': {
			border: 'none',
		},
		color: token('color.text', 'hsl(0, 0%, 20%)'),
	},
	disabled: {
		color: token('color.text.disabled'),
		backgroundColor: token('color.background.neutral'),
	},
	focused: {
		color: token('color.text.selected', 'hsl(0, 0%, 20%)'),
		backgroundColor: token('color.background.selected'),
		boxShadow: `0 0 0 2px ${token(
			'elevation.surface',
			'transparent',
		)}, 0 0 0 4px ${token('color.border.focused', 'transparent')}`,
		'@media screen and (-ms-high-contrast: active)': {
			borderWidth: token('border.width'),
			borderColor: 'transparent',
			borderStyle: 'solid',
		},
	},
});

export const multiValueCSS = () => ({});

export const multiValueLabelCSS = () => ({});

const multiValueLabelStyles = cssMap({
	root: {
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		borderRadius: token('radius.xsmall', '2px'),
		font: token('font.body'),
		paddingInlineEnd: token('space.025', '2px'),
		paddingInlineStart: token('space.050'),
		color: 'inherit',
	},
	disabled: {
		color: token('color.text.disabled'),
	},
	ellipsis: {
		textOverflow: 'ellipsis',
	},
});

export const multiValueRemoveCSS = () => ({});

const multiValueRemoveStyles = cssMap({
	focused: {
		backgroundColor: token('utility.UNSAFE.transparent'),
		fill: token('color.text.selected', '#000'),
	},
	root: {
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		appearance: 'none',
		backgroundColor: token('color.background.neutral.subtle'),
		color: token('color.text'),
		display: 'flex',
		fill: token('color.text', '#000'),
		paddingBlockStart: token('space.025'),
		paddingInlineEnd: token('space.025'),
		paddingBlockEnd: token('space.025'),
		paddingInlineStart: token('space.025'),
		marginInlineEnd: token('space.025'),
		border: 'none',
		borderRadius: token('radius.small'),

		// DSP-6470 we should style like Tag once we have the :has selector
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
			fill: token('color.text.danger', '#000'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
			fill: token('color.text.danger', '#000'),
		},
		'&:focus-visible': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			outlineOffset: -2,
		},
	},
});

export interface MultiValueGenericProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> {
	children: ReactNode;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: any;
	innerProps: { className?: string; style?: CSSProperties };
	selectProps: SelectProps<Option, IsMulti, Group>;
	isFocused?: boolean;
	isDisabled?: boolean;
	hasEllipsis?: boolean;
	className?: string | undefined;
	xcss?: XCSSProp<XCSSAllProperties, XCSSAllPseudos> | undefined;
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MultiValueContainer = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({
	children,
	innerProps,
	isFocused,
	isDisabled,
	className,
	xcss,
}: MultiValueGenericProps<Option, IsMulti, Group>) => {
	return (
		<div
			css={[
				multiValueStyles.root,
				isDisabled && multiValueStyles.disabled,
				isFocused && multiValueStyles.focused,
			]}
			{...innerProps}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-multiValue')}
		>
			{children}
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MultiValueLabel = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	children,
	innerProps,
	isDisabled,
	hasEllipsis,
	className,
	xcss,
}: MultiValueGenericProps<Option, IsMulti, Group>) => {
	return (
		<div
			css={[
				multiValueLabelStyles.root,
				isDisabled && multiValueLabelStyles.disabled,
				hasEllipsis && multiValueLabelStyles.ellipsis,
			]}
			{...innerProps}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-MultiValueLabel')}
		>
			{children}
		</div>
	);
};
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
	isFocused?: boolean;
	className?: string | undefined;
	xcss?: XCSSProp<XCSSAllProperties, XCSSAllPseudos> | undefined;
}

const disabledStyles = css({
	display: 'none',
});

const enabledStyles = css({
	display: 'inherit',
});

export function MultiValueRemove<Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	isDisabled,
	isFocused,
	innerProps,
	className,
	xcss,
}: MultiValueRemoveProps<Option, IsMulti, Group>) {
	return (
		// The Remove button is intentionally excluded from the tab order, please avoid assigning a non-negative tabIndex to it. Context: https://hello.atlassian.net/wiki/spaces/A11YKB/pages/3031993460/Clear+Options+on+an+Input+Field
		<div
			css={[multiValueRemoveStyles.root, isFocused && multiValueRemoveStyles.focused]}
			{...innerProps}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-MultiValueRemove')}
		>
			<div
				css={[isDisabled && disabledStyles, !isDisabled && enabledStyles]}
				data-testid={isDisabled ? 'hide-clear-icon' : 'show-clear-icon'}
			>
				<CrossIcon label="" color="currentColor" size="small" />
			</div>
		</div>
	);
}

const MultiValue = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MultiValueProps<Option, IsMulti, Group>,
) => {
	const {
		children,
		components,
		data,
		innerProps,
		isDisabled,
		isFocused,
		removeProps,
		selectProps,
		cropWithEllipsis,
	} = props;

	const { Container, Label, Remove } = components;
	const ariaLabel = typeof children === 'string' ? children : (data as { label?: string }).label;

	const { css: containerCss, className: containerClassName } = getStyleProps(props, 'multiValue', {
		'multi-value': true,
		'multi-value--is-disabled': isDisabled,
	});

	const { css: labelCss, className: labelClassName } = getStyleProps(props, 'multiValueLabel', {
		'multi-value__label': true,
	});

	const { css: removeCss, className: removeClassName } = getStyleProps(props, 'multiValueRemove', {
		'multi-value__remove': true,
	});
	return (
		<Container
			data={data}
			innerProps={{
				style: containerCss as CSSProperties,
				className: containerClassName,
				...innerProps,
			}}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={containerClassName}
			isFocused={isFocused}
			isDisabled={isDisabled}
			selectProps={selectProps}
		>
			<Label
				data={data}
				innerProps={{
					style: labelCss as CSSProperties,
					className: labelClassName,
				}}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={labelClassName}
				hasEllipsis={cropWithEllipsis || cropWithEllipsis === undefined}
				selectProps={selectProps}
			>
				{children}
			</Label>
			<Remove
				data={data}
				innerProps={{
					style: removeCss as CSSProperties,
					className: removeClassName,
					role: 'button',
					tabIndex: -1,
					'aria-label': `${ariaLabel || 'option'}, remove`,
					...removeProps,
				}}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={removeClassName}
				isDisabled={isDisabled}
				selectProps={selectProps}
			/>
		</Container>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default MultiValue;
