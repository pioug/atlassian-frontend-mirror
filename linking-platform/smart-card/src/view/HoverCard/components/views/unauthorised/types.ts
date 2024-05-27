import { type FlexibleCardProps } from '../../../../FlexibleCard/types';
import { type AnalyticsFacade } from '../../../../../state/analytics';

export type HoverCardUnauthorisedProps = {
  /**
   * An AnalyticsFacade object used for calling analytics.
   */
  analytics: AnalyticsFacade;

  /**
   * Provides the extensionKey of a Smart Link resolver invoked.
   */
  extensionKey?: string;

  /**
   * Data required for rendering a Flexible Card
   */
  flexibleCardProps: FlexibleCardProps;

  /**
   *  A unique ID for a Smart Link.
   */
  id?: string;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;

  /**
   * The url that we were trying to resolve and that has the 'unauthorized' state for the current user
   */
  url: string;
};
