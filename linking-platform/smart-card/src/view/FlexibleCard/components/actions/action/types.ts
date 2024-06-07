import type { Appearance } from '@atlaskit/button/types';
import type { Space, XCSS } from '@atlaskit/primitives';
import type { SerializedStyles } from '@emotion/react';
import type { ReactChild, ReactNode } from 'react';
import type { SmartLinkSize } from '../../../../../constants';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

export type ActionMessageAppearance = 'error';

export type ActionMessage = {
	appearance?: ActionMessageAppearance;
	icon?: ReactNode;
	title: ReactNode;
};

export type ActionProps = {
	/**
	 * Determines the appearance of the action.
	 */
	as?: 'button' | 'dropdown-item' | 'stack-item';

	/**
	 * Determines the size of the Action. Corresponds to an Action appearance.
	 */
	size?: SmartLinkSize;

	/**
	 * Determines the text content of the Action.
	 */
	content?: ReactNode;

	/**
	 * Determines the appearance of the action. Corresponds to the Atlaskit action appearance.
	 */
	appearance?: Appearance;

	/**
	 * Determines the onClick behaviour of the Action.
	 */
	onClick: () => any;

	/**
	 * Error callback - each action is to provide its own implementation.
	 */
	onError?: (error: ActionMessage) => void;

	/**
	 * Determines the icon rendered within the Action.
	 */
	icon?: ReactChild;

	/**
	 * Determines where the icon should be rendered if text is provided.
	 */
	iconPosition?: 'before' | 'after';

	/**
	 * Conditionally show a spinner over the top of a button or disable a dropdown item
	 * while server action is executing.
	 */
	isLoading?: boolean;

	/**
	 * Determines the tooltip message when hovering over the Action.
	 */
	tooltipMessage?: ReactNode;

	/**
	 * Determines the onHide behaviour of the Tooltip
	 */
	tooltipOnHide?: (analyticsEvent: UIAnalyticsEvent) => any;

	/**
	 * Determines the hideTooltipOnMouseDown behaviour of the Tooltip
	 */
	hideTooltipOnMouseDown?: boolean;

	/**
	 * Determines if the tooltip should be hidden
	 */
	hideTooltip?: boolean;

	/**
	 * @deprecated Use 'as' instead
	 * Used to determine whether the Action is in a Dropdown.
	 */
	asDropDownItem?: boolean;

	/**
	 * Additional CSS properties on the Action.
	 * Note: This should be replaced with xcss once component has migrate to use DS Primitives
	 */
	overrideCss?: SerializedStyles;

	/**
	 * Used to add space along the inline axis in ActionStackItem.
	 */
	spaceInline?: Space;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Determines whether the button displays as disabled.
	 */
	isDisabled?: boolean;

	/**
	 * Additional styling properties for Primitives based component
	 */
	xcss?: XCSS;

	/**
	 * Allows the use of hyperlinks as buttons via the atlaskit component
	 */
	href?: string;

	/**
	 * Additional text properties for accessibility of actions
	 */
	ariaLabel?: string;

	/**
	 * Optional wrapper component to wrap the action
	 * E.g., Feature discovery pulse
	 * Cleanup on https://product-fabric.atlassian.net/browse/EDM-9649
	 */
	wrapper?: React.ElementType;

	/* Optional callback that can be invoked to update the action blocks loading state */
	onLoadingChange?: (isLoading: boolean) => void;
};
