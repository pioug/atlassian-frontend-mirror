/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';

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
    <Box testId={testId} as="div" {...tabPanelAttributes}>
      {/* Fragment is a workaround as Box types don't allow ReactNode children */}
      <Fragment>{children}</Fragment>
    </Box>
  );
};
export default TabPanel;
