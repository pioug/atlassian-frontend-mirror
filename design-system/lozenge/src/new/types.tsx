import type { ComponentType, CSSProperties, ReactNode } from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type NewIconProps } from '@atlaskit/icon/types';

import { type ThemeAppearance } from '../lozenge';

/**
 * Semantic color types for the new lozenge API
 */
export type SemanticColor =
	| 'success'
	| 'warning'
	| 'danger'
	| 'information'
	| 'neutral'
	| 'discovery';

/**
 * Accent color types for the new lozenge API
 */
export type AccentColor =
	| 'accent-red'
	| 'accent-orange'
	| 'accent-yellow'
	| 'accent-lime'
	| 'accent-green'
	| 'accent-teal'
	| 'accent-blue'
	| 'accent-purple'
	| 'accent-magenta'
	| 'accent-gray';

/**
 * Union type of all supported color variants
 */
export type LozengeColor = SemanticColor | AccentColor;

/**
 * Icon component prop type
 */
export type IconProp = ComponentType<Omit<NewIconProps, 'spacing'>>;

/**
 * Props for the NewLozenge component
 */
export interface NewLozengeProps {
	/**
	 * The appearance of the lozenge. Supports both legacy semantic appearances and new accent/semantic colors.
	 * Legacy appearances (default, success, removed, inprogress, new, moved) are automatically mapped to the new semantic colors.
	 */
	appearance?: ThemeAppearance | LozengeColor;

	/**
	 * Elements to be rendered inside the lozenge. This should ideally be just a word or two.
	 */
	children?: ReactNode;

	/**
	 * Icon to display before the text content. Should be an ADS icon component.
	 */
	iconBefore?: IconProp;

	/**
	 * Whether the lozenge is interactive (dropdown trigger). Only used internally.
	 * @internal
	 */
	isInteractive?: boolean;

	/**
	 * Whether the lozenge is selected (for dropdown triggers). Only used internally.
	 * @internal
	 */
	isSelected?: boolean;

	/**
	 * max-width of lozenge container. Default to 200px.
	 */
	maxWidth?: number | string;

	/**
	 * Style customization to apply to the lozenge. Only `backgroundColor` and `color` are supported.
	 * @deprecated This prop is deprecated and will be removed in a future version.
	 */
	style?: Pick<CSSProperties, 'backgroundColor' | 'color'>;

	/**
	 * Callback fired when the lozenge is clicked (only for interactive lozenges).
	 * The second argument provides an Atlaskit UI analytics event.
	 * @internal
	 */
	onClick?: (
		event: React.MouseEvent<HTMLButtonElement>,
		analyticsEvent: UIAnalyticsEvent,
	) => void;

	/**
	 * Additional information to be included in the `context` of Atlaskit analytics events.
	 * @internal
	 */
	analyticsContext?: Record<string, any>;

	/**
	 * An optional name used to identify events for React UFO press interactions.
	 * @internal
	 */
	interactionName?: string;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * @deprecated This prop is deprecated and will be removed. Use Tag component for non-bold styles.
	 */
	isBold?: boolean;
}

/**
 * Props for the LozengeDropdownTrigger component
 */
export interface LozengeDropdownTriggerProps
	extends Omit<NewLozengeProps, 'onClick' | 'isInteractive'> {
	/**
	 * Whether the dropdown is currently selected/open.
	 */
	isSelected?: boolean;

	/**
	 * Callback fired when the trigger is clicked. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the [analytics-next documentation](https://atlaskit.atlassian.com/packages/analytics/analytics-next) for more information.
	 */
	onClick?: (
		event: React.MouseEvent<HTMLButtonElement>,
		analyticsEvent: UIAnalyticsEvent,
	) => void;

	/**
	 * Additional information to be included in the `context` of Atlaskit analytics events that come from the lozenge dropdown trigger.
	 */
	analyticsContext?: Record<string, any>;

	/**
	 * An optional name used to identify events for React UFO (Unified Frontend Observability) press interactions. For more information, see [React UFO integration](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;
}
