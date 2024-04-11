import React from 'react';

export interface CreateProps {
  /**
   * Primary text for the call to action.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  text: string;

  /**
   * Aria-label attribute for create button
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  label?: string;

  /**
   * Text for the button tooltip when seen on large viewports.
   */
  buttonTooltip?: React.ReactNode;

  /**
   * Text for the icon button tooltip when seen on small viewports.
   */
  iconButtonTooltip?: React.ReactNode;

  /**
   * Click handler.
   * See @atlaskit/analytics-next for analyticsEvent type information
   */
  onClick?: (e: React.MouseEvent<HTMLElement>, analyticsEvent: any) => void;

  /**
   * Causes the Create action to be rendered as a link. This is suitable for when the Create action is handled as a full page rather than in a modal-dialog.
   */
  href?: string;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   *
   * Will set these elements when defined:
   *
   * - Create button shown on large screen sizes - `{testId}-button`
   * - Create icon button shown on small screen sizes - `{testId}-icon-button`
   */
  testId?: string;
}
