/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import type { IconButtonProps } from '@atlaskit/button/new';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import {
	Anchor,
	type AnchorProps,
	Pressable,
	type PressableProps,
} from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { forwardRefWithGeneric } from '../../../components/forward-ref-with-generic';

type ButtonAppearance = 'default' | 'primary' | 'subtle';

interface CommonProps {
	/**
	 * The button style variation.
	 */
	appearance?: ButtonAppearance;
	/**
	 * Whether the button is disabled.
	 */
	isDisabled?: boolean;
	/**
	 * Indicates that the button is selected.
	 */
	isSelected?: boolean;
}

/**
 * Props from primitives that we explicitly ignore and remove from spread props,
 * because they apply styles.
 *
 * `css` / `className` are not here because primitives don't support them.
 *
 * See `packages/design-system/primitives/src/components/anchor.tsx` and `packages/design-system/primitives/src/components/pressable.tsx`
 * for where these are defined. These shouldn't change very often as the direction is `xcss` over individual props.
 */
type IgnoredPrimitiveProps =
	| 'style'
	| 'xcss'
	| 'backgroundColor'
	| 'padding'
	| 'paddingBlock'
	| 'paddingBlockStart'
	| 'paddingBlockEnd'
	| 'paddingInline'
	| 'paddingInlineStart'
	| 'paddingInlineEnd';

/**
 * Returns the spread props to pass through to underlying primitive components.
 *
 * It removes the props which apply styles.
 */
function getPrimitiveSpreadProps<Props extends Record<string, unknown>>({
	style,
	xcss,
	backgroundColor,
	padding,
	paddingBlock,
	paddingBlockStart,
	paddingBlockEnd,
	paddingInline,
	paddingInlineStart,
	paddingInlineEnd,
	...props
}: Props): Omit<Props, IgnoredPrimitiveProps> {
	return props;
}

/**
 * Props present in underlying primitives but we want to override,
 * so we don't want to inherit their definitions
 */
type OverridenPrimitiveProps = 'aria-label' | 'children' | IgnoredPrimitiveProps;

/**
 * Props that are common between link buttons.
 */
interface LinkVariantCommonProps<RouterLinkConfig extends Record<string, any> = never>
	extends CommonProps,
		Omit<AnchorProps<RouterLinkConfig>, OverridenPrimitiveProps> {}

/**
 * Props shared by `Button` and `IconButton`
 */
interface ActionVariantCommonProps
	extends CommonProps,
		Omit<PressableProps, OverridenPrimitiveProps> {}

export const themedButtonBackground = '--ds-top-bar-button-background';
export const themedButtonBackgroundHovered = '--ds-top-bar-button-background-hovered';
export const themedButtonBackgroundPressed = '--ds-top-bar-button-background-pressed';
export const themedButtonBorder = '--ds-top-bar-button-border';

export const themedButtonPrimaryText = '--ds-top-bar-button-primary-text';
export const themedButtonPrimaryBackground = '--ds-top-bar-button-primary-background';
export const themedButtonPrimaryBackgroundHovered =
	'--ds-top-bar-button-primary-background-hovered';
export const themedButtonPrimaryBackgroundPressed =
	'--ds-top-bar-button-primary-background-pressed';

export const themedButtonSelectedText = '--ds-top-bar-button-selected-text';
export const themedButtonSelectedBackground = '--ds-top-bar-button-selected-background';
export const themedButtonSelectedBackgroundHovered =
	'--ds-top-bar-button-selected-background-hovered';
export const themedButtonSelectedBackgroundPressed =
	'--ds-top-bar-button-selected-background-pressed';
export const themedButtonSelectedBorder = '--ds-top-bar-button-selected-border';

export const themedButtonDisabledText = '--ds-top-bar-button-disabled-text';
export const themedButtonDisabledBackground = '--ds-top-bar-button-disabled-background';

