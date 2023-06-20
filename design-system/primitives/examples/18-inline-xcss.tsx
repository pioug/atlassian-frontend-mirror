/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, xcss } from '../src';

const blockStyles = xcss({ borderRadius: 'border.radius.050' });
const inlineStyles = xcss<typeof Inline>({
  padding: 'space.800',
});

export default () => (
  <Inline testId="inline-example" xcss={inlineStyles} space="space.100">
    <Box
      xcss={blockStyles}
      backgroundColor="color.background.discovery.bold"
      padding="space.200"
    />
    <Box
      xcss={blockStyles}
      backgroundColor="color.background.discovery.bold"
      padding="space.200"
    />
  </Inline>
);
