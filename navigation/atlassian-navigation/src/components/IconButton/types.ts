import { CustomThemeButtonProps } from '@atlaskit/button/types';

export type IconButtonProps = BaseIconButtonProps & {
  /**
   * Icon for the button.
   */
  icon: CustomThemeButtonProps['iconBefore'];

  /**
   * Theme for the icon button.
   */
  theme?: CustomThemeButtonProps['theme'];
};

/**
 * We aren't inheriting the types from button here because it blows up ERT.
 */
export interface BaseIconButtonProps {
  /**
   * Unique id for the button.
   */
  id?: string;

  /**
   * On click handler.
   * Second argument is the instrumented analytics event.
   * See @atlaskit/analytics-next for analyticsEvent type information
   */
  onClick?: (event: React.MouseEvent<HTMLElement>, analyticsEvent: any) => void;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;

  /**
   * Text that will be displayed in the tooltip when hovered or focused on the button.
   */
  tooltip: React.ReactNode;

  /**
   * Called when the mouse is initially clicked on the element.
   */
  onMouseDown?: React.MouseEventHandler<HTMLElement>;

  /**
   * Called when the mouse enters the element container.
   */
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;

  /**
   * Called when the mouse leaves the element container.
   */
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;

  /**
   * Causes the button to be disabled.
   */
  isDisabled?: boolean;

  /**
   * If wanting to link to another page you can define the href.
   */
  href?: string;

  /**
   * If defining `href` you may want to define `target` as well.
   */
  target?: string;

  /**
   * Handler for the mouse up event.
   */
  onMouseUp?: React.MouseEventHandler<HTMLElement>;

  /**
   * Handler called when the button gains focus.
   */
  onFocus?: React.FocusEventHandler<HTMLElement>;

  /**
   * Makes the element appear selected.
   */
  isSelected?: boolean;
}

export interface IconButtonSkeletonProps {
  className?: string;
  marginLeft?: number;
  marginRight?: number;
  size?: number;
}
