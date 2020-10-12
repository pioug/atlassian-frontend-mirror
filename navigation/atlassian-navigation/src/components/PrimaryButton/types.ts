import { CustomThemeButtonProps } from '@atlaskit/button/types';

export type PrimaryButtonProps = Omit<
  CustomThemeButtonProps,
  'appearance' | 'onClick'
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

  /**
   * On click handler.
   * See @atlaskit/analytics-next for analyticsEvent type information
   */
  onClick?: (event: React.MouseEvent<HTMLElement>, analyticsEvent: any) => void;
};

export type PrimaryButtonSkeletonProps = {
  className?: string;
};
