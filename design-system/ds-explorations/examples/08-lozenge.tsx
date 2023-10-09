/** @jsx jsx */
import { jsx } from '@emotion/react';

import Lozenge from '@atlaskit/lozenge';
import Inline from '@atlaskit/primitives/inline';

import { UNSAFE_Box as Box, UNSAFE_Text as Text } from '../src';

export default () => {
  return (
    <Inline space="space.200">
      <Lozenge>Default</Lozenge>
      <Box
        backgroundColor="neutral"
        borderRadius="normal"
        as="span"
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
