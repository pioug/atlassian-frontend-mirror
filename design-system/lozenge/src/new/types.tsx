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
export type LozengeSpacing = 'default' | 'spacious';

type NewLozengeBaseProps = {
	/**
	 * Elements to be rendered inside the lozenge. This should ideally be just a word or two.
	 */
	children?: ReactNode;

	/**
	 * Icon to display before the text content. Should be an ADS icon component.
	 */
	iconBefore?: IconProp;

	/**
	 * Controls the overall spacing (padding + height) of the lozenge.
	 *
	 * - `default` matches the current visual appearance.
	 * - `spacious` increases padding and sets the lozenge height to 32px.
	 */
	spacing?: LozengeSpacing;

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
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * @deprecated This prop is deprecated and will be removed. Use Tag component for non-bold styles.
	 */
	isBold?: boolean;
};

type NewLozengeSemanticProps = NewLozengeBaseProps & {
	/**
	 * The appearance of the lozenge. Supports legacy semantic appearances and new semantic colors.
	 */
	appearance?: ThemeAppearance | SemanticColor;

	/**
	 * Numeric metric displayed at the end of the lozenge as a badge.
	 */
	trailingMetric?: string;

	/**
	 * Overrides the appearance of the trailing metric badge.
	 *
	 * If not specified, the trailing metric badge inherits the lozenge appearance.
	 *
	 * This prop is not supported for accent lozenges.
	 */
	trailingMetricAppearance?: ThemeAppearance | SemanticColor | 'inverse';
};

type NewLozengeAccentProps = NewLozengeBaseProps & {
	/**
	 * Accent appearance values.
	 */
	appearance: AccentColor;

	/**
	 * Trailing metric is not supported for accent lozenges.
	 */
	trailingMetric?: never;

	/**
	 * Trailing metric appearance is not supported for accent lozenges.
	 */
	trailingMetricAppearance?: never;
};

export type NewLozengeProps = NewLozengeSemanticProps | NewLozengeAccentProps;

/**
 * Props for LozengeBase (internal). A single merged type so that Lozenge and
 * LozengeDropdownTrigger can pass their props without union narrowing requiring
 * appearance to match only one branch (AccentColor vs ThemeAppearance | SemanticColor).
 * Must not intersect with LozengeDropdownTriggerProps (which extends NewLozengeProps union).
 */
export type LozengeBaseProps = NewLozengeBaseProps & {
	appearance?: ThemeAppearance | SemanticColor | AccentColor;
	trailingMetric?: string;
	trailingMetricAppearance?: ThemeAppearance | SemanticColor | 'inverse';
	isSelected?: boolean;
	isLoading?: boolean;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>, analyticsEvent: UIAnalyticsEvent) => void;
	analyticsContext?: Record<string, any>;
	interactionName?: string;
};

/**
 * Props for the LozengeDropdownTrigger component
 */
export type LozengeDropdownTriggerProps = NewLozengeProps & {
	/**
	 * Whether the dropdown is currently selected/open.
	 */
	isSelected?: boolean;

	/**
	 * Whether the dropdown trigger is in a loading state.
	 * When true, a spinner is shown and the trigger becomes non-interactive.
	 */
	isLoading?: boolean;

	/**
	 * Callback fired when the trigger is clicked. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the [analytics-next documentation](https://atlaskit.atlassian.com/packages/analytics/analytics-next) for more information.
	 */
	onClick?: (event: React.MouseEvent<HTMLButtonElement>, analyticsEvent: UIAnalyticsEvent) => void;

	/**
	 * Additional information to be included in the `context` of Atlaskit analytics events that come from the lozenge dropdown trigger.
	 */
	analyticsContext?: Record<string, any>;

	/**
	 * An optional name used to identify events for React UFO (Unified Frontend Observability) press interactions. For more information, see [React UFO integration](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;
};
