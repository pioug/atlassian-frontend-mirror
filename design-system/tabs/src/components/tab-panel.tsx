/** @jsx jsx */
import { jsx } from '@emotion/react';

import { useTabPanel } from '../hooks';
import { TabPanelProps } from '../types';

// Note this is not being memoized as children is an unstable reference
/**
 * __TabPanel__
 *
 * A TabPanel houses the contents of a Tab.
 *
 * - [Examples](https://atlassian.design/components/tabs/examples)
 * - [Code](https://atlassian.design/components/tabs/code)
 * - [Usage](https://atlassian.design/components/tabs/usage)
 */
const TabPanel = ({ children, testId }: TabPanelProps) => {
  const tabPanelAttributes = useTabPanel();
  return (
    <div data-testid={testId} {...tabPanelAttributes}>
      {children}
    </div>
  );
};
export default TabPanel;
