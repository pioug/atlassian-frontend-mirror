import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import type { DotsAppearance, Size, Spacing } from './components/types';

export interface ProgressDotsProps {
  /**
   * Sets the color of the indicators.
   */
  appearance?: DotsAppearance;
  /**
   * If interaction is enabled, use `ariaControls` to tell assistive technology what elements are controlled by the progress indicator.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  ariaControls?: string;
  /**
   * Describes what the indicator represents to assistive technology. The selected index number will be appended to the label.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  ariaLabel?: string;
  /**
   * Function called when an indicator is selected.
   */
  onSelect?: (
    eventData: {
      event: React.MouseEvent<HTMLButtonElement>;
      index: number;
    },
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  /**
   * Which indicator is currently selected.
   */
  selectedIndex: number;
  /**
   * Sets the width and height of each indicator.
   */
  size?: Size;
  /**
   * Specifies how much of a gutter there is between indicators.
   */
  spacing?: Spacing;
  /**
   * A hook for automated tests.
   */
  testId?: string;
  /**
   * An array of values mapped over to create the indicators.
   */
  values: any[];
}
