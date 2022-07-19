## API Report File for "@atlaskit/progress-indicator"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
/// <reference types="react" />

import { FC } from 'react';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';

declare type DotsAppearance = 'default' | 'help' | 'inverted' | 'primary';

export declare interface ProgressDotsProps {
  /**
   * The color of the indicators
   */
  appearance?: DotsAppearance;
  /**
   * The aria-controls text applied to each indicator, appended by the index
   */
  ariaControls?: string;
  /**
   * The aria-label text applied to each indicator, appended by the index
   */
  ariaLabel?: string;
  /**
   * Function called when an indicator is selected
   */
  onSelect?: (
    eventData: {
      event: React.MouseEvent<HTMLButtonElement>;
      index: number;
    },
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
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

/**
 * __ProgressDots__
 *
 * A progress indicator shows the user where they are along the steps of a journey.
 */
export declare const ProgressIndicator: FC<ProgressDotsProps>;

declare type Size = 'small' | 'default' | 'large';

declare type Spacing = 'comfortable' | 'cozy' | 'compact';

export {};
```