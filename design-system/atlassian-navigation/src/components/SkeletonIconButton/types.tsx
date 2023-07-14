import { ReactNode } from 'react';

export type SkeletonIconButtonProps = {
  /**
   * Content to be placed inside the skeleton.
   */
  children: ReactNode;
  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
  /**
   *  Describes the specific role of this navigation component for users viewing the page with a screen
   *  reader. Differentiates from other navigation buttons on a page.
   */
  label?: string;
};
