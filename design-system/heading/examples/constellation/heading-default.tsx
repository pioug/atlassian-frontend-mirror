import React from 'react';

import { UNSAFE_Stack as Stack } from '@atlaskit/ds-explorations';

import Heading from '../../src';

export default () => {
  return (
    <Stack gap="scale.100">
      <Heading level="h900">H900</Heading>
      <Heading level="h800">H800</Heading>
      <Heading level="h700">H700</Heading>
      <Heading level="h600">H600</Heading>
      <Heading level="h500">H500</Heading>
      <Heading level="h400">H400</Heading>
      <Heading level="h300">H300</Heading>
      <Heading level="h200">H200</Heading>
      <Heading level="h100">H100</Heading>
    </Stack>
  );
};
