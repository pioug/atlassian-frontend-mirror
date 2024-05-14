import React from 'react';

import { Box, Stack, Text, xcss } from '@atlaskit/primitives';

export default () => {
  return (
    <Box xcss={boxStyles}>
      <Stack space="space.300">
        <Text maxLines={1}>This text truncates within one line and displays an ellipsis at the end of the content to indicate truncation has occurred.</Text>
        <Text maxLines={2}>This text truncates within two lines and displays an ellipsis at the end of the content to indicate truncation has occurred.</Text>
        <Text maxLines={3}>This text truncates within three lines and displays an ellipsis at the end of the content to indicate truncation has occurred.</Text>
      </Stack>
    </Box>
  );
};

const boxStyles = xcss({
  width: '220px'
})
