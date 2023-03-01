import React, { FC } from 'react';

import Box from '@atlaskit/ds-explorations/box';

export const SkeletonBox: FC = ({ children }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    backgroundColor="discovery"
    borderColor="discovery"
    borderWidth="1px"
    borderStyle="solid"
    height="size.400"
  >
    {children}
  </Box>
);
