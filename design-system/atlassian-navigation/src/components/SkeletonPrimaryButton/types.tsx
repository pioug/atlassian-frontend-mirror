import { ReactNode } from 'react';

export type SkeletonPrimaryButtonProps = {
  /**
   * Text content to be displayed inside the skeleton button.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  text?: ReactNode;
  /**
   * Children to be displayed inside the skeleton button.
   * Renders if `text` prop not set
   */
  children?: ReactNode;
  /**
   * Sets the appearance of the skeleton button to look like a dropdown button
   */
  isDropdownButton?: boolean;
  /**
   * Sets the appearance of the skeleton button to look highlighted.
   */
  isHighlighted?: boolean;
  /**
   * A unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
};
