import React from 'react';

import { Stack } from '@atlaskit/primitives';

import Heading from '../../src';

export default () => {
  return (
    <Stack testId="headings" space="space.100">
      <Heading variant="xxlarge">XXL (I'm h1)</Heading>
      <Heading variant="xlarge">XL (I'm h2)</Heading>
      <Heading variant="large">LG (I'm h3)</Heading>
      <Heading variant="medium">MD (I'm h4)</Heading>
      <Heading variant="small">SM (I'm h5)</Heading>
      <Heading variant="xsmall">XS (I'm h6)</Heading>
      <Heading variant="xxsmall">XXS (I'm div)</Heading>
    </Stack>
  );
};
