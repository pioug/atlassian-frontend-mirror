/** @jsx jsx */
import { jsx } from '@emotion/react';

import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, xcss } from '@atlaskit/primitives';

import { UNSAFE_Text as Text } from '../src';

const boxStyles = xcss({
  borderRadius: 'border.radius',
});

export default () => {
  return (
    <Inline space="space.200">
      <Lozenge>Default</Lozenge>
      <Box
        as="span"
        xcss={boxStyles}
        backgroundColor="color.background.neutral"
        paddingInline="space.050"
      >
        <Text
          color="color.text"
          fontSize="size.050"
          fontWeight="bold"
          textTransform="uppercase"
        >
          Default
        </Text>
      </Box>
    </Inline>
  );
};
