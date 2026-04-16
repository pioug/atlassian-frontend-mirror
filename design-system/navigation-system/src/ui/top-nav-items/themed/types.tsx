import type { ReactNode } from 'react';

import type { IconButtonProps } from '@atlaskit/button/new';

import type { IgnoredPrimitiveProps } from './get-primitives-spread-props';

/**
 * Props present in underlying primitives but we want to override,
 * so we don't want to inherit their definitions
 */
export type OverriddenPrimitiveProps = 'aria-label' | 'children' | IgnoredPrimitiveProps;

export interface CommonProps {
	/**
	 * The button style variation.
	 */
	appearance?: 'default' | 'primary' | 'subtle';
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
 * Props shared by `Button` and `LinkButton`
 */
export interface TextButtonCommonProps {
	/**
	 * Places an icon within the button, before the button's text.
	 */
	iconBefore?: IconButtonProps['icon'];
	/**
	 * Text content to be rendered in the button.
	 */
	children: ReactNode;
}

/**
 * Props shared by `ThemedIconButtonProps` and `ThemedLinkIconButton`
 */
export interface IconButtonCommonProps {
	// Icon button doesn't support children
	children?: never;
	// Prevent duplicate labels being added.
	'aria-label'?: never;
	/**
	 * Provide an accessible label, often used by screen readers.
	 */
	label: ReactNode;
	/**
	 * Places an icon within the button.
	 */
	icon: IconButtonProps['icon'];
	/**
	 * Props passed down to the Tooltip component.
	 */
	tooltip?: IconButtonProps['tooltip'];
}
