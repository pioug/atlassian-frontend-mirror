/** @jsx jsx */
import { FC } from 'react';

import { jsx } from '@emotion/react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';

const Card: FC = ({ children }) => {
  return (
    <Box
      display="block"
      padding="scale.300"
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
