/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import forwardRefWithGeneric from '@atlaskit/ds-lib/forward-ref-with-generic';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor, type AnchorProps } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { getPrimitiveSpreadProps } from './get-primitives-spread-props';
import type { CommonProps, OverriddenPrimitiveProps } from './types';

const styles = cssMap({
	root: {
		display: 'flex',
		gap: token('space.075'),
		alignItems: 'center',
		justifyContent: 'center',
		font: token('font.body'),
		height: '2.2857142857142856em',
		paddingBlock: token('space.0'),
		borderRadius: token('radius.small', '3px'),
		transition: 'background 0.1s ease-out',
		position: 'relative',
		// Remove the default underline for link buttons
		textDecoration: 'none',
		'&:hover, &:active, &:focus': {
			textDecoration: 'none',
		},
	},
	// platform-dst-shape-theme-default TODO: Merge into base after rollout
	rootT26Shape: {
		borderRadius: token('radius.medium', '6px'),
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
		color: `var(--ds-top-bar-button-selected-text)`,
		background: `var(--ds-top-bar-button-selected-background)`,
		'&:hover': {
			color: `var(--ds-top-bar-button-selected-text)`,
			background: `var(--ds-top-bar-button-selected-background-hovered)`,
		},
		'&:active': {
			color: `var(--ds-top-bar-button-selected-text)`,
			background: `var(--ds-top-bar-button-selected-background-pressed)`,
		},
		'&:visited, &:focus': {
			color: `var(--ds-top-bar-button-selected-text)`,
		},
		'&::after': {
			borderColor: `var(--ds-top-bar-button-selected-border)`,
		},
	},
	disabled: {
		color: `var(--ds-top-bar-button-disabled-text)`,
		background: `var(--ds-top-bar-button-disabled-background)`,
		'&:hover': {
			color: `var(--ds-top-bar-button-disabled-text)`,
			background: `var(--ds-top-bar-button-disabled-background)`,
		},
		'&:active': {
			color: `var(--ds-top-bar-button-disabled-text)`,
			background: `var(--ds-top-bar-button-disabled-background)`,
		},
		'&:visited, &:focus': {
			color: `var(--ds-top-bar-button-disabled-text)`,
		},
		'&::after': {
			borderColor: 'transparent',
		},
	},
});

const appearanceStyles = cssMap({
	default: {
		color: 'currentColor',
		background: `var(--ds-top-bar-button-background)`,
		'&:hover': {
			color: 'currentColor',
			background: `var(--ds-top-bar-button-background-hovered)`,
		},
		'&:active': {
			color: 'currentColor',
			background: `var(--ds-top-bar-button-background-pressed)`,
		},
		'&:visited, &:focus': {
			color: 'currentColor',
		},
		'&::after': {
			borderColor: `var(--ds-top-bar-button-border)`,
		},
	},
	subtle: {
		color: 'currentColor',
		background: `var(--ds-top-bar-button-background)`,
		'&:hover': {
			color: 'currentColor',
			background: `var(--ds-top-bar-button-background-hovered)`,
		},
		'&:active': {
			color: 'currentColor',
			background: `var(--ds-top-bar-button-background-pressed)`,
		},
		'&:visited, &:focus': {
			color: 'currentColor',
		},
	},
	primary: {
		color: `var(--ds-top-bar-button-primary-text)`,
		background: `var(--ds-top-bar-button-primary-background)`,
		'&:hover': {
			color: `var(--ds-top-bar-button-primary-text)`,
			background: `var(--ds-top-bar-button-primary-background-hovered)`,
		},
		'&:active': {
			color: `var(--ds-top-bar-button-primary-text)`,
			background: `var(--ds-top-bar-button-primary-background-pressed)`,
		},
		'&:visited, &:focus': {
			color: `var(--ds-top-bar-button-primary-text)`,
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

/**
 * Props that are common between link buttons.
 */
interface LinkVariantCommonProps<RouterLinkConfig extends Record<string, any> = never>
	extends CommonProps,
		Omit<AnchorProps<RouterLinkConfig>, OverriddenPrimitiveProps> {}

/**
 * Props shared by `ThemedPressable` and `ThemedAnchor`
 */
interface ThemedPrimitiveProps {
	shape?: 'default' | 'square';
	children: React.ReactNode;
}

interface ThemedAnchorProps<RouterLinkConfig extends Record<string, any> = never>
	extends ThemedPrimitiveProps,
		LinkVariantCommonProps<RouterLinkConfig> {}

function ThemedAnchorFn<RouterLinkConfig extends Record<string, any> = never>(
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
				fg('platform-dst-shape-theme-default') && styles.rootT26Shape,
				shapeStyles[shape],
				hasBorder && styles.border,
				appearanceStyles[appearance],
				isSelected && styles.selected,
				isDisabled && styles.disabled,
			)}
		/>
	);
}

/**
 * Intentionally an almost-duplicate of `ThemedPressable` - make sure to update both.
 *
 * More 'clever' solutions were tried but I couldn't get them working in an acceptable state.
 *
 * Polymorphism had many typing issues and required sacrificing type safety.
 *
 * Render props had problems passing down styles through `xcss` to the `children` function.
 */
export const ThemedAnchor: <RouterLinkConfig extends Record<string, any> = never>(
	props: ThemedAnchorProps<RouterLinkConfig> & React.RefAttributes<HTMLAnchorElement>,
) => React.ReactElement | null = forwardRefWithGeneric(ThemedAnchorFn);
