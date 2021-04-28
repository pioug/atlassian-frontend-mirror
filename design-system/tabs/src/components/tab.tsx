/** @jsx jsx */
import { jsx } from '@emotion/core';

import { useTab } from '../hooks';
import { TabProps } from '../types';

export default function Tab({ children, testId }: TabProps) {
  const tabAttributes = useTab();
  return (
    <div data-testid={testId} {...tabAttributes}>
      {children}
    </div>
  );
}
