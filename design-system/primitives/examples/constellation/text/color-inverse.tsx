import React from 'react';

import { Box, Inline, xcss } from '@atlaskit/primitives';

import Text from '../../../src/components/text';

const boxStyles = xcss({
  display: 'flex',
  paddingBlock: 'space.400',
  paddingInline: 'space.400',
  alignItems: 'center',
});

export default () => {
  return (
    <Inline space="space.100">
      <Box xcss={boxStyles} backgroundColor="color.background.information">
        <Text variant="ui">Text on information</Text>
      </Box>
      <Box xcss={boxStyles} backgroundColor="color.background.brand.bold">
        <Text variant="ui">Text color automatically inverted</Text>
      </Box>
    </Inline>
  );
};
