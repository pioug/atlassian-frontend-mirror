import React, { type ReactNode } from 'react';
import { Stack, xcss, Box } from '@atlaskit/primitives';

const centeredFormStyles = xcss({
  height: '100%',
  width: '300px',
  margin: 'auto',
});

export const CenteredForm = ({ children }: { children: ReactNode }) => (
  <Stack
    alignInline="center"
    alignBlock="center"
    grow="fill"
    xcss={centeredFormStyles}
  >
    <Box>{children}</Box>
  </Stack>
);
