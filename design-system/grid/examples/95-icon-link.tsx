/** @jsx jsx */
import { FC } from 'react';

import { jsx } from '@emotion/react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
} from '@atlaskit/ds-explorations';

const IconLink: FC = ({ children }) => {
  return (
    <Inline gap="scale.100" alignItems="center">
      <Box
        display="block"
        borderRadius="normal"
        backgroundColor="neutral"
        UNSAFE_style={{ flexShrink: 0 }}
        width="size.200"
        height="size.200"
      />
      {children}
    </Inline>
  );
};

export default IconLink;
