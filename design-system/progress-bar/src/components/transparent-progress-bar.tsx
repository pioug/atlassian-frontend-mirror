import React from 'react';

import { type CustomProgressBarProps } from '../types';

import ProgressBar from './progress-bar';

/**
 * __Transparent progress bar__
 *
 * A transparent progress bar is used on bold backgrounds to maintain suitable contrast.
 *
 * - [Examples](https://atlassian.design/components/progress-bar/transparent-progress-bar/examples)
 * - [Code](https://atlassian.design/components/progress-bar/transparent-progress-bar/code)
 */
const TransparentProgressBar = ({
  ariaLabel,
  isIndeterminate = false,
  testId,
  value = 0,
}: CustomProgressBarProps) => {
  return (
    <ProgressBar
      appearance="inverse"
      value={value}
      isIndeterminate={isIndeterminate}
      ariaLabel={ariaLabel}
      testId={testId}
    />
  );
};

export default TransparentProgressBar;
