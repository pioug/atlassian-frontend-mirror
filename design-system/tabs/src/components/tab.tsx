/** @jsx jsx */
import { jsx } from '@emotion/core';

import { useTab } from '../hooks';
import { TabProps } from '../types';

/**
 * __Tab__
 *
 * Tab represents an indivudal Tab displayed in a TabList.
 *
 * - [Examples](https://atlassian.design/components/tabs/examples)
 * - [Code](https://atlassian.design/components/tabs/code)
 * - [Usage](https://atlassian.design/components/tabs/usage)
 */
export default function Tab({ children, testId }: TabProps) {
  const tabAttributes = useTab();
  return (
    <div data-testid={testId} {...tabAttributes}>
      {children}
    </div>
  );
}
