/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { jsx } from '@emotion/react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';
import Inline from '@atlaskit/primitives/inline';

const IconLink: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Inline space="100" alignBlock="center">
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
