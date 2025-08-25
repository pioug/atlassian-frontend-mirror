import type { ReactChild, ReactNode } from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { Appearance } from '@atlaskit/button/types';
import type { Space } from '@atlaskit/primitives/compiled';

import type { SmartLinkSize } from '../../../../../constants';

export type ActionMessageAppearance = 'error';

export type ActionMessage = {
	appearance?: ActionMessageAppearance;
	icon?: ReactNode;
	title: ReactNode;
};

export type ActionProps = {
	/**
	 * Determines the appearance of the action. Corresponds to the Atlaskit action appearance.
	 */
	appearance?: Appearance;

	/**
	 * Additional text properties for accessibility of actions
	 */
	ariaLabel?: string;

	/**
	 * Determines the appearance of the action.
	 */
	as?: 'button' | 'dropdown-item' | 'stack-item';

	/**
	 * @deprecated Use 'as' instead
	 * Used to determine whether the Action is in a Dropdown.
	 */
	asDropDownItem?: boolean;

	/**
	 * For compiled css
	 */
	className?: string;

	/**
	 * Determines the text content of the Action.
	 */
	content?: ReactNode;

	/**
	 * Determines if the tooltip should be hidden
	 */
	hideTooltip?: boolean;

	/**
	 * Determines the hideTooltipOnMouseDown behaviour of the Tooltip
	 */
	hideTooltipOnMouseDown?: boolean;

	/**
	 * Allows the use of hyperlinks as buttons via the atlaskit component
	 */
	href?: string;

	/**
	 * Determines the icon rendered within the Action.
	 */
	icon?: ReactChild;

	/**
	 * Determines where the icon should be rendered if text is provided.
	 */
	iconPosition?: 'before' | 'after';

	/**
	 * Determines whether the button displays as disabled.
	 */
	isDisabled?: boolean;

	/**
	 * Conditionally show a spinner over the top of a button or disable a dropdown item
	 * while server action is executing.
	 */
	isLoading?: boolean;

	/**
	 * Determines the onClick behaviour of the Action.
	 */
	onClick: () => any;

	/**
	 * Error callback - each action is to provide its own implementation.
	 */
	onError?: (error: ActionMessage) => void;

	/* Optional callback that can be invoked to update the action blocks loading state */
	onLoadingChange?: (isLoading: boolean) => void;

	/**
	 * Determines the size of the Action. Corresponds to an Action appearance.
	 */
	size?: SmartLinkSize;

	/**
	 * Used to add space along the inline axis in ActionStackItem.
	 */
	spaceInline?: Space;

	/**
	 * For dynamic styles
	 */
	style?: React.CSSProperties;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Determines the tooltip message when hovering over the Action.
	 */
	tooltipMessage?: ReactNode;

	/**
	 * Determines the onHide behaviour of the Tooltip
	 */
	tooltipOnHide?: (analyticsEvent: UIAnalyticsEvent) => any;

	/**
	 * Optional wrapper component to wrap the action
	 * E.g., Feature discovery pulse
	 * Cleanup on https://product-fabric.atlassian.net/browse/EDM-9649
	 */
	wrapper?: React.ElementType;
};
