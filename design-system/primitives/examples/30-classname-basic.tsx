/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, xcss } from '../src';

const containerStyles = xcss({ display: 'flex' });

const boxStyles = xcss<typeof Box>({
  backgroundColor: 'danger',
  border: '2px solid rebeccapurple',
  padding: 'space.200',
  borderRadius: 'radius.050',
});

const inlineStyles = xcss<typeof Inline>({
  backgroundColor: 'inverse.subtle',
  // @ts-expect-error because `InlineStyles` does not accept `border`
  border: '2px solid red',
  padding: 'space.200',
  borderRadius: 'radius.050',
});

const defaultStyles = xcss({
  backgroundColor: 'success',
  border: '2px solid green',
  borderRadius: 'radius.050',
});

export default () => (
  <Box xcss={containerStyles} padding="space.100">
    <Inline space="100" testId="classname-examples">
      <Box
        backgroundColor="discovery.bold"
        padding="space.200"
        xcss={boxStyles}
      />
      <Box
        backgroundColor="success"
        padding="space.200"
        // @ts-expect-error because these are `inlineStyles` given to a `Box`
        xcss={inlineStyles}
      />
      <Box
        backgroundColor="discovery.bold"
        padding="space.200"
        xcss={defaultStyles}
      />
    </Inline>
  </Box>
);
