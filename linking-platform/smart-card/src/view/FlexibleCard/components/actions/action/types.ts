import type { Appearance } from '@atlaskit/button/types';
import type { Space, XCSS } from '@atlaskit/primitives';
import type { SerializedStyles } from '@emotion/react';
import type { ReactChild, ReactNode } from 'react';
import type { SmartLinkSize } from '../../../../../constants';

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
};
