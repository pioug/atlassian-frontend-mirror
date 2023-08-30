/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/react';

import { Box } from '@atlaskit/primitives';

import { useTabPanel } from '../hooks';
import { TabPanelAttributesType, TabPanelProps } from '../types';

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
  const {
    role,
    id,
    hidden,
    'aria-labelledby': ariaLabelledBy,
    onMouseDown,
    tabIndex,
  }: TabPanelAttributesType = useTabPanel();
  return (
    <Box
      testId={testId}
      role={role}
      id={id}
      hidden={hidden}
      aria-labelledby={ariaLabelledBy}
      onMouseDown={onMouseDown}
      tabIndex={tabIndex}
    >
      {/* Fragment is a workaround as Box types don't allow ReactNode children */}
      <Fragment>{children}</Fragment>
    </Box>
  );
};

export default TabPanel;
