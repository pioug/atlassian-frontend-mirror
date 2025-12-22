import type { CSSProperties, ReactNode } from 'react';

export type ThemeAppearance =
	| 'added'
	| 'default'
	| 'important'
	| 'primary'
	| 'primaryInverted'
	| 'removed'
	| 'warning'
	| 'discovery'
	| 'danger'
	| 'neutral'
	| 'success'
	| 'information'
	| 'inverse';

export interface BadgeProps {
	/**
	 * Affects the visual style of the badge.
	 */
	appearance?: ThemeAppearance;

	/**
	 * The value displayed within the badge. A `ReactNode` can be provided for
	 * custom-formatted numbers, however, badge should only be used in cases where you want to represent
	 * a number.
	 * Use a [lozenge](/packages/design-system/lozenge) for non-numeric information.
	 */
	children?: number | ReactNode;

	/**
	 * The maximum value to display. Defaults to `99`. If the value is 100, and max is 50, "50+" will be displayed.
	 * This value should be greater than 0. If set to `false` the original value will be displayed regardless of
	 * whether it is larger than the default maximum value.
	 */
	max?: number | false;

	/**
	 * Style customization to apply to the badge. Only `backgroundColor` and `color` are supported.
	 */
	style?: Pick<CSSProperties, 'backgroundColor' | 'color'>;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
	 */
	testId?: string;
}

/**
 * New appearance types for visual refresh.
 */
export type NewAppearance =
	| 'success'
	| 'danger'
	| 'neutral'
	| 'information'
	| 'inverse'
	| 'warning'
	| 'discovery';

/**
 * Props for BadgeNew component with new appearance names.
 */
export interface BadgeNewProps {
	/**
	 * Affects the visual style of the badge.
	 * Uses the new naming convention:
	 * - success: Green (replaces "added")
	 * - danger: Red (replaces "removed" and "important")
	 * - neutral: Gray (replaces "default")
	 * - information: Blue (replaces "primary")
	 * - inverse: Inverted colors (replaces "primaryInverted")
	 */
	appearance?: NewAppearance;

	/**
	 * The value displayed within the badge. A `ReactNode` can be provided for
	 * custom-formatted numbers, however, badge should only be used in cases where you want to represent
	 * a number.
	 * Use a [lozenge](/packages/design-system/lozenge/lozenge) for non-numeric information.
	 */
	children?: number | ReactNode;

	/**
	 * The maximum value to display. Defaults to `99`. If the value is 100, and max is 50, "50+" will be displayed.
	 * This value should be greater than 0. If set to `false` the original value will be displayed regardless of
	 * whether it is larger than the default maximum value.
	 */
	max?: number | false;

	/**
	 * Style customization to apply to the badge. Only `backgroundColor` and `color` are supported.
	 */
	style?: Pick<CSSProperties, 'backgroundColor' | 'color'>;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
	 */
	testId?: string;
}
