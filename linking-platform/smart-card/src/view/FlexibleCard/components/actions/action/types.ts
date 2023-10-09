import { SerializedStyles } from '@emotion/react';
import { SmartLinkSize } from '../../../../../constants';
import { Appearance } from '@atlaskit/button/types';
import { ReactChild } from 'react';

export type ActionProps = {
  /**
   * Determines the size of the Action. Corresponds to an Action appearance.
   */
  size?: SmartLinkSize;

  /**
   * Determines the text content of the Action.
   */
  content?: React.ReactNode;

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
   * Determines the tooltip message when hovering over the Action.
   */
  tooltipMessage?: React.ReactNode;

  /**
   * Used to determine whether the Action is in a Dropdown.
   */
  asDropDownItem?: boolean;

  /**
   * Additional CSS properties on the Action.
   */
  overrideCss?: SerializedStyles;

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
};

/**
 * The internal props that should only be controlled by internal components
 * and/or used by experiment. If there is a use case where these props/feature
 * should be available as part of smart-card, please move them to ActionProps.
 */
export type InternalActionProps = {
  /**
   * Conditionally show a spinner over the top of a button or disable a dropdown item
   * while server action is executing.
   */
  isLoading?: boolean;
};