const styles = cssMap({
	root: {
		display: 'flex',
		gap: token('space.075'),
		alignItems: 'center',
		justifyContent: 'center',
		font: token('font.body'),
		height: '2.2857142857142856em',
		paddingBlock: token('space.0'),
		borderRadius: token('border.radius.100', '3px'),
		transition: 'background 0.1s ease-out',
		position: 'relative',
		// Remove the default underline for link buttons
		textDecoration: 'none',
		'&:hover, &:active, &:focus': {
			textDecoration: 'none',
		},
	},
	border: {
		'&::after': {
			content: '""',
			borderRadius: 'inherit',
			borderStyle: 'solid',
			borderWidth: token('border.width'),
			position: 'absolute',
			inset: token('space.0'),
		},
	},
	selected: {
		color: `var(${themedButtonSelectedText})`,
		background: `var(${themedButtonSelectedBackground})`,
		'&:hover': {
			color: `var(${themedButtonSelectedText})`,
			background: `var(${themedButtonSelectedBackgroundHovered})`,
		},
		'&:active': {
			color: `var(${themedButtonSelectedText})`,
			background: `var(${themedButtonSelectedBackgroundPressed})`,
		},
		'&:visited, &:focus': {
			color: `var(${themedButtonSelectedText})`,
		},
		'&::after': {
			borderColor: `var(${themedButtonSelectedBorder})`,
		},
	},
	disabled: {
		color: `var(${themedButtonDisabledText})`,
		background: `var(${themedButtonDisabledBackground})`,
		'&:hover': {
			color: `var(${themedButtonDisabledText})`,
			background: `var(${themedButtonDisabledBackground})`,
		},
		'&:active': {
			color: `var(${themedButtonDisabledText})`,
			background: `var(${themedButtonDisabledBackground})`,
		},
		'&:visited, &:focus': {
			color: `var(${themedButtonDisabledText})`,
		},
		'&::after': {
			borderColor: 'transparent',
		},
	},
});

