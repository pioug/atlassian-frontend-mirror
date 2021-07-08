import { ReactNode } from 'react';

import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

export interface BlanketProps {
  /**
   * Whether mouse events can pierce the blanket. If true, onBlanketClicked will not be fired.
   */
  shouldAllowClickThrough?: boolean;
  /**
   * Whether the blanket has a tinted background color.
   */
  isTinted?: boolean;
  /**
   * Handler function to be called when the blanket is clicked.
   */
  onBlanketClicked?: (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  /**
   * Additional information to be included in the `context` of analytics events.
   */
  analyticsContext?: Record<string, any>;
  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
  /**
   * The children to be rendered within Blanket.
   */
  children?: ReactNode;
}
