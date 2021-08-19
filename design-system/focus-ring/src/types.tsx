import type { ReactElement } from 'react';

export type FocusRingProps = {
  /**
   * Controls whether the focus ring should be applied around or within the composed element.
   */
  isInset?: boolean;
  /**
   * The focusable element to be rendered within the `FocusRing`.
   */
  children: ReactElement;
};
