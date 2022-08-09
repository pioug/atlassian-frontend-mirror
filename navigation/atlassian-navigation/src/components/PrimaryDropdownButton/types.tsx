import { PrimaryButtonProps } from '../PrimaryButton/types';

export type PrimaryDropdownButtonProps = Omit<
  PrimaryButtonProps,
  'iconAfter'
> & {
  /**
   * Will set the appearance of the button to look highlighted.
   */
  isHighlighted?: boolean;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;

  /**
   * Optional text to show when the button is focused or hovered.
   */
  tooltip?: React.ReactNode;
};
