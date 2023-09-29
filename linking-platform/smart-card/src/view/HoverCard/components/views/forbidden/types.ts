import { FlexibleCardProps } from '../../../../FlexibleCard/types';

export type HoverCardForbiddenProps = {
  /**
   * Data required for rendering a Flexible Card
   */
  flexibleCardProps: FlexibleCardProps;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
};
