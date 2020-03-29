import { StyledComponentClass } from 'styled-components';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export type PositionTypeBase = 'bottom' | 'left' | 'right' | 'top';
export type PositionType = PositionTypeBase | 'mouse';

export interface FakeMouseElement {
  getBoundingClientRect: () => {
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
  };
  clientWidth: number;
  clientHeight: number;
}

export interface TooltipProps extends WithAnalyticsEventsProps {
  /**
   * The content of the tooltip
   */
  content: React.ReactNode;

  /**
   * Extend `TooltipPrimitive` to create your own tooltip and pass it as component
   */
  component?: StyledComponentClass<
    { truncate?: boolean; style?: any; className?: any },
    any
  >;

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
  onShow?: () => void;

  /**
   * Function to be called when the tooltip will be hidden. It is called after the
   * delay, when the tooltip begins to animate out.
   */
  onHide?: () => void;

  /**
   * Where the tooltip should appear relative to its target.
   * If set to `"mouse"` the tooltip will display next to the mouse pointer instead.
   * Make sure to utilize the `mousePosition` if you want to customize where the tooltip will show in relation to the mouse.
   */
  position?: PositionType;

  /**
   * Replace the wrapping element. This accepts the name of a html tag which will
   * be used to wrap the element.
   */
  tag?: React.ElementType;

  /**
   * Show only one line of text, and truncate when too long
   */
  truncate?: boolean;

  /**
   * Elements to be wrapped by the tooltip
   */
  children: React.ReactNode;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;
}

export interface TooltipState {
  immediatelyHide: boolean;
  immediatelyShow: boolean;
  isVisible: boolean;
  renderTooltip: boolean;
}

export interface FakeMouseCoordinates {
  top: number;
  left: number;
}
