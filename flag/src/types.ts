import { ReactNode, MouseEventHandler, FocusEventHandler } from 'react';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export type ChildrenType = any;
export type ElementType = any;
export type FunctionType = (...args: Array<any>) => any;
export type ActionType = {
  content: ReactNode;
  onClick?: FunctionType;
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

export type AutoDismissFlagProps = {
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
  /** A unique identifier used for rendering and onDismissed callbacks. */
  id: number | string;
  /** Private, do not use. */
  isDismissAllowed?: boolean;
  /** Private, do not use. Use the FlagGroup onDismissed handler. */
  onDismissed?: FunctionType;
  /** The bold text shown at the top of the flag. */
  title: ReactNode;
  /** A link component that is passed down to the `@atlaskit/button` used by actions,
  to allow custom routers to be used. See the
  [button with router](https://atlaskit.atlassian.com/packages/core/button/example/ButtonWithRouter)
  example of what this component should look like. */
  linkComponent?: ElementType;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
};

export interface FlagProps
  extends AutoDismissFlagProps,
    WithAnalyticsEventsProps {
  /** Standard onBlur event, applied to Flag by AutoDismissFlag */
  onBlur?: FocusEventHandler;
  /** Standard onFocus event, applied to Flag by AutoDismissFlag */
  onFocus?: FocusEventHandler;
  /** Standard onMouseOut event, applied to Flag by AutoDismissFlag */
  onMouseOut?: MouseEventHandler;
  /** Standard onMouseOver event, applied to Flag by AutoDismissFlag */
  onMouseOver?: MouseEventHandler;
}
