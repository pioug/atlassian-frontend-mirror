import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

import type { DotsAppearance, Size, Spacing } from './components/types';

export interface ProgressDotsProps extends WithAnalyticsEventsProps {
  /**
   * The color of the indicators
   */
  appearance?: DotsAppearance;
  /**
   * The aria-controls text applied to each indicator, appended by the index
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  ariaControls?: string;
  /**
   * The aria-label text applied to each indicator, appended by the index
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  ariaLabel?: string;
  /**
   * Function called when an indicator is selected
   */
  onSelect?: (eventData: {
    event: React.MouseEvent<HTMLButtonElement>;
    index: number;
  }) => void;
  /**
   * Which indicator is currently selected
   */
  selectedIndex: number;
  /**
   * Corresponds to the width & height of each indicator
   */
  size?: Size;
  /**
   * How much of a gutter is desired between indicators
   */
  spacing?: Spacing;
  /**
   * A hook for automated tests.
   */
  testId?: string;
  /**
   * An array of values mapped over to create the indicators
   */
  values: any[];
}
