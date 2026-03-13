/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, type CSSProperties, type MouseEvent, type ReactNode } from 'react';

import { css, cssMap, cx, jsx, type XCSSProp } from '@compiled/react';

import type { XCSSAllProperties, XCSSAllPseudos } from '@atlaskit/css';
import CrossIcon from '@atlaskit/icon/core/cross';
import { fg } from '@atlaskit/platform-feature-flags';
import Tag from '@atlaskit/tag';
import type { NewTagColor } from '@atlaskit/tag';
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

// Tag wrapper: Tag has built-in margin; cancel the inline margin so we control spacing
const tagMarginToken = token('space.050', '4px');
const multiValueTagWrapperStyles = cssMap({
	root: {
		display: 'flex',
		minWidth: token('space.0'),
		marginBlockStart: token('space.025'),
		marginInlineEnd: token('space.050', '4px'),
		marginBlockEnd: token('space.025'),
		maxWidth: '100%',
	},
	inner: {
		marginInline: `calc(-1 * ${tagMarginToken})`,
	},
});

// Tag-like color styles
const tagLikeColorStyles = cssMap({
	gray: { '--tag-border-token': token('color.border.accent.gray') },
	blue: { '--tag-border-token': token('color.border.accent.blue') },
	green: { '--tag-border-token': token('color.border.accent.green') },
	red: { '--tag-border-token': token('color.border.accent.red') },
	yellow: { '--tag-border-token': token('color.border.accent.yellow') },
	purple: { '--tag-border-token': token('color.border.accent.purple') },
	lime: { '--tag-border-token': token('color.border.accent.lime') },
	magenta: { '--tag-border-token': token('color.border.accent.magenta') },
	orange: { '--tag-border-token': token('color.border.accent.orange') },
	teal: { '--tag-border-token': token('color.border.accent.teal') },
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- match TagNew border color logic
const tagLikeBorderFilterStyles = css({
	borderColor:
		'color-mix(in oklch, var(--tag-border-token) 100%, var(--cm-border-color) var(--cm-border-value))',
	'--border-l-factor': '1.33',
	'--cm-border-color': 'white',
	'--cm-border-value': '45%',
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- dark mode override for TagNew border
	'[data-color-mode="dark"] &': {
		'--border-l-factor': '0.7',
		'--cm-border-color': 'black',
	},
	'@supports (color: oklch(from white l c h))': {
		borderColor: 'oklch(from var(--tag-border-token) calc(l * var(--border-l-factor)) c h)',
	},
});

// Tag-like styles for custom content values (not plain text) when FF is on.
// Mirrors the TagNew component's visual appearance (padding, margins, sizing, colors).
// The container uses tag-like styling while Label/Remove sub-components are preserved
// so custom overrides (e.g. custom aria-labels, rendering objects as data) continue to work.
const multiValueTagLikeStyles = cssMap({
	root: {
		display: 'inline-flex',
		boxSizing: 'border-box',
		position: 'relative',
		alignItems: 'center',
		minWidth: '0rem',
		maxWidth: '11.25rem',
		height: '1.25rem',
		overflow: 'hidden', // Match TagNew margins for consistent chip spacing (padding omitted to avoid clipping custom Label content)
		marginBlock: token('space.025'),
		marginInline: token('space.025'),
		borderRadius: token('radius.small', '4px'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		backgroundColor: token('color.background.neutral.subtle'),
		font: token('font.body.small'),
		color: token('color.text'),
		cursor: 'default',
		'@media screen and (-ms-high-contrast: active)': {
			border: 'none',
		},
	},
	// Wrapper around custom Label content; minHeight: 0 allows flex shrink so root height is enforced.
	// flex: 0 1 auto avoids growing to fill space (unlike default TagNew text) so Label and Remove stay compact.
	labelWrapper: {
		display: 'flex',
		alignItems: 'center',
		flex: '0 1 auto',
		minWidth: token('space.0'),
		minHeight: 0,
		overflow: 'hidden',
		font: token('font.body.small'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- force custom Label content to inherit tag typography
		'& *': {
			font: 'inherit',
		},
	},
	disabled: {
		color: token('color.text.disabled'),
		backgroundColor: token('color.background.neutral'),
	},
	focused: {
		color: token('color.text.selected', 'hsl(0, 0%, 20%)'),
		backgroundColor: token('color.background.neutral.subtle.hovered'),
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

export const multiValueCSS: () => {} = () => ({});

export const multiValueLabelCSS: () => {} = () => ({});

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

export const multiValueRemoveCSS: () => {} = () => ({});

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
export const MultiValueContainer: <
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
}: MultiValueGenericProps<Option, IsMulti, Group>) => JSX.Element = <
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
export const MultiValueLabel: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	children,
	innerProps,
	isDisabled,
	hasEllipsis,
	className,
	xcss,
}: MultiValueGenericProps<Option, IsMulti, Group>) => JSX.Element = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({
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
}: MultiValueRemoveProps<Option, IsMulti, Group>): JSX.Element {
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

const getMultiValueLabelText = (children: ReactNode, data: unknown): string => {
	if (typeof children === 'string') {
		return children;
	}
	const label = (data as { label?: string })?.label;
	return typeof label === 'string' ? label : '';
};

const MultiValue: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MultiValueProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
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
	const labelText = getMultiValueLabelText(children, data);
	const isPlainLabel = typeof children === 'string';
	const ffTagUplifts = fg('platform-dst-lozenge-tag-badge-visual-uplifts');

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

	const hasCustomLabel = Label !== MultiValueLabel;
	if (ffTagUplifts && isPlainLabel && !hasCustomLabel) {
		const { elemBefore, color: tagColor } = (data ?? {}) as {
			elemBefore?: ReactNode;
			color?: NewTagColor;
		};

		return (
			<div
				css={multiValueTagWrapperStyles.root}
				{...innerProps}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
				className={cx(props.className as any, containerClassName, props.xcss, '-multiValue')}
			>
				<div css={multiValueTagWrapperStyles.inner}>
					<Tag
						text={labelText}
						isRemovable={!isDisabled}
						removeButtonLabel={`${labelText}, remove`}
						onBeforeRemoveAction={() => {
							removeProps.onClick?.({} as MouseEvent<HTMLDivElement>);
							return false;
						}}
						color={tagColor ?? 'gray'}
						elemBefore={elemBefore}
					/>
				</div>
			</div>
		);
	}

	// FF on + custom content or custom Label/Remove → tag-like container styling with the provided
	// Label and Remove components so custom overrides continue to work.
	if (ffTagUplifts) {
		const colorKey = (data as { color?: string })?.color;

		return (
			<div
				data-multi-value-tag-like="true"
				css={[
					multiValueTagLikeStyles.root,
					tagLikeColorStyles.gray,
					colorKey === 'blue' && tagLikeColorStyles.blue,
					colorKey === 'green' && tagLikeColorStyles.green,
					colorKey === 'red' && tagLikeColorStyles.red,
					colorKey === 'yellow' && tagLikeColorStyles.yellow,
					colorKey === 'purple' && tagLikeColorStyles.purple,
					colorKey === 'lime' && tagLikeColorStyles.lime,
					colorKey === 'magenta' && tagLikeColorStyles.magenta,
					colorKey === 'orange' && tagLikeColorStyles.orange,
					colorKey === 'teal' && tagLikeColorStyles.teal,
					tagLikeBorderFilterStyles,
					isDisabled && multiValueTagLikeStyles.disabled,
					isFocused && multiValueTagLikeStyles.focused,
				]}
				{...innerProps}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- custom styles.multiValue overrides (e.g. colored borders) must be preserved
				style={containerCss as CSSProperties}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
				className={cx(props.className as any, containerClassName, props.xcss, '-multiValue')}
			>
				<div css={multiValueTagLikeStyles.labelWrapper}>
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
				</div>
				<Remove
					data={data}
					innerProps={{
						style: removeCss as CSSProperties,
						className: removeClassName,
						role: 'button',
						tabIndex: -1,
						'aria-label': `${labelText || 'option'}, remove`,
						...removeProps,
					}}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					className={removeClassName}
					isDisabled={isDisabled}
					selectProps={selectProps}
				/>
			</div>
		);
	}

	// FF off → default styles
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
					'aria-label': `${labelText || 'option'}, remove`,
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
