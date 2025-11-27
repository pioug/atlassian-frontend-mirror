import { type AllHTMLAttributes, type ComponentType, type ElementType } from 'react';

import { type CustomThemeButtonProps } from '@atlaskit/button/types';
import type { TooltipProps } from '@atlaskit/tooltip';

export type PrimaryButtonProps = Omit<CustomThemeButtonProps, 'appearance' | 'onClick'> & {
	/**
	 * Allows for overriding the component used to render the button.
	 * This is primarily intended for compatibility with custom
	 * routing libraries when using the `href` prop.
	 *
	 * For further usage information, refer to the [documentation for button](https://atlassian.design/components/button/button-legacy/code).
	 *
	 * @example
	 * ```tsx
	 * <Settings
	 *   component={CustomRouterLink}
	 *   href="/path/to/url"
	 * />
	 *```
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	component?: ComponentType<AllHTMLAttributes<HTMLElement>> | ElementType<any>;
	/**
	 * Will set the appearance of the button to look highlighted.
	 */
	isHighlighted?: boolean;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Optional text to show when the button is focused or hovered.
	 */
	tooltip?: React.ReactNode;

	/**
	 * Display a keyboard shortcut in the tooltip.
	 *
	 * Keys will be displayed as individual keyboard key segments after the tooltip content.
	 *
	 * Note: it will only be used if the `tooltip` prop is also provided.
	 */
	shortcut?: TooltipProps['shortcut'];

	/**
	 * On click handler.
	 * See @atlaskit/analytics-next for analyticsEvent type information
	 */
	onClick?: (event: React.MouseEvent<HTMLElement>, analyticsEvent: any) => void;
};

export type PrimaryButtonSkeletonProps = {
	className?: string;
};
