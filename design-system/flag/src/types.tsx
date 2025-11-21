/* eslint-disable @repo/internal/react/consistent-types-definitions */
import { type ComponentType, type MouseEventHandler, type ReactNode } from 'react';

import { type UIAnalyticsEvent, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { type CustomThemeButtonProps } from '@atlaskit/button/types';

export type ActionType = {
	content: ReactNode;
	onClick?: (e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => void;
	href?: string;
	target?: string;
	testId?: string;
};

export type ActionsType = Array<ActionType>;

export type AppearanceTypes = 'error' | 'info' | 'success' | 'warning' | 'normal';

export type HeadingColor = 'color.text' | 'color.text.inverse' | 'color.text.warning.inverse';

// exported for testing - keep in sync from `type AppearanceTypes`
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const AppearanceArray: AppearanceTypes[] = ['error', 'info', 'normal', 'success', 'warning'];

// CreateFlagsArg makes id optional so define this prop separately
type FlagPropsId = {
	/**
	 * A unique identifier used for rendering and onDismissed callbacks.
	 */
	id: number | string;
};

type AutoDismissFlagPropsWithoutId = {
	/**
	 * Array of clickable actions to be shown at the bottom of the flag. For flags where appearance
	 * is 'normal', actions will be shown as links. For all other appearance values, actions will
	 * shown as buttons.
	 * If href is passed the action will be shown as a link with the passed href prop.
	 */
	actions?: ActionsType;
	/**
	 * Makes the flag appearance bold. Setting this to anything other than 'normal' hides the
	 * dismiss button.
	 */
	appearance?: AppearanceTypes;
	/**
	 * The secondary content shown below the flag title.
	 */
	description?: ReactNode;
	/**
	 * The icon displayed in the top-left of the flag. Should be an instance of `@atlaskit/icon`.
	 * Your icon will receive the appropriate default color, which you can override by setting
	 * the `color` prop on the icon to your preferred icon color.
	 * If no icon is provided, a default icon will be used based on the appearance prop.
	 */
	icon?: ReactNode;
	/**
	 * The bold text shown at the top of the flag.
	 */
	title: ReactNode;
	/**
	 * Handler which will be called when a Flag's dismiss button is clicked.
	 * Receives the id of the dismissed Flag as a parameter.
	 */
	onDismissed?: (id: number | string, analyticsEvent: UIAnalyticsEvent) => void;
	/**
	 * A link component that is passed down to the `@atlaskit/button` used by actions,
	 * to allow custom routers to be used. See the
	 * [button with router](https://atlaskit.atlassian.com/packages/design-system/button/example/ButtonWithRouter)
	 * example of what this component should look like.
	 */
	linkComponent?: ComponentType<CustomThemeButtonProps>;
	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 *
	 * Will set these elements when defined:
	 *
	 * - Flag root element - `{testId}`
	 * - Close button visible on default flags - `{testId}-dismiss`
	 * - Toggle button visible on bold flags - `{testId}-toggle`
	 * - Flag content which wraps the description and actions - `{testId}-expander`
	 * - Flag description - `{testId}-description`
	 * - Flag actions - `{testId}-actions`
	 */
	testId?: string;
	/**
	 * Additional information to be included in the `context` of analytics events that come from flag.
	 */
	analyticsContext?: Record<string, any>;
	/**
	 * Specifies the heading level in the document structure.
	 * If not specified, the default is `2`.
	 */
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
	/**
	 * Milliseconds to delay the screen reader announcement due to announcement conflict.
	 */
	delayAnnouncement?: number;
	/**
	 * Duration in seconds before flag gets auto dismissed.
	 * Default is 8 seconds. For a11y reasons 8s is also a strongly-suggested minimum.
	 * Only applies to auto-dismissable flags.
	 */
	autoDismissSeconds?: number;
};

// Normal AutoDismissFlagProps should include the id
export interface AutoDismissFlagProps extends AutoDismissFlagPropsWithoutId, FlagPropsId {}

// This is extended by CreateFlagArgs
export interface FlagPropsWithoutId
	extends AutoDismissFlagPropsWithoutId,
		WithAnalyticsEventsProps {
	/**
	 * Standard onBlur event, applied to Flag by AutoDismissFlag.
	 */
	onBlur?: (e: React.FocusEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => void;
	/**
	 * Standard onFocus event, applied to Flag by AutoDismissFlag.
	 */
	onFocus?: (e: React.FocusEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => void;
	/**
	 * Standard onMouseOut event, applied to Flag by AutoDismissFlag.
	 */
	onMouseOut?: MouseEventHandler;
	/**
	 * Standard onMouseOver event, applied to Flag by AutoDismissFlag.
	 */
	onMouseOver?: MouseEventHandler;
	/**
	 * Milliseconds to delay the screen reader announcement due to announcement conflict.
	 */
	delayAnnouncement?: number;
}

// Normal FlagProps should include the id
export interface FlagProps extends FlagPropsWithoutId, FlagPropsId {}