const shapeStyles = cssMap({
	/**
	 * The regular rectangular button shape
	 */
	default: {
		paddingInline: token('space.150'),
	},
	/**
	 * A square button shape, used for icon buttons
	 */
	square: {
		width: '2.2857142857142856em',
		paddingInline: token('space.0'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 0,
	},
});

const appearanceStyles = cssMap({
	default: {
		color: 'currentColor',
		background: `var(${themedButtonBackground})`,
		'&:hover': {
			color: 'currentColor',
			background: `var(${themedButtonBackgroundHovered})`,
		},
		'&:active': {
			color: 'currentColor',
			background: `var(${themedButtonBackgroundPressed})`,
		},
		'&:visited, &:focus': {
			color: 'currentColor',
		},
		'&::after': {
			borderColor: `var(${themedButtonBorder})`,
		},
	},
	subtle: {
		color: 'currentColor',
		background: `var(${themedButtonBackground})`,
		'&:hover': {
			color: 'currentColor',
			background: `var(${themedButtonBackgroundHovered})`,
		},
		'&:active': {
			color: 'currentColor',
			background: `var(${themedButtonBackgroundPressed})`,
		},
		'&:visited, &:focus': {
			color: 'currentColor',
		},
	},
	primary: {
		color: `var(${themedButtonPrimaryText})`,
		background: `var(${themedButtonPrimaryBackground})`,
		'&:hover': {
			color: `var(${themedButtonPrimaryText})`,
			background: `var(${themedButtonPrimaryBackgroundHovered})`,
		},
		'&:active': {
			color: `var(${themedButtonPrimaryText})`,
			background: `var(${themedButtonPrimaryBackgroundPressed})`,
		},
		'&:visited, &:focus': {
			color: `var(${themedButtonPrimaryText})`,
		},
	},
});

/**
 * Props shared by `ThemedPressable` and `ThemedAnchor`
 */
interface ThemedPrimitiveProps {
	shape?: 'default' | 'square';
	children: React.ReactNode;
}

interface ThemedPressableProps extends ThemedPrimitiveProps, ActionVariantCommonProps {}

/**
 * Intentionally an almost-duplicate of `ThemedAnchor` - make sure to update both.
 *
 * See `ThemedAnchor` for more context.
 */
const ThemedPressable = forwardRef<HTMLButtonElement, ThemedPressableProps>(
	function ThemedPressable(
		{ appearance = 'default', shape = 'default', isSelected, isDisabled, ...props },
		ref,
	) {
		const hasBorder = appearance === 'default' || isSelected;
		return (
			<Pressable
				{...getPrimitiveSpreadProps(props)}
				ref={ref}
				type="button"
				/**
				 * We are using some style values that are outside of the strict
				 * `@atlaskit/css` types.
				 */
				// @ts-expect-error
				// eslint-disable-next-line @compiled/no-suppress-xcss
				xcss={cx(
					styles.root,
					shapeStyles[shape],
					hasBorder && styles.border,
					appearanceStyles[appearance],
					isSelected && styles.selected,
					isDisabled && styles.disabled,
				)}
				isDisabled={isDisabled}
			/>
		);
	},
);

interface ThemedAnchorProps<RouterLinkConfig extends Record<string, any> = never>
	extends ThemedPrimitiveProps,
		LinkVariantCommonProps<RouterLinkConfig> {}

/**
 * Intentionally an almost-duplicate of `ThemedPressable` - make sure to update both.
 *
 * More 'clever' solutions were tried but I couldn't get them working in an acceptable state.
 *
 * Polymorphism had many typing issues and required sacrificing type safety.
 *
 * Render props had problems passing down styles through `xcss` to the `children` function.
 */
const ThemedAnchor = forwardRefWithGeneric(function ThemedAnchor<
	RouterLinkConfig extends Record<string, any> = never,
>(
	{
		appearance = 'default',
		shape = 'default',
		isSelected,
		isDisabled,
		...props
	}: ThemedAnchorProps<RouterLinkConfig>,
	ref: React.Ref<HTMLAnchorElement>,
) {
	const hasBorder = appearance === 'default' || isSelected;

	return (
		<Anchor
			{...getPrimitiveSpreadProps(props)}
			ref={ref}
			/**
			 * We are using some style values that are outside of the strict
			 * `@atlaskit/css` types.
			 */
			// @ts-expect-error
			// eslint-disable-next-line @compiled/no-suppress-xcss
			xcss={cx(
				styles.root,
				shapeStyles[shape],
				hasBorder && styles.border,
				appearanceStyles[appearance],
				isSelected && styles.selected,
				isDisabled && styles.disabled,
			)}
		/>
	);
});

const textButtonStyles = cssMap({
	iconBefore: {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 0,
	},
	text: {
		fontWeight: token('font.weight.medium'),
	},
});

/**
 * Props shared by `Button` and `LinkButton`
 */
interface TextButtonCommonProps {
	/**
	 * Places an icon within the button, before the button's text.
	 */
	iconBefore?: IconButtonProps['icon'];
	/**
	 * Text content to be rendered in the button.
	 */
	children: React.ReactNode;
}

export interface ThemedButtonProps extends ActionVariantCommonProps, TextButtonCommonProps {}

/**
 * __Themed button__
 *
 * A themed button for the top bar.
 */
export const ThemedButton = forwardRef<HTMLButtonElement, ThemedButtonProps>(function ThemedButton(
	{ iconBefore: IconBefore, children, ...props },
	ref,
) {
	return (
		<ThemedPressable {...props} ref={ref}>
			{IconBefore && (
				<span css={textButtonStyles.iconBefore}>
					<IconBefore label="" color="currentColor" />
				</span>
			)}
			<span css={textButtonStyles.text}>{children}</span>
		</ThemedPressable>
	);
});

export interface ThemedLinkButtonProps<RouterLinkConfig extends Record<string, any> = never>
	extends LinkVariantCommonProps<RouterLinkConfig>,
		TextButtonCommonProps {}

/**
 * __Themed link button__
 *
 * A themed link button for the top bar.
 */
export const ThemedLinkButton = forwardRefWithGeneric(function ThemedLinkButton<
	RouterLinkConfig extends Record<string, any> = never,
>(
	{ iconBefore: IconBefore, children, ...props }: ThemedLinkButtonProps<RouterLinkConfig>,
	ref: React.Ref<HTMLAnchorElement>,
) {
	return (
		<ThemedAnchor {...props} ref={ref}>
			{IconBefore && (
				<span css={textButtonStyles.iconBefore}>
					<IconBefore label="" color="currentColor" />
				</span>
			)}
			<span css={textButtonStyles.text}>{children}</span>
		</ThemedAnchor>
	);
});

/**
 * Props shared by `ThemedIconButtonProps` and `ThemedLinkIconButton`
 */
interface IconButtonCommonProps {
	// Icon button doesn't support children
	children?: never;
	// Prevent duplicate labels being added.
	'aria-label'?: never;
	/**
	 * Provide an accessible label, often used by screen readers.
	 */
	label: React.ReactNode;
	/**
	 * Places an icon within the button.
	 */
	icon: IconButtonProps['icon'];
	/**
	 * Props passed down to the Tooltip component.
	 */
	tooltip?: IconButtonProps['tooltip'];
}

export interface ThemedIconButtonProps extends ActionVariantCommonProps, IconButtonCommonProps {}

/**
 * __Themed icon button__
 *
 * A themed icon button for the top bar.
 */
export const ThemedIconButton = forwardRef<HTMLButtonElement, ThemedIconButtonProps>(
	function ThemedIconButton({ icon: Icon, label, tooltip, ...props }, ref) {
		return (
			<Tooltip {...tooltip} content={tooltip?.content ?? label}>
				{(triggerProps) => (
					/**
					 * The `aria-describedby` from `triggerProps` is intentionally not passed down,
					 * because it would cause double announcements with the `VisuallyHidden` label.
					 *
					 * The `@atlaskit/button` IconButton uses the same approach.
					 */
					<ThemedPressable
						{...props}
						shape="square"
						ref={mergeRefs([ref, triggerProps.ref])}
						onClick={(event, analyticsEvent) => {
							props.onClick?.(event, analyticsEvent);
							triggerProps?.onClick?.(event);
						}}
						onMouseOver={(e) => {
							triggerProps.onMouseOver?.(e);
							props.onMouseOver?.(e);
						}}
						onMouseOut={(e) => {
							triggerProps.onMouseOut?.(e);
							props.onMouseOut?.(e);
						}}
						onMouseMove={(e) => {
							triggerProps.onMouseMove?.(e);
							props.onMouseMove?.(e);
						}}
						onMouseDown={(e) => {
							triggerProps.onMouseDown?.(e);
							props.onMouseDown?.(e);
						}}
						onFocus={(e) => {
							triggerProps.onFocus?.(e);
							props.onFocus?.(e);
						}}
						onBlur={(e) => {
							triggerProps.onBlur?.(e);
							props.onBlur?.(e);
						}}
					>
						<Icon label="" color="currentColor" />
						<VisuallyHidden>{label}</VisuallyHidden>
					</ThemedPressable>
				)}
			</Tooltip>
		);
	},
);

export interface ThemedLinkIconButtonProps<RouterLinkConfig extends Record<string, any> = never>
	extends LinkVariantCommonProps<RouterLinkConfig>,
		IconButtonCommonProps {
	href: string | RouterLinkConfig;
}

/**
 * __Themed link icon button__
 *
 * A themed link icon button for the top bar.
 */
export const ThemedLinkIconButton = forwardRefWithGeneric(function ThemedLinkIconButton<
	RouterLinkConfig extends Record<string, any> = never,
>(
	{ icon: Icon, label, tooltip, ...props }: ThemedLinkIconButtonProps<RouterLinkConfig>,
	ref: React.Ref<HTMLAnchorElement>,
) {
	return (
		<Tooltip {...tooltip} content={tooltip?.content ?? label}>
			{(triggerProps) => (
				/**
				 * The `aria-describedby` from `triggerProps` is intentionally not passed down,
				 * because it would cause double announcements with the `VisuallyHidden` label.
				 *
				 * The `@atlaskit/button` IconButton uses the same approach.
				 */
				<ThemedAnchor<RouterLinkConfig>
					{...props}
					shape="square"
					ref={mergeRefs([ref, triggerProps.ref])}
					onClick={(event, analyticsEvent) => {
						props.onClick?.(event, analyticsEvent);
						triggerProps?.onClick?.(event);
					}}
					onMouseOver={(e) => {
						triggerProps.onMouseOver?.(e);
						props.onMouseOver?.(e);
					}}
					onMouseOut={(e) => {
						triggerProps.onMouseOut?.(e);
						props.onMouseOut?.(e);
					}}
					onMouseMove={(e) => {
						triggerProps.onMouseMove?.(e);
						props.onMouseMove?.(e);
					}}
					onMouseDown={(e) => {
						triggerProps.onMouseDown?.(e);
						props.onMouseDown?.(e);
					}}
					onFocus={(e) => {
						triggerProps.onFocus?.(e);
						props.onFocus?.(e);
					}}
					onBlur={(e) => {
						triggerProps.onBlur?.(e);
						props.onBlur?.(e);
					}}
				>
					<Icon label="" color="currentColor" />
					<VisuallyHidden>{label}</VisuallyHidden>
				</ThemedAnchor>
			)}
		</Tooltip>
	);
});
