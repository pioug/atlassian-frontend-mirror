/** @jsx jsx */
import { jsx } from '@emotion/core';

import Lozenge from '@atlaskit/lozenge';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
  UNSAFE_Text as Text,
} from '../src';

export default () => {
  return (
    <Inline gap="sp-200">
      <Lozenge>Default</Lozenge>
      <Box
        backgroundColor={['neutral', 'grey']}
        borderRadius="normal"
        as="span"
        paddingInline="sp-50"
      >
        {/* textTransform: uppercase, font-weight: 700 */}
        <Text fontSize="11" color={['color.text', 'grey']}>
          Default
        </Text>
      </Box>
    </Inline>
  );
};
