/** @jsx jsx */
import { jsx } from '@emotion/react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';

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
    <Box as="div" testId={testId} {...tabAttributes}>
      <Text shouldTruncate UNSAFE_style={{ color: 'inherit' }}>
        {children}
      </Text>
    </Box>
  );
}
