import React, { FC } from 'react';

import Box from '@atlaskit/ds-explorations/box';

export const SkeletonBox: FC = ({ children }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    backgroundColor="elevation.surface.sunken"
    borderColor="color.border"
    borderWidth="3px"
    borderStyle="solid"
    height="size.600"
  >
    {children}
  </Box>
);
