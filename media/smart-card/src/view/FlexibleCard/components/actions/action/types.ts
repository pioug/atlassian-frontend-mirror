import { SerializedStyles } from '@emotion/core';
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
};

export type ActionIconProps = {
  /**
   * Determines the size of the Icon within the Action.
   */
  size?: SmartLinkSize;

  /**
   * Determines the icon within the Action.
   */
  icon?: ReactChild;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
};
