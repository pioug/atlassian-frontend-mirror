import { ReactNode } from 'react';

export type VisuallyHiddenProps = {
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
  /**
   * The element or elements that should be hidden.
   */
  children: ReactNode;
  /**
   * Role attribute is passed on to the span to aid screen readers.
   */
  role?: string;
};
