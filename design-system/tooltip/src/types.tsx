import { ComponentType, ReactNode } from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Placement } from '@atlaskit/popper';

import { TooltipPrimitiveProps } from './TooltipPrimitive';

export type PositionTypeBase = Placement;
export type PositionType = PositionTypeBase | 'mouse';

export interface TriggerProps {
  onMouseOver: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseOut: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  onFocus: (event: React.FocusEvent<HTMLElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLElement>) => void;
  ref: (node: HTMLElement | null) => void;
}

export interface TooltipProps {
  /**
   * The content of the tooltip. It can be either a:
   * 1. `ReactNode`
   * 2. Function which returns a `ReactNode`

   * The benefit of the second approach is that it allows you to consume the `update` render prop.
   * This `update` function can be called to manually recalculate the position of the tooltip.
   */
  content: ReactNode | (({ update }: { update: () => void }) => ReactNode);

  /**
   * Extend `TooltipPrimitive` to create your own tooltip and pass it as component
   */
  component?: ComponentType<TooltipPrimitiveProps>;

  /**
   * Time in milliseconds to wait before showing and hiding the tooltip. Defaults to 300.
   */
  delay?: number;

  /**
   * Hide the tooltip when the click event is triggered. This should be
   * used when tooltip should be hidden if `onClick` react synthetic event
   * is triggered, which happens after `onMouseDown` event
   */
  hideTooltipOnClick?: boolean;

  /**
   * Hide the tooltip when the mousedown event is triggered. This should be
   * used when tooltip should be hidden if `onMouseDown` react synthetic event
   * is triggered, which happens before `onClick` event
   */
  hideTooltipOnMouseDown?: boolean;

  /**
   * Where the tooltip should appear relative to the mouse pointer.
   * Only used when the `position` prop is set to `"mouse"`.
   * When interacting with the target element using the keyboard will use this position against the target element instead.
   */
  mousePosition?: PositionTypeBase;

  /**
   * Function to be called when the tooltip will be shown. It is called when the
   * tooltip begins to animate in.
   */
  onShow?: (analyticsEvent: UIAnalyticsEvent) => void;

  /**
   * Function to be called when the tooltip will be hidden. It is called after the
   * delay, when the tooltip begins to animate out.
   */
  onHide?: (analyticsEvent: UIAnalyticsEvent) => void;

  /**
   * Where the tooltip should appear relative to its target.
   * If set to `"mouse"` the tooltip will display next to the mouse pointer instead.
   * Make sure to utilize the `mousePosition` if you want to customize where the tooltip will show in relation to the mouse.
   */
  position?: PositionType;

  /**
   * Replace the wrapping element. This accepts the name of a html tag which will
   * be used to wrap the element.
   * If you provide a component it needs to support a ref prop which is used by popper for positioning
   */
  tag?:
    | keyof JSX.IntrinsicElements
    | React.ComponentType<
        React.AllHTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLElement> }
      >;

  /**
   * Show only one line of text, and truncate when too long
   */
  truncate?: boolean;

  /**
   * Elements to be wrapped by the tooltip.
   * It can be either a:
   * 1. `ReactNode`
   * 2. Function which returns a `ReactNode`
   */
  children: ReactNode | ((props: TriggerProps) => ReactNode);

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;

  /** Analytics context metadata */
  analyticsContext?: Record<string, any>;

  /**
   * Used to define the strategy of popper.
   */
  strategy?: 'absolute' | 'fixed' | undefined;
}
