/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { Stack } from '../src';
import { BaseBox as Box } from '../src/components/internal/base-box.partial';

export default function Responsive() {
  return (
    <Stack space="200">
      <div>
        <p>Responsive "border width":</p>
        <Box
          width="size.500"
          height="size.500"
          backgroundColor="brand.bold"
          testId="box-responsive-border-width"
          padding="space.100"
          borderStyle="solid"
          borderWidth={{
            xxs: 'size.0',
            md: 'size.050',
            lg: 'size.100',
          }}
          borderColor="danger"
        />
      </div>
      <div>
        <p>
          Responsive "display":
          <br />
          <em>
            Displays "1 2" horizontally for `md` and above and vertically for
            anything below.
          </em>
        </p>
        <Box
          testId="box-responsive-display"
          display={{ xxs: 'block', md: 'flex' }}
          padding="space.300"
        >
          <Box padding="space.100">1</Box>
          <Box padding="space.100">2</Box>
        </Box>
      </div>
      <div>
        <p>Responsive "padding":</p>
        <Box
          testId="box-responsive-padding"
          backgroundColor="success.bold"
          display="inline-block"
          padding={{
            xxs: 'space.025',
            xs: 'space.050',
            sm: 'space.100',
            md: 'space.200',
            lg: 'space.300',
            xl: 'space.400',
            xxl: 'space.500',
          }}
        >
          <Box
            width="size.100"
            height="size.100"
            backgroundColor="warning.bold"
            padding={{
              xxs: 'space.600',
              xs: 'space.500',
              sm: 'space.400',
              md: 'space.300',
              lg: 'space.200',
              xl: 'space.100',
              xxl: 'space.050',
            }}
          />
        </Box>
      </div>
    </Stack>
  );
}
