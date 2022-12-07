import { FlexibleCardProps } from '../../../../FlexibleCard/types';

export type HoverCardUnauthorisedProps = {
  /**
   * Data required for rendering a Flexible Card
   */
  flexibleCardProps: FlexibleCardProps;

  /**
   * A function that determines an additional action that can be performed on an unauthorised link, e.g.
   * connecting an account to gain access.
   * @internal
   */
  onAuthorize?: () => void;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
};
