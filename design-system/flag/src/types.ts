import { ComponentType, MouseEventHandler, ReactNode } from 'react';

import {
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { CustomThemeButtonProps } from '@atlaskit/button/types';

export type ActionType = {
  content: ReactNode;
  onClick?: (
    e: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  href?: string;
  target?: string;
  testId?: string;
};

export type AppearanceTypes =
  | 'error'
  | 'info'
  | 'normal'
  | 'success'
  | 'warning';
export type ActionsType = Array<ActionType>;

// exported for testing - keep in sync from `type AppearanceTypes`
export const AppearanceArray: AppearanceTypes[] = [
  'error',
  'info',
  'normal',
  'success',
  'warning',
];

// CreateFlagsArg makes id optional so define this prop separately
type FlagPropsId = {
  /** A unique identifier used for rendering and onDismissed callbacks. */
  id: number | string;
};

type AutoDismissFlagPropsWithoutId = {
  /** Array of clickable actions to be shown at the bottom of the flag. For flags where appearance
   * is 'normal', actions will be shown as links. For all other appearance values, actions will
   * shown as buttons.
   * If href is passed the action will be shown as a link with the passed href prop.
   */
  actions?: ActionsType;
  /** Makes the flag appearance bold. Setting this to anything other than 'normal' hides the
   * dismiss button.
   */
  appearance?: AppearanceTypes;
  /** The secondary content shown below the flag title */
  description?: ReactNode;
  /** The icon displayed in the top-left of the flag. Should be an instance of `@atlaskit/icon`.
   * Your icon will receive the appropriate default color, which you can override by wrapping the
   * icon in a containing element with CSS `color` set to your preferred icon color.
   */
  icon: ReactNode;
  /** The bold text shown at the top of the flag. */
  title: ReactNode;
  /** Handler which will be called when a Flag's dismiss button is clicked.
   * Receives the id of the dismissed Flag as a parameter.
   */
  onDismissed?: (id: number | string, analyticsEvent: UIAnalyticsEvent) => void;
  /** A link component that is passed down to the `@atlaskit/button` used by actions,
  to allow custom routers to be used. See the
  [button with router](https://atlaskit.atlassian.com/packages/design-system/button/example/ButtonWithRouter)
  example of what this component should look like. */
  linkComponent?: ComponentType<CustomThemeButtonProps>;
  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.

   * Will set these elements when defined:

   * - Flag root element - `{testId}`
   * - Close button visible on default flags - `{testId}-dismiss`
   * - Toggle button visible on bold flags - `{testId}-toggle`
   * - Flag content which wraps the description and actions - `{testId}-expander`
   * - Flag description - `{testId}-description`
   * - Flag actions - `{testId}-actions`
   */
  testId?: string;
  /** Additional information to be included in the `context` of analytics events that come from flag */
  analyticsContext?: Record<string, any>;
};

// Normal AutoDismissFlagProps should include the id
export interface AutoDismissFlagProps
  extends AutoDismissFlagPropsWithoutId,
    FlagPropsId {}

// This is extended by CreateFlagArgs
export interface FlagPropsWithoutId
  extends AutoDismissFlagPropsWithoutId,
    WithAnalyticsEventsProps {
  /** Standard onBlur event, applied to Flag by AutoDismissFlag */
  onBlur?: (
    e: React.FocusEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  /** Standard onFocus event, applied to Flag by AutoDismissFlag */
  onFocus?: (
    e: React.FocusEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  /** Standard onMouseOut event, applied to Flag by AutoDismissFlag */
  onMouseOut?: MouseEventHandler;
  /** Standard onMouseOver event, applied to Flag by AutoDismissFlag */
  onMouseOver?: MouseEventHandler;
}

// Normal FlagProps should include the id
export interface FlagProps extends FlagPropsWithoutId, FlagPropsId {}
