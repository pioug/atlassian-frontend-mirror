import React from 'react';

import { CustomProgressBarProps } from '../types';

import ProgressBar from './progress-bar';

/**
 * __Success progress bar__
 *
 * A success progress bar indicates the completion of a process.
 *
 * - [Examples](https://atlassian.design/components/progress-bar/success-progress-bar/examples)
 * - [Code](https://atlassian.design/components/progress-bar/success-progress-bar/code)
 */
const SuccessProgressBar = ({
  ariaLabel,
  isIndeterminate = false,
  testId,
  value = 0,
}: CustomProgressBarProps) => {
  return (
    <ProgressBar
      appearance={value < 1 || isIndeterminate ? 'default' : 'success'}
      value={value}
      isIndeterminate={isIndeterminate}
      ariaLabel={ariaLabel}
      testId={testId}
    />
  );
};

export default SuccessProgressBar;
