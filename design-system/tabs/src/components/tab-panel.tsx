/** @jsx jsx */
import { jsx } from '@emotion/core';

import { useTabPanel } from '../hooks';
import { TabPanelProps } from '../types';

// Note this is not being memoized as children is an unstable reference
const TabPanel = ({ children, testId }: TabPanelProps) => {
  const tabPanelAttributes = useTabPanel();
  return (
    <div data-testid={testId} {...tabPanelAttributes}>
      {children}
    </div>
  );
};
export default TabPanel;
