/** @jsx jsx */
import { jsx } from '@emotion/react';

import Lozenge from '@atlaskit/lozenge';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
  UNSAFE_Text as Text,
} from '../src';

export default () => {
  return (
    <Inline gap="scale.200">
      <Lozenge>Default</Lozenge>
      <Box
        backgroundColor="neutral"
        borderRadius="normal"
        as="span"
        paddingInline="scale.050"
      >
        <Text
          color="color.text"
          fontSize="11px"
          fontWeight="700"
          textTransform="uppercase"
        >
          Default
        </Text>
      </Box>
    </Inline>
  );
};
