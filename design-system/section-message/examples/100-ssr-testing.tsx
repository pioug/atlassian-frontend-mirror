import React from 'react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';

const SSRTestingExample = () => {
  return (
    <Box id="ssr-example">
      <Box id="ssr"></Box>
      <Box id="hydrated"></Box>
    </Box>
  );
};

export default SSRTestingExample;
