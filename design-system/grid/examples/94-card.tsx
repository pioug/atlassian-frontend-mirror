/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { jsx } from '@emotion/react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';

const Card: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box
      display="block"
      padding="space.300"
      borderColor="color.border"
      borderWidth="1px"
      borderRadius="badge"
      borderStyle="solid"
    >
      {children}
    </Box>
  );
};

export default Card;
